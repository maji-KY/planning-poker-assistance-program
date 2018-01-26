import * as React from "react";
import { withStyles, StyleRulesCallback } from "material-ui/styles";
import { CircularProgress } from "material-ui/Progress";

const styles: StyleRulesCallback<string> = theme => ({
  "progress": {
    "margin": `0 ${theme.spacing.unit * 2}px`
  }
});

function CircularIndeterminate(props: any) {
  const { classes } = props;
  return <CircularProgress className={classes.progress} size={50} color="accent" thickness={7} />;
}

export default withStyles(styles)(CircularIndeterminate);
