import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/map";
import "utils/fsa-redux-observable";

import * as firebase from "firebase";
import "firebase/firestore";

import User from "models/User";
import { loginDone } from "modules/Auth";
import { pushError } from "modules/MyAppBarMenu";

// action
const actionCreator = actionCreatorFactory();

const initUserAsync = actionCreator.async<firebase.User, User, string>("INIT_USER");
export const initUser = initUserAsync.started;
export const initUserDone = initUserAsync.done;
export const initUserFailed = initUserAsync.failed;
export const updateUser = actionCreator<User>("LOGOUT");

// reducer
interface State {
  loginUser?: User;
}
const initialState = {
  "loginUser": undefined
};

export function userReducer(state: State = initialState, action: Action<any>) {
  switch (action.type) {
    case initUserDone.type:
      return Object.assign({}, state, {
        "loginUser": action.payload.result
      });
    default:
      return state;
  }
}

// epic
const loginDoneEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(loginDone)
    .mergeMap((action) => {
      const authUser: firebase.User = action.payload.result;
      console.log(firebase);
      const fs = firebase.firestore();
      return fs.collection("users").doc(authUser.uid).get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          return initUserDone({"params": authUser, "result": new User(authUser.uid, data.name, data.iconUrl)});
        } else {
          return initUser(authUser);
        }
      }).catch((e: any) => {
        return pushError(e.message);
      });
    });

const initUserEpic: Epic<Action<any>, any>
  = (action$) => action$.ofAction(initUser)
    .mergeMap((action) => {
      const fs = firebase.firestore();
      const authUser: firebase.User = action.payload;
      return fs.collection("users").doc(authUser.uid).set({
        "name": authUser.displayName,
        "iconUrl": authUser.photoURL,
      }).then(() => {
        return initUserDone({"params": authUser, "result": new User(authUser.uid, authUser.displayName || "", authUser.photoURL || "")});
      }).catch((e: any) => {
        return pushError(e.message);
      });
    });

export const epic = combineEpics(loginDoneEpic, initUserEpic);
