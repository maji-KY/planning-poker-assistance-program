import * as React from "react";

import * as classNames from "classnames";
import { withStyles, WithStyles, StyleRulesCallback } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Tooltip from "material-ui/Tooltip";
import Table, { TableBody, TableCell, TableHead, TableRow } from "material-ui/Table";
import Slide from "material-ui/transitions/Slide";
import Dialog, { DialogContent, DialogTitle } from "material-ui/Dialog";
import { FormControlLabel, FormGroup } from "material-ui/Form";
import Switch from "material-ui/Switch";
import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import ChatIcon from "material-ui-icons/Chat";
import SettingsIcon from "material-ui-icons/Settings";
import ClearIcon from "material-ui-icons/Clear";

import LoadingCircle from "components/parts/LoadingCircle";
import GroupModel from "models/Group";

export interface Player {
  userId: string;
  userName: string;
  iconUrl: string;
  rightToTalk: boolean;
  ready: boolean;
  trump: string;
  isMe: boolean;
  isStopper: boolean;
}

interface StateProps {
  loading: boolean;
  group: GroupModel;
  players: Player[];
  joined: boolean;
  settingDialogOpened: boolean;
  showOwnTrump: boolean;
  children?: any;
}

export interface DispatchProps {
  join: Function;
  kick: Function;
  stand: Function;
  clearCards: Function;
  settingDialogOpen: any;
  settingDialogClose: any;
  changeShowOwnTrump: Function;
  changeAntiOpportunism: Function;
}

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

function BoardComponent(props: StateProps & DispatchProps & WithStyles) {
  const { classes } = props;
  const { loading, players, group, joined, settingDialogOpened, showOwnTrump } = props;
  const { join, kick, stand, clearCards, settingDialogOpen, settingDialogClose, changeShowOwnTrump, changeAntiOpportunism } = props;
  return (
    <div>
      <Typography type="title" className={classes.title}>Group: {group.name}</Typography>
      <Typography type="headline" color="primary" className={classes.topic}>Topic: {group.topic}</Typography>
      <div className={classes.children}>{props.children}</div>
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player({players.length})</TableCell>
              <TableCell>Card</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell><LoadingCircle /></TableCell></TableRow> : players.map(player => {
              return (
                <TableRow key={player.userId} className={classNames((player.rightToTalk || player.isStopper) && classes.rightToTalk)}>
                  <TableCell>
                    <Chip
                      avatar={<Avatar src={player.iconUrl}/>}
                      label={player.userName}
                      onDelete={() => kick(player.userId)}
                    />
                  </TableCell>
                  <TableCell className={classes.card} >
                    {
                      group.allReady || player.isStopper
                        ? player.trump : player.ready
                          ? player.isMe && showOwnTrump
                            ? player.trump : "ready..."
                          : ""
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <div className={classes.bottomSpace} />
      <div className={classes.bottomButtons}>
        { loading ? "" : joined
          ? <Tooltip title="Board Settings" placement="bottom">
            <span>
              <Button onClick={settingDialogOpen} className={classes.bottomButton} fab color="default" aria-label="Board Settings">
                <SettingsIcon/>
              </Button>
            </span>
          </Tooltip>
          : <Tooltip title="Join Group" placement="bottom">
            <span>
              <Button onClick={() => join()} className={classes.bottomButton} fab color="primary" aria-label="Join Group">
                <ChatIcon/>
              </Button>
            </span>
          </Tooltip>
        }
        {
          !loading && joined && (group.allReady
            ? <Tooltip title="Clear All Cards" placement="bottom">
              <span>
                <Button onClick={() => clearCards()} className={classes.betButton} fab color="contrast" aria-label="clear all cards">
                  CLR
                </Button>
              </span>
            </Tooltip>
            : ["1", "2", "3", "5", "8", "13", "21", "BIG", "?", "BREAK"].map(x =>
              <Tooltip key={x} title={x} placement="bottom">
                <span>
                  <Button onClick={() => stand(x)} className={classes.betButton} fab color="primary" aria-label={x}>
                    {x}
                  </Button>
                </span>
              </Tooltip>
            ))
        }
      </div>
      <Dialog
        maxWidth="xs"
        open={settingDialogOpened}
        onClose={settingDialogClose}
        transition={Transition}
      >
        <DialogTitle>Board Settings</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showOwnTrump}
                  onChange={(event, checked) => changeShowOwnTrump(checked)}
                />
              }
              label="showOwnTrump"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={group.antiOpportunism}
                  onChange={(event, checked) => changeAntiOpportunism(checked)}
                />
              }
              label="anti-opportunism mode"
            />
          </FormGroup>
          <Button onClick={() => clearCards()} color="default" raised aria-label="Clear All Cards">
            <ClearIcon/>Clear All Cards
          </Button>
        </DialogContent>
      </Dialog>
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
  "topic": {
    "margin": 10
  },
  "children": {
    "margin": 10
  },
  "rightToTalk": {
    "background": "#acdcd3"
  },
  "card": {
    "font-weight": "bold",
    "font-size": 36,
    "color": theme.palette.common.lightBlack
  },
  "bottomButtons": {
    "position": "fixed",
    "bottom": 0,
    "z-index": 999
  },
  "bottomButton": {
    "margin": theme.spacing.unit * 3
  },
  "betButton": {
    "margin": theme.spacing.unit * 0.5,
    "width": 90,
    "height": 90
  },
  "bottomSpace": {
    "height": 110
  },
  "loadingCircle": {
    "margin": theme.spacing.unit * 2
  }
});

export const Board = withStyles(styles)(BoardComponent);
