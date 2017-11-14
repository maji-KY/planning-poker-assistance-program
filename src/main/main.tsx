import axios from "axios";
import * as firebase from "firebase";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import { reducer as formReducer } from "redux-form";
import { routerMiddleware, ConnectedRouter } from "react-router-redux";
import { Route, Switch } from "react-router-dom";
import createHashHistory from "history/createHashHistory";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const history = createHashHistory();
const epicMiddleware = createEpicMiddleware(
  combineEpics()
);

const reducer = combineReducers({
  "form": formReducer
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

const theme = createMuiTheme();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" component={Test} />
        </Switch>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  containerElement
);

import Button from 'material-ui/Button';
function Test() {
  return <div>aaaaa<Button raised color="primary">Button</Button></div>;
}

axios.get("/__/firebase/init.json")
  .then(function (response) {
    firebase.initializeApp(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
