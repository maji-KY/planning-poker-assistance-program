import actionCreatorFactory, { Action } from "typescript-fsa";
import { Epic, combineEpics } from "redux-observable";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/ignoreElements";
import "utils/fsa-redux-observable";

import { Error } from "components/MyAppBarMenu";

// action
const actionCreator = actionCreatorFactory("APP_BAR");

export const userMenuOpen = actionCreator<HTMLElement>("USER_MENU_OPEN");
export const userMenuClose = actionCreator<string>("USER_MENU_CLOSE");
export const drawerOpen = actionCreator<HTMLElement>("DRAWER_OPEN");
export const drawerClose = actionCreator<string>("DRAWER_CLOSE");
export const pushError = actionCreator<string>("PUSH_ERROR");
export const openError = actionCreator<Error>("OPEN_ERROR");
export const closeError = actionCreator<number>("CLOSE_ERROR");
export const disposeError = actionCreator<number>("DISPOSE_ERROR");

// reducer
const initialState = {
  "userMenuOpened": false,
  "userMenuAnchor": null,
  "title": "PPAP(Planning-Poker-Assistance-Program)",
  "drawerOpened": false,
  "errors": new Array<Error>()
};

export function myAppBarMenuReducer(state = initialState, action: Action<any>) {
  switch (action.type) {
    case userMenuOpen.type:
      return Object.assign({}, state, {
        "userMenuOpened": true,
        "userMenuAnchor": action.payload
      });
    case userMenuClose.type:
      return Object.assign({}, state, {
        "userMenuOpened": false
      });
    case drawerOpen.type:
      return Object.assign({}, state, {
        "drawerOpened": true
      });
    case drawerClose.type:
      return Object.assign({}, state, {
        "drawerOpened": false
      });
    case openError.type:
      return Object.assign({}, state, {
        "errors": state.errors.concat(action.payload)
      });
    case closeError.type:
      return Object.assign({}, state, {
        "errors": state.errors.map((e, i) => e.time === action.payload ? e.copy({"opened": false}) : e)
      });
    case disposeError.type:
      return Object.assign({}, state, {
        "errors": state.errors.filter((e) => e.time !== action.payload)
      });
    default:
      return state;
  }
}

// epic
const pushErrorEpic: Epic<Action<Error>, any>
  = (action$) => action$.ofAction(pushError)
    .map((action) => openError(new Error((new Date).getTime(), action.payload)));

const closeErrorEpic: Epic<any, any>
  = (action$) => action$.ofAction(closeError)
    .delay(1000)
    .map((action) => disposeError(action.payload));

export const epic = combineEpics(pushErrorEpic, closeErrorEpic);
