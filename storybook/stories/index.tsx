import * as React from "react";
import { combineReducers, createStore } from "redux";
import { Provider } from "react-redux";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { boolean, object } from "@storybook/addon-knobs";

import Button from "material-ui/Button";
import { OrganizationDetail } from "components/organization/OrganizationDetail";
import Organization from "models/Organization";
import Group from "models/Group";
import User from "models/User";

const orgs = [new Organization("id1", "name1")];
const groups = [
  new Group("id1", "id1", "group1", "", false),
  new Group("id2", "id1", "group2", "", false),
  new Group("id2", "id1", "group3", "", false)
];
const user = new User("userId", "user1", "");
const anyObj: any = {};

const reducer = combineReducers(
  {
    "groupReducer": () => ({
      "groups": [],
      "createDialogOpened": false,
      "creating": false
    }),
    "userReducer": () => ({
      "loginUser": user
    })
  });
const store = createStore(reducer);

storiesOf("OrganizationDetailCntr", module)
  .addDecorator((story: any) => <Provider store={store}>{story()}</Provider>)
  .add("show", () => {
    return (
      <OrganizationDetail
        organizations={object("orgs", orgs)}
        groups={object("groups", groups)}
        loading={boolean("loading", false)}
        user={object("user", user)}
        createDialogOpen={action("createDialogOpen")}
        createDialogClose={action("createDialogClose")}
        load={action("load")}
        match={object("match", {"params": {"organizationId": "id1"}, "isExact": false, "path": "", "url": ""})}
        location={anyObj}
        history={anyObj}
      />
    );
  }
  );

storiesOf("Button", module)
  .add("with text", () => <Button onClick={action("clicked")}>Hello Button</Button>)
  .add("with some emoji", () => <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>);
