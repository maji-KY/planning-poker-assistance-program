import { MiddlewareAPI } from "redux";
import actionCreatorFactory, { Action } from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Epic, combineEpics } from "redux-observable";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/ignoreElements";
import "utils/fsa-redux-observable";

import { getFirestore } from "utils/Firebase";

import User from "models/User";
import Organization from "models/Organization";
import Group from "models/Group";
import GroupUser from "models/GroupUser";
import Player from "models/Player";
import { pushError } from "modules/MyAppBarMenu";
import { locationChangeOf } from "utils/LocationChanges";
import { loginUser } from "utils/Apps";

import { makeUserBoardJoined } from "selectors";

// action
const actionCreator = actionCreatorFactory("BOARD");

export interface ChangeTopicParams {
  organizationId: string;
  groupId: string;
  topic: string;
}

interface LoadParams {
  organizationId: string;
  groupId: string;
}

interface LoadResult {
  organization: Organization;
  group: Group;
  players: Player[];
}

const loadAsync = actionCreator.async<LoadParams, LoadResult, string>("LOAD");
const load = loadAsync.started;
const loadDone = loadAsync.done;
const loadFailed = loadAsync.failed;
// Real Time Update
const subscribeDone = actionCreator<Function>("SUBSCRIBE_DONE");
const updateGroup = actionCreator<Group>("UPDATE_GROUP");
const updateGroupUsers = actionCreator<GroupUser[]>("UPDATE_GROUP_USERS");
const updateUsers = actionCreator<User[]>("UPDATE_USERS");

export const changeShowOwnTrump = actionCreator<boolean>("CHANGE_SHOW_OWN_TRUMP");
export const changeAntiOpportunism = actionCreator<boolean>("CHANGE_ANTI_OPPORTUNISM");
export const stand = actionCreator<string>("STAND");
export const allowNextStand = actionCreator<{}>("ALLOW_NEXT_STAND");
export const clearCards = actionCreator<{}>("CLEAR_CARDS");
export const clearCardsDone = actionCreator<{}>("CLEAR_CARDS_DONE");
export const dismiss = actionCreator<{}>("DISMISS");

export const settingDialogOpen = actionCreator<{}>("SETTING_DIALOG_OPEN");
export const settingDialogClose = actionCreator<{}>("SETTING_DIALOG_CLOSE");
export const changeTopic = actionCreator<ChangeTopicParams>("CHANGE_TOPIC");

export const join = actionCreator<{}>("JOIN");
export const kick = actionCreator<string>("KICK");
const nop = actionCreator<{}>("NOP");


// reducer
interface State {
  organization: Organization;
  group: Group;
  loading: boolean;
  players: Player[];
  unsubscriber?: Function;
  showOwnTrump: boolean;
  settingDialogOpened: boolean;
  standing: boolean;
}

const initialState = {
  "organization": new Organization("", ""),
  "group": new Group("", "", "", "", false, false),
  "loading": true,
  "players": [],
  "unsubscriber": undefined,
  "showOwnTrump": true,
  "settingDialogOpened": false,
  "standing": false
};

function getBoardState(store: MiddlewareAPI<any>): State {
  return store.getState().boardReducer;
}

export const boardReducer = reducerWithInitialState<State>(initialState)
  .case(load, (state, payload) => ({...state, "loading": true}))
  .case(loadDone, (state, { result }) => ({
    ...state,
    "organization": result.organization,
    "group": result.group,
    "players": result.players,
    "loading": false
  })
  )
  .case(subscribeDone, (state, payload) => ({...state, "unsubscriber": payload}))
  .case(updateGroup, (state, payload) => ({...state, "group": payload}))
  .case(updateGroupUsers, (state, payload) => ({...state, "players": state.players.map(x => {
    const { rightToTalk, ready, trump } = payload.find(gu => gu.userId === x.userId) || x;
    return x.copy({rightToTalk, ready, trump});
  })}))
  .case(updateUsers, (state, payload) => ({...state, "players": state.players.map(x => {
    const { name, iconUrl } = payload.find(u => u.id === x.userId) || {"name": x.userName, "iconUrl": x.iconUrl};
    return x.copy({"userName": name, iconUrl});
  })}))
  .case(changeShowOwnTrump, (state, payload) => ({...state, "showOwnTrump": payload}))
  .case(settingDialogOpen, (state, payload) => ({...state, "settingDialogOpened": true}))
  .case(settingDialogClose, (state, payload) => ({...state, "settingDialogOpened": false}))
  .case(stand, (state, payload) => ({...state, "standing": true}))
  .case(allowNextStand, (state, payload) => ({...state, "standing": false}))
  .build();

// epic
const groupReg = /^\/organization\/(\w+)\/group\/(\w+)$/;
const showBoardEpic: Epic<Action<any>, any>
  = (action$) => locationChangeOf(action$, groupReg)
    .map((action: any) => load({
      "organizationId": action.payload.location.pathname.replace(groupReg, "$1"),
      "groupId": action.payload.location.pathname.replace(groupReg, "$2")
    }));
const loadEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(load)
    .mergeMap(async (action) => {
      const unsubscribePrevious = getBoardState(store).unsubscriber;
      unsubscribePrevious && unsubscribePrevious();

      const fs = getFirestore();
      const { organizationId, groupId } = action.payload;
      try {
        const orgSS = await fs.collection("organizations").doc(organizationId).get();
        const orgSSdata: any = orgSS.data();
        const organization = new Organization(orgSS.id, orgSSdata.name);

        const groupSS = await fs.collection("organizations").doc(organizationId)
          .collection("groups").doc(groupId).get();
        const groupSSdata: any = groupSS.data();
        const { name, topic, allReady, antiOpportunism } = groupSSdata;
        const group = new Group(groupSS.id, organizationId, name, topic, allReady, antiOpportunism);
        const groupUsersSS = await fs.collection("organizations").doc(organizationId)
          .collection("groups").doc(groupId).collection("users").get();
        const groupUsers = groupUsersSS.docs.map(doc => {
          const { rightToTalk, ready, trump } = doc.data();
          return new GroupUser(groupId, doc.id, rightToTalk, ready, trump);
        });

        const groupUserIdHash = groupUsers.reduce((acc, val) => {
          acc[val.userId] = true;
          return acc;
        }, {});
        const usersSS = await fs.collection("users").get();
        const users = usersSS.docs.filter(doc => groupUserIdHash[doc.id]).map(doc => {
          const userData = doc.data();
          return new User(doc.id, userData.name, userData.iconUrl);
        });
        const players = users.map(x => {
          const groupUser = groupUsers.find(gu => gu.userId === x.id);
          if (groupUser) {
            return new Player(x.id, x.name, x.iconUrl, groupUser.rightToTalk, groupUser.ready, groupUser.trump);
          }
          throw new Error(`GroupUser not found: userId=${x.id}`);
        });
        return loadDone({"params": action.payload, "result": {organization, group, players}});
      } catch (e) {
        console.error(e);
        return loadFailed({"params": action.payload, "error": e.message});
      }
    });
const loadFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loadFailed)
    .map((action) => pushError(action.payload.error));

const subscribeEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(loadDone)
    .mergeMap((action) => {

      const fs = getFirestore();
      const { organizationId, groupId } = action.payload.params;
      const unsubscribers: Function[] = [];

      const groupFlow = Observable.create((observer) => {
        const unsubscribeGroup = fs.collection("organizations").doc(organizationId)
          .collection("groups").doc(groupId).onSnapshot((nextGroup) => {
            const data: any = nextGroup.data();
            const group = new Group(nextGroup.id, organizationId, data.name, data.topic, data.allReady, data.antiOpportunism);
            observer.next(updateGroup(group));
          },
          observer.error,
          observer.complete
          );
        unsubscribers.push(unsubscribeGroup);
        return unsubscribeGroup;
      });

      const groupUsersFlow = Observable.create((observer) => {
        const currentUserCount = getBoardState(store).players.length;
        const unsubscribeGroupUsers = fs.collection("organizations").doc(organizationId)
          .collection("groups").doc(groupId).collection("users").onSnapshot((nextGroupUsers) => {
            const groupUsers = nextGroupUsers.docs.map(doc => {
              const { rightToTalk, ready, trump } = doc.data();
              return new GroupUser(groupId, doc.id, rightToTalk, ready, trump);
            });
            groupUsers.length !== currentUserCount && !nextGroupUsers.metadata.fromCache
              ? observer.next(load({organizationId, groupId})) : observer.next(updateGroupUsers(groupUsers));
          },
          observer.error,
          observer.complete
          );
        unsubscribers.push(unsubscribeGroupUsers);
        return unsubscribeGroupUsers;
      });

      const unsubscribeAll = () => {
        unsubscribers.forEach(x => x());
      };
      const subscribeDoneFlow = Observable.of(subscribeDone(unsubscribeAll));

      return groupFlow.merge(groupUsersFlow).merge(subscribeDoneFlow);
    });
const clearCardsEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(clearCards)
    .mergeMap(async (action) => {
      const fs = getFirestore();
      const { "organization": { "id": organizationId }, "group": { "id": groupId } } = getBoardState(store);
      try {
        const groupUsersSS = await fs.collection("organizations").doc(organizationId)
          .collection("groups").doc(groupId).collection("users").get();
        await groupUsersSS.docs
          .reduce((batch, doc) => batch.update(doc.ref, {"rightToTalk": false, "ready": false, "trump": ""}), fs.batch())
          .commit();
        await fs.collection("organizations").doc(organizationId)
          .collection("groups").doc(groupId).update({
            "allReady": false
          });
        return clearCardsDone({});
      } catch (e) {
        console.error(e);
        return pushError(e.message);
      }
    });
const dismissEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(dismiss)
    .mergeMap(async () => {
      try {
        const fs = getFirestore();
        const { "players": players, "organization": { "id": organizationId }, "group": { "id": groupId } } = getBoardState(store);

        const groupUsersRef = fs.collection("organizations").doc(organizationId)
          .collection("groups").doc(groupId).collection("users");
        for (const player of players) {
          await groupUsersRef.doc(player.userId).delete();
        }
        return clearCards({});
      } catch (e) {
        console.error(e);
        return pushError(e.message);
      }
    });
const changeAntiOpportunismEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(changeAntiOpportunism)
    .mergeMap((action) => {
      const fs = getFirestore();
      const { "id": groupId, organizationId } = getBoardState(store).group;
      const groupRef = fs.collection("organizations").doc(organizationId).collection("groups").doc(groupId);
      return groupRef.update({"antiOpportunism": action.payload})
        .then(() => nop({}))
        .catch(e => {
          console.error(e);
          return pushError(e.message);
        });
    });
const changeTopicEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(changeTopic)
    .mergeMap((action) => {
      const fs = getFirestore();
      const { organizationId, groupId, topic } = action.payload;
      return fs.collection("organizations").doc(organizationId).collection("groups").doc(groupId).update({
        topic
      }).then(() => nop({}))
        .catch(e => {
          console.error(e);
          return pushError(e.message);
        });
    });
const standEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(stand)
    .mergeMap((action) => {
      const fs = getFirestore();
      const { "organization": { "id": organizationId }, "group": { "id": groupId } } = getBoardState(store);
      const user = loginUser();
      const userId = user && user.uid || "";

      return fs.collection("organizations").doc(organizationId)
        .collection("groups").doc(groupId).collection("users").doc(userId).update({
          "trump": action.payload,
          "ready": true
        }).then(() => nop({}))
        .catch(e => {
          console.error(e);
          return pushError(e.message);
        });
    });
const avoidRepeatedStandEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(stand)
    .delay(2500)
    .map(() => allowNextStand({}));
const joinEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(join)
    .mergeMap((action) => {
      const fs = getFirestore();
      const { "organization": { "id": organizationId }, "group": { "id": groupId } } = getBoardState(store);
      const user = loginUser();
      const userId = user && user.uid || "";

      return fs.collection("organizations").doc(organizationId)
        .collection("groups").doc(groupId).collection("users").doc(userId).set({
          userId,
          "rightToTalk": false,
          "ready": false,
          "trump": ""
        }).then(() => nop({}))
        .catch(e => {
          console.error(e);
          return pushError(e.message);
        });
    });
const kickEpic: Epic<Action<any>, any>
  = (action$, store) => action$.ofAction(kick)
    .mergeMap((action) => {
      const fs = getFirestore();
      const { "organization": { "id": organizationId }, "group": { "id": groupId } } = getBoardState(store);
      const userId = action.payload;

      return fs.collection("organizations").doc(organizationId)
        .collection("groups").doc(groupId).collection("users").doc(userId).delete()
        .then(() => nop({}))
        .catch(e => {
          console.error(e);
          return pushError(e.message);
        });
    });
const notifyEpic: Epic<any, any>
  = (action$, store) => action$.ofAction(updateGroupUsers)
    .map((action) => {
      const joined = makeUserBoardJoined()(store.getState());
      const { standing, group } = getBoardState(store);
      const userCount = action.payload.length;
      const readyUserCount = action.payload.filter(gu => gu.ready).length;
      if (joined && readyUserCount && !standing) {
        const title = group.topic;
        const n = new Notification(
          title,
          {
            "body": `${readyUserCount}/${userCount} users standing`,
            "icon": "https://raw.githubusercontent.com/wiki/maji-KY/planning-poker-assistance-program/images/planning-poker-assistance-program.jpg",
            "tag": "stand"
          }
        );
        setTimeout(n.close.bind(n), 5000);
      }
    }).ignoreElements();

export const epic = combineEpics(
  showBoardEpic,
  loadEpic,
  loadFailedEpic,
  subscribeEpic,
  clearCardsEpic,
  dismissEpic,
  changeAntiOpportunismEpic,
  changeTopicEpic,
  standEpic,
  avoidRepeatedStandEpic,
  joinEpic,
  kickEpic,
  notifyEpic
);
