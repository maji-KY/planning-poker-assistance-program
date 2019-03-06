import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "utils/fsa-redux-observable";

import { push } from "connected-react-router";

import * as firebase from "firebase/app";
import "firebase/auth";
import { User as FirebaseUser } from "@firebase/auth-types";
import { pushError } from "modules/MyAppBarMenu";

// action
const actionCreator = actionCreatorFactory("AUTH");

const loginAsync = actionCreator.async<{}, FirebaseUser, string>("LOGIN");
export const login = loginAsync.started;
export const loginDone = loginAsync.done;
export const loginFailed = loginAsync.failed;
export const logout = actionCreator<string>("LOGOUT");

// reducer
interface State {
  auth: boolean;
  user?: FirebaseUser;
}
const initialState = {
  "auth": false
};

export function authReducer(state: State = initialState, action: Action<any>) {
  switch (action.type) {
    case loginDone.type:
      return Object.assign({}, state, {
        "auth": true,
        "user": action.payload.result
      });
    case logout.type:
      return Object.assign({}, state, {
        "auth": false
      });
    default:
      return state;
  }
}

// epic
const loginEpic: Epic<Action<{}>, any>
  = (action$) => action$.ofAction(login)
    .mergeMap(() => {
      if (!firebase.auth) return Promise.reject("firebase.auth not found");
      const authInstance = firebase.auth();
      const provider = new firebase.auth.GoogleAuthProvider();
      authInstance.useDeviceLanguage();
      return authInstance.signInWithPopup(provider)
        .then((result: any) => loginDone({"params": {}, "result": result.user}))
        .catch((e: any) => {
          console.error(e);
          return loginFailed({"params": {}, "error": e.message});
        });
    });
const loginFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loginFailed)
    .map((action) => pushError(action.payload.error));
const logoutEpic: Epic<Action<{}>, any>
  = (action$) => action$.ofAction(logout)
    .mergeMap(() => {
      if (firebase.auth) {
        return firebase.auth().signOut();
      }
      return Promise.reject("firebase.auth not found");

    })
    .map(() => push("/"));

export const epic = combineEpics(loginEpic, loginFailedEpic, logoutEpic);
