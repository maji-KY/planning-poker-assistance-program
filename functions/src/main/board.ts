import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import GroupUser from "models/GroupUser";

function isStopperTrump(trump: string): boolean {
  return trump === "BIG" || trump === "?" || trump === "BREAK";
}

export const updateBoardByTrump = functions.firestore
  .document("/organizations/{organizationId}/groups/{groupId}/users/{userId}")
  .onUpdate(async (_, context) => {
    const { organizationId, groupId }: any = context.params;

    const fs = admin.firestore();

    const groupsData = (
      await fs.collection("organizations").doc(organizationId).collection("groups").doc(groupId).get()
    ).data();
    console.log(`get allReady: /organizations/${organizationId}/groups/${groupId}:${JSON.stringify(groupsData)}`);
    if (groupsData && groupsData.allReady) {
      return;
    }

    const groupUsersSS = await fs
      .collection("organizations")
      .doc(organizationId)
      .collection("groups")
      .doc(groupId)
      .collection("users")
      .get();
    const groupUsers = groupUsersSS.docs.map(doc => {
      const { rightToTalk, ready, trump } = doc.data();
      return new GroupUser(groupId, doc.id, rightToTalk, ready, trump);
    });

    const allReady =
      groupUsers.length > 0 &&
      groupUsers.reduce((currentReady, gu) => currentReady && gu.ready && !isStopperTrump(gu.trump), true);
    if (allReady) {
      await fs.collection("organizations").doc(organizationId).collection("groups").doc(groupId).update({
        allReady,
      });
      console.log(`set allReady: /organizations/${organizationId}/groups/${groupId}`);

      await new Promise(resolve => setTimeout(resolve, 300));

      const isUnanimous = groupUsers.reduce((a, b) => (a === b.trump ? a : false), groupUsers[0].trump);
      if (isUnanimous) {
        // unanimous
        groupUsersSS.docs.map(doc => {
          doc.ref.update({
            "rightToTalk": true,
          });
        });
        await groupUsersSS.docs
          .reduce((batch, doc) => batch.update(doc.ref, { "rightToTalk": true }), fs.batch())
          .commit();
      } else {
        // rightToTalk
        const groupByTrump: Map<string, GroupUser[]> = groupUsers.reduce((map, val) => {
          if (map.has(val.trump)) {
            map.set(val.trump, [...map.get(val.trump), val]);
          } else {
            map.set(val.trump, [val]);
          }
          return map;
        }, new Map());
        const sortedKeys = Array.from(groupByTrump.keys()).sort((a, b) => ~~a - ~~b);
        const smallestTrump = [...sortedKeys].shift() || "";
        const biggestTrump = [...sortedKeys].pop() || "";

        async function chooseAndGrantRightToTalk(trumpKey: string) {
          const targetUsers = groupByTrump.get(trumpKey) || [];
          const uid = targetUsers[Math.floor(Math.random() * targetUsers.length)].userId;
          console.log(
            `trump=${trumpKey}, 君に決めた☆: /organizations/${organizationId}/groups/${groupId}/users/${uid}`,
          );
          await fs
            .collection("organizations")
            .doc(organizationId)
            .collection("groups")
            .doc(groupId)
            .collection("users")
            .doc(uid)
            .update({
              "rightToTalk": true,
            });
        }
        await chooseAndGrantRightToTalk(smallestTrump);
        await chooseAndGrantRightToTalk(biggestTrump);
      }
    }
  });
