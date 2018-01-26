import * as React from "react";

import { configure, addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import deepPurple from "material-ui/colors/deepPurple";
import indigo from "material-ui/colors/indigo";

const theme = createMuiTheme({
  "palette": {
    "primary": indigo,
    "secondary": deepPurple
  }
});

addDecorator(story =>
  <MuiThemeProvider theme={theme}>
    {story()}
  </MuiThemeProvider>
);
addDecorator(withKnobs);

function loadStories() {
  require("../storybook/stories");
}

configure(loadStories, module);
