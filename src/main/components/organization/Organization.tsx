import * as React from "react";

import { withStyles, WithStyles, StyleRulesCallback } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import Button from "material-ui/Button";
import Tooltip from "material-ui/Tooltip";
import { CircularProgress } from 'material-ui/Progress';
import AddIcon from "material-ui-icons/Add";
import RefreshIcon from "material-ui-icons/Refresh";

import CreateOrganizationForm from "containers/organization/CreateOrganizationFormCntr";
import OrganizationModel from "models/Organization";
import User from "models/User";

interface StateProps {
  organizations: OrganizationModel[];
  joinedOrganizationIds: string[];
  createDialogOpened: boolean;
  loading: boolean;
  loadingJoined: boolean;
  user: User;
}
export interface DispatchProps {
  createDialogOpen: Function;
  createDialogClose: Function;
  refresh: Function;
  transition: Function;
}

function OrganizationComponent(props: StateProps & DispatchProps & WithStyles) {
  const { classes } = props;
  const { organizations, joinedOrganizationIds, loading, loadingJoined, user } = props;
  const { createDialogOpen, transition, refresh } = props;
  return (
    <div>
      <Typography type="title" className={classes.title}>Organization</Typography>
      <Paper className={classes.root}>
        <List className={classes.list} subheader={<ListSubheader className={classes.stickey}>Joined Organizations</ListSubheader>}>
          {loading || loadingJoined ? <CircularProgress className={classes.loadingCircle} /> : organizations
            .filter((x: OrganizationModel) => joinedOrganizationIds.find((id: string) => id === x.id))
            .map((x: OrganizationModel, i: number) =>
              <ListItem key={i} button onClick={() => transition(`/organization/${x.id}`)}>
                <ListItemText primary={x.name} />
              </ListItem>
            )}
        </List>
        <Divider />
        <List className={classes.list} subheader={<ListSubheader className={classes.stickey}>All Organizations</ListSubheader>}>
          {loading ? <CircularProgress className={classes.loadingCircle} /> : organizations.map((x: OrganizationModel, i: number) =>
            <ListItem key={i} button onClick={() => transition(`/organization/${x.id}`)}>
              <ListItemText primary={x.name} />
            </ListItem>
          )}
        </List>
      </Paper>
      <div className={classes.bottomButtons}>
        <Tooltip title="Create New Organization" placement="bottom">
          <span>
            <Button className={classes.bottomButton} onClick={() => createDialogOpen()} fab color="primary" aria-label="Create New Organization" disabled={loading || loadingJoined}>
              <AddIcon />
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Refresh" placement="bottom">
          <span>
            <Button className={classes.bottomButton} onClick={() => refresh(user)} fab color="default" aria-label="Refresh" disabled={loading || loadingJoined}>
              <RefreshIcon />
            </Button>
          </span>
        </Tooltip>
      </div>
      <CreateOrganizationForm />
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
  "bottomButtons": {
    "position": "fixed",
    "bottom": 0,
    "z-index": 999,
  },
  "bottomButton": {
    "margin": theme.spacing.unit * 3
  },
  "loadingCircle": {
    "margin": theme.spacing.unit * 2
  }
});

export const Organization = withStyles(styles)(OrganizationComponent);
