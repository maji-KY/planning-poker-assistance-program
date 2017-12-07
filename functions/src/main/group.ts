import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

const corsFilter = cors({"origin": true});

export const createGroup = functions.https.onRequest(async (req, res) => {
  corsFilter(req, res, await (async () => {
    const { userId, organizationId, groupName } = req.body;

    if (userId && organizationId && groupName) {
      const fs = admin.firestore();
      const user = await fs.collection("users").doc(userId).get();
      if (user.exists) {
        const createdGroupId = (+new Date).toString(36);
        const organizationRef = fs.collection("organizations").doc(organizationId);
        const organization = await organizationRef.get();
        if (organization.exists) {
          await organizationRef.collection("groups").doc(createdGroupId).set({
            "name": groupName,
            "topic": "New Planning",
            "allReady": false
          });
          res.status(201).send("created");
        } else {
          res.status(400).send("invalid organizationId");
        }
      } else {
        res.status(400).send("invalid userId");
      }
    } else {
      res.status(400).send("userId and organizationId and groupName required");
    }
  }));
});
