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
import AddIcon from "material-ui-icons/Add";
import RefreshIcon from "material-ui-icons/Refresh";

import CreateGroupForm from "containers/group/CreateGroupFormCntr";
import OrganizationModel from "models/Organization";
import GroupModel from "models/Group";
import User from "models/User";

interface StateProps {
  organizations: OrganizationModel[];
  groups: GroupModel[];
  createDialogOpened: boolean;
  loading: boolean;
  user: User;
}
export interface DispatchProps {
  createDialogOpen: Function;
  createDialogClose: Function;
  load: Function;
}

function OrganizationDetailComponent(props: StateProps & DispatchProps & WithStyles & RouteComponentProps<any>) {
  const { classes } = props;
  const { organizations, groups, loading } = props;
  const { createDialogOpen, load } = props;
  const { "match": { "params": { organizationId } } } = props;
  const currentOrganization = organizations.find(x => x.id === organizationId);
  return (
    <div>
      <Typography type="title" className={classes.title}>Organization: {currentOrganization && currentOrganization.name || ""}</Typography>
      <Paper className={classes.root}>
        <List className={classes.list} subheader={<ListSubheader className={classes.stickey}>Groups</ListSubheader>}>
          {loading ? <CircularProgress className={classes.loadingCircle} /> : groups
            .map((x: GroupModel, i: number) =>
              <ListItem key={i} button>
                <ListItemText primary={x.name} />
              </ListItem>
            )}
        </List>
      </Paper>
      <div className={classes.bottomButtons}>
        <Tooltip title="Create New Groups" placement="bottom">
          <span>
            <Button className={classes.bottomButton} onClick={() => createDialogOpen()} fab color="primary" aria-label="Create New Group" disabled={loading}>
              <AddIcon />
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Refresh" placement="bottom">
          <span>
            <Button className={classes.bottomButton} onClick={() => load(organizationId)} fab color="default" aria-label="Refresh" disabled={loading}>
              <RefreshIcon />
            </Button>
          </span>
        </Tooltip>
      </div>
      { currentOrganization ? <CreateGroupForm organization={currentOrganization} /> : "" }
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
    "z-index": 999
  },
  "bottomButton": {
    "margin": theme.spacing.unit * 3
  },
  "loadingCircle": {
    "margin": theme.spacing.unit * 2
  }
});

export const OrganizationDetail = withStyles(styles)(OrganizationDetailComponent);
