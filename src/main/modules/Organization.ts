import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "utils/fsa-redux-observable";

import * as firebase from "firebase";
import "firebase/firestore";

import User from "models/User";
import Organization from "models/Organization";
import { pushError } from "modules/MyAppBarMenu";

// action
const actionCreator = actionCreatorFactory("ORGANIZATION");

const loadAsync = actionCreator.async<{}, Organization[], string>("LOAD");
export const load = loadAsync.started;
export const loadDone = loadAsync.done;
export const loadFailed = loadAsync.failed;
const loadJoinedAsync = actionCreator.async<User, string[], string>("LOAD_JOINED");
export const loadJoined = loadJoinedAsync.started;
export const loadJoinedDone = loadJoinedAsync.done;
export const loadJoinedFailed = loadJoinedAsync.failed;

// reducer
interface State {
  organizations: Organization[];
  joinedOrganizationsIds: string[];
  loading: boolean;
  loadingJoined: boolean;
}
const initialState = {
  "organizations": [],
  "joinedOrganizationsIds": [],
  "loading": false,
  "loadingJoined": false
};

export function organizationReducer(state: State = initialState, action: Action<any>) {
  switch (action.type) {
    case load.type:
      return Object.assign({}, state, {
        "updating": true
      });
    case loadDone.type:
      return Object.assign({}, state, {
        "organizations": action.payload.result,
        "updating": false
      });
    case loadJoined.type:
      return Object.assign({}, state, {
        "loadingJoined": true
      });
    case loadJoinedDone.type:
      return Object.assign({}, state, {
        "joinedOrganizationsIds": action.payload.result,
        "loadingJoined": false
      });
    default:
      return state;
  }
}

// epic
const loadEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(load)
    .mergeMap(() => {
      const fs = firebase.firestore();
      return fs.collection("organizations").get()
        .then((collection) => {
          return loadDone({"params": {}, "result": collection.docs.map(doc => new Organization(doc.id, doc.data().name))});
        })
        .catch((e: any) => loadFailed(e.message));
    });
const loadFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loadFailed)
    .map((action) => pushError(action.payload.error));
const loadJoinedEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(loadJoined)
    .mergeMap((action) => {
      const uid = action.payload.id;
      const fs = firebase.firestore();
      return fs.collection("UserOrganizations").doc(uid).get()
        .then((doc) => {
          const result: string[] = doc.exists ? doc.data().organizationIds : [];
          return loadJoinedDone({"params": action.payload, result});
        })
        .catch((e: any) => loadJoinedFailed(e.message));
    });
const loadJoinedFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loadJoinedFailed)
    .map((action) => pushError(action.payload.error));

export const epic = combineEpics(loadEpic, loadFailedEpic, loadJoinedEpic, loadJoinedFailedEpic);
