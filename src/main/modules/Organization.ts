import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import "rxjs/add/operator/merge";
import "utils/fsa-redux-observable";

import * as firebase from "firebase";
import "firebase/firestore";

import User from "models/User";
import Organization from "models/Organization";
import { initUserDone } from "modules/User";
import { pushError } from "modules/MyAppBarMenu";
import { post } from "utils/CloudFunctions";
import { reset } from "redux-form";

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
export const refresh = actionCreator<User>("REFRESH");

export const createDialogOpen = actionCreator<{}>("CREATE_DIALOG_OPEN");
export const createDialogClose = actionCreator<{}>("CREATE_DIALOG_CLOSE");

export interface CreateOrganizationParam {
  user: User;
  name: string;
}
const createAsync = actionCreator.async<CreateOrganizationParam, User, string>("CREATE");
export const create = createAsync.started;
export const createDone = createAsync.done;
export const createFailed = createAsync.failed;

// reducer
interface State {
  organizations: Organization[];
  joinedOrganizationIds: string[];
  loading: boolean;
  loadingJoined: boolean;
  createDialogOpened: boolean;
  creating: boolean;
}
const initialState = {
  "organizations": [],
  "joinedOrganizationIds": [],
  "loading": true,
  "loadingJoined": true,
  "createDialogOpened": false,
  "creating": false
};

export function organizationReducer(state: State = initialState, action: Action<any>) {
  switch (action.type) {
    case load.type:
      return Object.assign({}, state, {
        "loading": true
      });
    case loadDone.type:
      return Object.assign({}, state, {
        "organizations": action.payload.result,
        "loading": false
      });
    case loadJoined.type:
      return Object.assign({}, state, {
        "loadingJoined": true
      });
    case loadJoinedDone.type:
      return Object.assign({}, state, {
        "joinedOrganizationIds": action.payload.result,
        "loadingJoined": false
      });
    case createDialogOpen.type:
      return Object.assign({}, state, {
        "createDialogOpened": true
      });
    case createDialogClose.type:
      return Object.assign({}, state, {
        "createDialogOpened": false
      });
    case create.type:
      return Object.assign({}, state, {
        "creating": true
      });
    case createDone.type:
      return Object.assign({}, state, {
        "creating": false
      });
    case createFailed.type:
      return Object.assign({}, state, {
        "creating": false
      });
    default:
      return state;
  }
}

// epic
const showOrganizationEpic: Epic<Action<any>, any>
  = (action$) => {
    const loginDone = action$.ofAction(initUserDone);
    return loginDone.map(() => load({}))
      .merge(loginDone.map((action) => loadJoined(action.payload.result)));
  };
const refreshEpic: Epic<Action<any>, any>
  = (action$) => {
    const refreshFlow = action$.ofAction(refresh);
    return refreshFlow.map(() => load({}))
      .merge(refreshFlow.map((action) => loadJoined(action.payload)));
  };
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
const createEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(create)
    .mergeMap((action) => {
      const { user, name } = action.payload;
      return post("createOrganization", {
        "organizationName": name
      }).then(() => createDone({"params": action.payload, "result": user}))
        .catch((e: any) => createFailed(e.message));
    });
const createDoneEpic: Epic<any, any>
  = (action$) => {
    const createDoneFlow = action$.ofAction(createDone);
    return createDoneFlow.map(() => load({}))
      .merge(createDoneFlow.map((action) => loadJoined(action.payload.result)))
      .merge(createDoneFlow.map(() => createDialogClose({})))
      .merge(createDoneFlow.map(() => reset("CreateOrganizationForm")));
  };
const createFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(createFailed)
    .map((action) => pushError(action.payload.error));

export const epic = combineEpics(
  showOrganizationEpic,
  refreshEpic,
  loadEpic,
  loadFailedEpic,
  loadJoinedEpic,
  loadJoinedFailedEpic,
  createEpic,
  createDoneEpic,
  createFailedEpic
);
