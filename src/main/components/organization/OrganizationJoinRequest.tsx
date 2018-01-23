import * as React from "react";

import { RouteComponentProps } from "react-router";

import { withStyles, WithStyles, StyleRulesCallback } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemText } from "material-ui/List";
import Button from "material-ui/Button";
import Tooltip from "material-ui/Tooltip";
import { CircularProgress } from "material-ui/Progress";

import OrganizationModel from "models/Organization";
import User from "models/User";

interface StateProps {
  organizations: OrganizationModel[];
  loading: boolean;
  requestUsers: User[];
}
export interface DispatchProps {
  accept: (User) => void;
  refuse: (User) => void;
}

function OrganizationJoinRequestComponent(props: StateProps & DispatchProps & WithStyles & RouteComponentProps<any>) {
  const { classes } = props;
  const { organizations, loading, requestUsers } = props;
  const { accept, refuse } = props;
  const { "match": { "params": { organizationId } } } = props;
  const currentOrganization = organizations.find(x => x.id === organizationId);
  return (
    <div>
      <Typography type="title" className={classes.title}>Organization: {currentOrganization && currentOrganization.name || ""}</Typography>
      <Paper className={classes.root}>
        <List className={classes.list} subheader={<ListSubheader className={classes.stickey}>Join Request</ListSubheader>}>
          {loading ? <CircularProgress className={classes.loadingCircle} /> : requestUsers
            .map((x: User, i: number) =>
              <ListItem key={i} button>
                <ListItemText primary={x.name} />
              </ListItem>
            )}
        </List>
      </Paper>
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

export const OrganizationJoinRequest = withStyles(styles)(OrganizationJoinRequestComponent);
