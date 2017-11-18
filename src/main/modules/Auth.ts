import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "utils/fsa-redux-observable";

import { push } from "react-router-redux";

import * as firebase from "firebase";
import { pushError } from "modules/MyAppBarMenu";

// action
const actionCreator = actionCreatorFactory();

const loginAsync = actionCreator.async<{}, {}, string>("LOGIN");
export const login = loginAsync.started;
export const loginDone = loginAsync.done;
export const loginFailed = loginAsync.failed;
export const logout = actionCreator<string>("LOGOUT");

// reducer
interface State {
  auth: boolean;
  user?: firebase.User;
}
const initialState = {
  "auth": false
};

export function authReducer(state: State = initialState, action: Action<any>) {
  switch (action.type) {
    case loginDone.type:
      return Object.assign({}, state, {
        "auth": true,
        "user": action.payload.result.user
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
export const loginEpic: Epic<Action<{}>, any>
  = (action$) => action$.ofAction(login)
    .mergeMap((action) => {
      const authInstance = firebase.auth();
      const provider = new firebase.auth.GoogleAuthProvider();
      authInstance.useDeviceLanguage();
      return authInstance.signInWithPopup(provider)
        .then((result: any) => loginDone({"params": {}, "result": result}))
        .catch((e: any) => {
          console.log(e);
          return loginFailed({"params": {}, "error": e.message})
        })
    });
export const loginFailedEpic: Epic<Action<string>, any>
  = (action$) => action$.ofAction(loginFailed)
    .map((action) => pushError(action.payload.error));
export const logoutEpic: Epic<Action<{}>, any>
  = (action$) => action$.ofAction(logout)
    .map((action) => push("/"));
