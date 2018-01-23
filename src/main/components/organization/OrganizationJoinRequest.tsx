import * as React from "react";

import { withStyles, WithStyles, StyleRulesCallback } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from "material-ui/List";
import IconButton from "material-ui/IconButton";
import Tooltip from "material-ui/Tooltip";
import Avatar from "material-ui/Avatar";
import { CircularProgress } from "material-ui/Progress";
import PersonAddIcon from "material-ui-icons/PersonAdd";
import BlockIcon from "material-ui-icons/Block";

import OrganizationModel from "models/Organization";
import User from "models/User";

interface StateProps {
  target: OrganizationModel;
  loading: boolean;
  requestUsers: User[];
}
export interface JoinRequest {
  target: OrganizationModel;
  user: User;
}
export interface DispatchProps {
  accept: (JoinRequest) => void;
  refuse: (JoinRequest) => void;
}

function OrganizationJoinRequestComponent(props: StateProps & DispatchProps & WithStyles) {
  const { classes } = props;
  const { target, loading, requestUsers } = props;
  const { accept, refuse } = props;
  return (
    <div>
      <Typography type="title" className={classes.title}>Organization: {target && target.name || ""}</Typography>
      <Paper className={classes.root}>
        <List className={classes.list} subheader={<ListSubheader className={classes.stickey}>Join Request</ListSubheader>}>
          {loading ? <CircularProgress className={classes.loadingCircle} /> : requestUsers
            .map((x: User, i: number) =>
              <ListItem key={i} button>
                <ListItemAvatar>
                  <Avatar src={x.iconUrl}/>
                </ListItemAvatar>
                <ListItemText primary={x.name} />
                <ListItemSecondaryAction>
                  <Tooltip title="Accept" placement="top">
                    <IconButton onClick={() => accept({target, "user": x})} aria-label="Accept" className={classes.actionButton}>
                      <PersonAddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refuse" placement="top">
                    <IconButton onClick={() => refuse({target, "user": x})} aria-label="Refuse" className={classes.actionButton}>
                      <BlockIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
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
  "actionButton": {
    "margin": "0 10px"
  },
  "loadingCircle": {
    "margin": theme.spacing.unit * 2
  }
});

export const OrganizationJoinRequest = withStyles(styles)(OrganizationJoinRequestComponent);
