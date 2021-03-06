import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "utils/fsa-redux-observable";

import { User as FirebaseUser } from "@firebase/auth-types";
import { getFirestore } from "utils/Firebase";

import User from "models/User";
import { loginDone } from "modules/Auth";
import { pushError } from "modules/MyAppBarMenu";

// action
const actionCreator = actionCreatorFactory("USER");

const initUserAsync = actionCreator.async<FirebaseUser, User, string>("INIT_USER");
export const initUser = initUserAsync.started;
export const initUserDone = initUserAsync.done;
export const initUserFailed = initUserAsync.failed;
export const updateUser = actionCreator<User>("LOGOUT");
const modUserAsync = actionCreator.async<User, User, string>("MOD_USER");
export const modUser = modUserAsync.started;
export const modUserDone = modUserAsync.done;
export const modUserFailed = modUserAsync.failed;

// reducer
interface State {
  loginUser?: User;
  updating: boolean;
}
const initialState = {
  "loginUser": undefined,
  "updating": false
};

export function userReducer(state: State = initialState, action: Action<any>) {
  switch (action.type) {
    case initUserDone.type:
      return Object.assign({}, state, {
        "loginUser": action.payload.result
      });
    case modUser.type:
      return Object.assign({}, state, {
        "updating": true
      });
    case modUserDone.type:
      return Object.assign({}, state, {
        "loginUser": action.payload.result,
        "updating": false
      });
    case modUserFailed.type:
      return Object.assign({}, state, {
        "updating": false
      });
    default:
      return state;
  }
}

// epic
const loginDoneEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(loginDone)
    .mergeMap((action) => {
      const authUser: FirebaseUser = action.payload.result;
      const fs = getFirestore();
      return fs.collection("users").doc(authUser.uid).get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          return initUserDone({"params": authUser, "result": new User(authUser.uid, data && data.name, data && data.iconUrl)});
        }
        return initUser(authUser);

      }).catch((e: any) => {
        return pushError(e.message);
      });
    });

const initUserEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(initUser)
    .mergeMap((action) => {
      const fs = getFirestore();
      const authUser: FirebaseUser = action.payload;
      return fs.collection("users").doc(authUser.uid).set({
        "name": authUser.displayName,
        "iconUrl": authUser.photoURL
      }).then(() => {
        return initUserDone({"params": authUser, "result": new User(authUser.uid, authUser.displayName || "", authUser.photoURL || "")});
      }).catch((e: any) => {
        return pushError(e.message);
      });
    });

const modUserEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(modUser)
    .mergeMap((action) => {
      const fs = getFirestore();
      const modifiedUser: User = action.payload;
      return fs.collection("users").doc(modifiedUser.id).set({
        "name": modifiedUser.name,
        "iconUrl": modifiedUser.iconUrl
      }).then(() => {
        return modUserDone({"params": modifiedUser, "result": modifiedUser});
      }).catch((e: any) => {
        return modUserFailed({"params": action.payload, "error": e.message});
      });
    });

const modUserFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(modUserFailed)
    .map((action) => pushError(action.payload.error));

export const epic = combineEpics(loginDoneEpic, initUserEpic, modUserEpic, modUserFailedEpic);
