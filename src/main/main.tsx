import "assets/images/favicon.ico";

import axios from "axios";
import * as firebase from "firebase/app";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import { reducer as formReducer } from "redux-form";
import { routerMiddleware, ConnectedRouter, push } from "react-router-redux";
import { Route, Switch } from "react-router-dom";
import createHashHistory from "history/createHashHistory";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import deepPurple from "material-ui/colors/deepPurple";
import indigo from "material-ui/colors/indigo";

import MyAppBarMenu from "containers/MyAppBarMenuCntr";
import Top from "containers/TopCntr";
import Organization from "containers/organization/OrganizationCntr";
import OrganizationDetail from "containers/organization/OrganizationDetailCntr";
import Group from "containers/group/GroupCntr";
import Account from "containers/AccountCntr";
import Settings from "containers/SettingsCntr";

import * as AuthModule from "modules/Auth";
import * as MyAppBarMenuModule from "modules/MyAppBarMenu";
import * as UserModule from "modules/User";
import * as OrganizationModule from "modules/Organization";
import * as GroupModule from "modules/Group";

const history = createHashHistory();
const epicMiddleware = createEpicMiddleware(
  combineEpics(
    AuthModule.epic,
    MyAppBarMenuModule.epic,
    UserModule.epic,
    OrganizationModule.epic,
    GroupModule.epic,
  )
);

const reducer = combineReducers({
  "form": formReducer,
  "authReducer": AuthModule.authReducer,
  "myAppBarMenuReducer": MyAppBarMenuModule.myAppBarMenuReducer,
  "userReducer": UserModule.userReducer,
  "organizationReducer": OrganizationModule.organizationReducer,
  "groupReducer": GroupModule.groupReducer
});

const middleware = [routerMiddleware(history), epicMiddleware];

const isDev = process.env.NODE_ENV !== "production";

const anyWindow: any = window;

const store = createStore(reducer, undefined, compose(
  applyMiddleware(
    ...isDev ? [...middleware, createLogger()] : middleware
  ),
  anyWindow.devToolsExtension ? anyWindow.devToolsExtension() : (f: any) => f,
));

const containerElement = document.getElementById("main");

const theme = createMuiTheme({
  "palette": {
    "primary": indigo,
    "secondary": deepPurple
  },
  "status": {
    "danger": "orange"
  }
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <MyAppBarMenu>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" component={Top} />
            <Route exact path="/organization" component={Organization} />
            <Route exact path="/organization/:organizationId" component={OrganizationDetail} />
            <Route exact path="/group" component={Group} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/settings" component={Settings} />
          </Switch>
        </ConnectedRouter>
      </MyAppBarMenu>
    </MuiThemeProvider>
  </Provider>,
  containerElement
);

if (window.location.hash !== "#/") {
  store.dispatch(push("/"));
}

axios.get("/__/firebase/init.json")
  .then(function (response) {
    firebase.initializeApp(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
