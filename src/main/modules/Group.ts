import { LocationChangeAction } from "react-router-redux";
import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import "rxjs/add/operator/merge";
import "utils/fsa-redux-observable";

import { getFirestore } from "utils/Firebase";

import User from "models/User";
import Organization from "models/Organization";
import Group from "models/Group";
import { pushError } from "modules/MyAppBarMenu";
import { post } from "utils/CloudFunctions";
import { locationChangeOf } from "utils/LocationChanges";
import { reset } from "redux-form";

// action
const actionCreator = actionCreatorFactory("GROUP");

const loadAsync = actionCreator.async<string, Group[], string>("LOAD");
export const load = loadAsync.started;
export const loadDone = loadAsync.done;
export const loadFailed = loadAsync.failed;

export const createDialogOpen = actionCreator<{}>("CREATE_DIALOG_OPEN");
export const createDialogClose = actionCreator<{}>("CREATE_DIALOG_CLOSE");

export interface CreateGroupParam {
  user: User;
  organization: Organization;
  name: string;
}
const createAsync = actionCreator.async<CreateGroupParam, User, string>("CREATE");
export const create = createAsync.started;
export const createDone = createAsync.done;
export const createFailed = createAsync.failed;

// reducer
interface State {
  groups: Group[];
  loading: boolean;
  createDialogOpened: boolean;
  creating: boolean;
}
const initialState = {
  "groups": [],
  "loading": true,
  "createDialogOpened": false,
  "creating": false
};

export function groupReducer(state: State = initialState, action: Action<any>) {
  switch (action.type) {
    case load.type:
      return {...state, ...{
        "loading": true,
        "groups": []
      }};
    case loadDone.type:
      return {...state, ...{
        "groups": action.payload.result,
        "loading": false
      }};
    case createDialogOpen.type:
      return {...state, ...{
        "createDialogOpened": true
      }};
    case createDialogClose.type:
      return {...state, ...{
        "createDialogOpened": false
      }};
    case create.type:
      return {...state, ...{
        "creating": true
      }};
    case createDone.type:
      return {...state, ...{
        "creating": false
      }};
    case createFailed.type:
      return {...state, ...{
        "creating": false
      }};
    default:
      return state;
  }
}

// epic
const organizationReg = /^\/organization\/(\w+)$/;
const showGroupEpic: Epic<Action<any>, any>
  = (action$) => locationChangeOf(action$, organizationReg)
    .map((action: LocationChangeAction) => load(action.payload.pathname.replace(organizationReg, "$1")));
const loadEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(load)
    .mergeMap((action) => {
      const fs = getFirestore();
      return fs.collection("organizations").doc(action.payload).collection("groups").get()
        .then((collection) => {
          const result = collection.docs.map(doc => {
            const data = doc.data();
            return new Group(doc.id, action.payload, data.name, data.topic, data.allReady, data.antiOpportunism);
          });
          return loadDone({"params": action.payload, result});
        })
        .catch((e: any) => loadFailed(e.message));
    });
const loadFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loadFailed)
    .map((action) => pushError(action.payload.error));
const createEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(create)
    .mergeMap((action) => {
      const { user, organization, name } = action.payload;
      return post("createGroup", {
        "organizationId": organization.id,
        "groupName": name
      }).then(() => createDone({"params": action.payload, "result": user}))
        .catch((e: any) => createFailed(e.message));
    });
const createDoneEpic: Epic<any, any>
  = (action$) => {
    const createDoneFlow = action$.ofAction(createDone);
    return createDoneFlow.map(action => load(action.payload.params.organization.id))
      .merge(createDoneFlow.map(() => createDialogClose({})))
      .merge(createDoneFlow.map(() => reset("CreateOrganizationForm")));
  };
const createFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(createFailed)
    .map((action) => pushError(action.payload.error));

export const epic = combineEpics(
  showGroupEpic,
  loadEpic,
  loadFailedEpic,
  createEpic,
  createDoneEpic,
  createFailedEpic
);
