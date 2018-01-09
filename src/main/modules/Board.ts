import { LocationChangeAction } from "react-router-redux";
import actionCreatorFactory, { Action } from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/merge";
import "utils/fsa-redux-observable";

import { getFirestore } from "utils/Firebase";

import User from "models/User";
import Group from "models/Group";
import GroupUser from "models/GroupUser";
import Player from "models/Player";
import { pushError } from "modules/MyAppBarMenu";
// import { post } from "utils/CloudFunctions";
import { locationChangeOf } from "utils/LocationChanges";

// action
const actionCreator = actionCreatorFactory("BOARD");

interface LoadParams {
  organizationId: string;
  groupId: string;
}

interface LoadResult {
  group: Group;
  players: Player[];
}

const loadAsync = actionCreator.async<LoadParams, LoadResult, string>("LOAD");
export const load = loadAsync.started;
export const loadDone = loadAsync.done;
export const loadFailed = loadAsync.failed;

export const createDialogOpen = actionCreator<{}>("CREATE_DIALOG_OPEN");
export const createDialogClose = actionCreator<{}>("CREATE_DIALOG_CLOSE");



// reducer
interface State {
  group?: Group;
  loading: boolean;
  players: Player[];
}

const initialState = {
  "group": undefined,
  "loading": true,
  "players": []
};

export const boardReducer = reducerWithInitialState<State>(initialState)
  .case(load, (state, payload) => ({...state, "loading": true}))
  .case(loadDone, (state, payload) => ({
      ...state,
      "group": payload.result.group,
      "players": payload.result.players,
      "loading": false
    })
  )
  .build();

// epic
const groupReg = /^\/organization\/(\w+)\/group\/(\w+)$/;
const showBoardEpic: Epic<Action<any>, any>
  = (action$) => locationChangeOf(action$, groupReg)
    .map((action: LocationChangeAction) => load({
      "organizationId": action.payload.pathname.replace(groupReg, "$1"),
      "groupId": action.payload.pathname.replace(groupReg, "$2")
    }));
const loadEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(load)
    .mergeMap(async (action) => {
      const fs = getFirestore();
      const { organizationId, groupId } = action.payload;
      try {
        const groupSS = await fs.collection("organizations").doc(organizationId).collection("groups").doc(groupId).get();
        const { name, topic, allReady, antiOpportunism } = groupSS.data();
        const group = new Group(groupSS.id, organizationId, name, topic, allReady, antiOpportunism);
        const groupUsersSS = await fs.collection("groups").doc(groupId).collection("users").get();
        const groupUsers = groupUsersSS.docs.map(doc => {
          const { rightToTalk, ready, trump } = doc.data();
          return new GroupUser(groupId, doc.id, rightToTalk, ready, trump);
        });
        const usersSS = await groupUsers.reduce((acc, val) => acc.where("userId", "==", val.userId), fs.collection("users")).get();
        const users = usersSS.docs.map(doc => {
          const { name, iconUrl } = doc.data();
          return new User(doc.id, name, iconUrl);
        });
        const players = users.map(x => {
          const groupUser = groupUsers.find(gu => gu.userId === x.id);
          if (groupUser) {
            return new Player(x.id, x.name, x.iconUrl, groupUser.rightToTalk, groupUser.ready, groupUser.trump);
          } else {
            throw `GroupUser not found: userId=${x.id}`;
          }
        });
        return loadDone({"params": action.payload, "result": {group, players}});
      } catch (e) {
        console.error(e);
        return loadFailed(e.message);
      }
    });
const loadFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loadFailed)
    .map((action) => pushError(action.payload.error));

export const epic = combineEpics(
  showBoardEpic,
  loadEpic,
  loadFailedEpic,
);
