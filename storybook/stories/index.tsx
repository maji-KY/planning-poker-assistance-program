import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
// import { linkTo } from '@storybook/addon-links';

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import deepPurple from "material-ui/colors/deepPurple";
import indigo from "material-ui/colors/indigo";

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

const theme = createMuiTheme({
  "palette": {
    "primary": indigo,
    "secondary": deepPurple
  },
  "status": {
    "danger": "orange"
  }
});
function PlaybookProvider(props: any) {
  return (
    <MuiThemeProvider theme={theme}>
      {props.children}
    </MuiThemeProvider>
  );
}

storiesOf("OrganizationDetailCntr", module)
  .add("show", () =>

    <PlaybookProvider>
      <OrganizationDetail
        organizations={orgs}
        groups={groups}
        createDialogOpened={false}
        loading={false}
        user={user}
        createDialogOpen={() => {}}
        createDialogClose={() => {}}
        load={() => {}}
        match={{"params": "id1", "isExact": false, "path": "", "url": ""}}
        location={anyObj}
        history={anyObj}
      />
    </PlaybookProvider>

  );

storiesOf("Button", module)
  .add("with text", () => <Button onClick={action("clicked")}>Hello Button</Button>)
  .add("with some emoji", () => <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>);
