import * as React from "react";

import { StyleRulesCallback, WithStyles, withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";

export function AccountComponent(props: WithStyles) {
  const { classes } = props;
  return (
    <div>
      <Typography type="title" className={classes.title}>Account</Typography>
      Under construction
    </div>
  );
}

const styles: StyleRulesCallback<string> = theme => ({
  "root": {
    "width": "100%",
    "background": theme.palette.background.paper
  },
  "list": {
    "background": theme.palette.background.paper
  },
  "stickey": {
    "top": -25
  },
  "title": {
    "margin": 10
  },
  "loadingCircle": {
    "margin": theme.spacing.unit * 2
  }
});

export const Account = withStyles(styles)(AccountComponent);
