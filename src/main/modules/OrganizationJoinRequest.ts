import actionCreatorFactory, { Action } from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import "rxjs/add/operator/merge";
import "utils/fsa-redux-observable";

import { getFirestore } from "utils/Firebase";

import User from "models/User";
import Organization from "models/Organization";
import { pushError } from "modules/MyAppBarMenu";
import { post } from "utils/CloudFunctions";
import { locationChangeOf } from "utils/LocationChanges";


// action
const actionCreator = actionCreatorFactory("ORGANIZATION_JOIN_REQUEST");

export interface JoinRequest {
  target: Organization;
  user: User;
}

interface LoadResult {
  target: Organization;
  requestUsers: User[];
}

const loadAsync = actionCreator.async<string, LoadResult, string>("LOAD");
export const load = loadAsync.started;
export const loadDone = loadAsync.done;
export const loadFailed = loadAsync.failed;

export const requestJoin = actionCreator<JoinRequest>("REQUEST_JOIN");
export const cancelJoin = actionCreator<JoinRequest>("CANCEL_JOIN");

const acceptAsync = actionCreator.async<JoinRequest, string, string>("ACCEPT");
export const accept = acceptAsync.started;
export const acceptDone = acceptAsync.done;
export const acceptFailed = acceptAsync.failed;

const nop = actionCreator<{}>("NOP");


// reducer
interface State {
  target: Organization;
  requestUsers: User[];
  loading: boolean;
}
const initialState = {
  "target": new Organization("", ""),
  "requestUsers": [],
  "loading": true
};

export const organizationJoinRequestReducer = reducerWithInitialState<State>(initialState)
  .cases([load, accept], (state, payload) => ({...state, "loading": true}))
  .case(loadDone, (state, { result }) => ({
    ...state,
    "target": result.target,
    "requestUsers": result.requestUsers,
    "loading": false
  })
  )
  .build();

// epic
const showReg = /^\/organization\/(\w+)\/joinRequests/;
const showOrganizationJoinRequestEpic: Epic<Action<any>, any>
  = (action$) => locationChangeOf(action$, showReg)
    .map((action: any) => load(action.payload.location.pathname.replace(showReg, "$1")));
const loadEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(load)
    .mergeMap(async (action) => {
      const fs = getFirestore();
      try {
        const targetOrganizationId = action.payload;
        const orgSS = await fs.collection("organizations").doc(targetOrganizationId).get();
        const orgSSdata: any = orgSS.data();
        const target = new Organization(orgSS.id, orgSSdata.name);
        const requestSS = await fs.collection("organizations").doc(targetOrganizationId).collection("joinRequests").get();
        const requestUserIds = requestSS.docs.map(doc => doc.id);
        const groupUserIdHash = requestUserIds.reduce((acc, val) => {
          acc[val] = true;
          return acc;
        }, {});
        const usersSS = await fs.collection("users").get();
        const requestUsers = usersSS.docs.filter(doc => groupUserIdHash[doc.id]).map(doc => {
          const userData = doc.data();
          return new User(doc.id, userData.name, userData.iconUrl);
        });
        return loadDone({"params": action.payload, "result": {target, requestUsers}});
      } catch (e) {
        console.error(e);
        return loadFailed({"params": action.payload, "error": e.message});
      }
    });
const loadFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loadFailed)
    .map((action) => pushError(action.payload.error));
const requestJoinEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(requestJoin)
    .mergeMap((action) => {
      const fs = getFirestore();
      const { target, user } = action.payload;
      return fs.collection("organizations").doc(target.id).collection("joinRequests").doc(user.id).set({})
        .then(() => nop({}))
        .catch(e => {
          console.error(e);
          return pushError(e.message);
        });
    });
const cancelJoinEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(cancelJoin)
    .mergeMap((action) => {
      const fs = getFirestore();
      const { target, user } = action.payload;
      return fs.collection("organizations").doc(target.id).collection("joinRequests").doc(user.id).delete()
        .then(() => load(target.id))
        .catch(e => {
          console.error(e);
          return pushError(e.message);
        });
    });
const acceptEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(accept)
    .mergeMap((action) => {
      const { target } = action.payload;
      return post("acceptJoinRequest", action.payload)
        .then(() => acceptDone({"params": action.payload, "result": target.id}))
        .catch(e => {
          console.error(e);
          return acceptFailed({"params": action.payload, "error": e.message});
        });
    });
const acceptDoneEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(acceptDone)
    .map((action) => load(action.payload.result));
const acceptFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(acceptFailed)
    .map((action) => pushError(action.payload.error));

export const epic = combineEpics(
  showOrganizationJoinRequestEpic,
  loadEpic,
  loadFailedEpic,
  requestJoinEpic,
  cancelJoinEpic,
  acceptEpic,
  acceptDoneEpic,
  acceptFailedEpic
);
