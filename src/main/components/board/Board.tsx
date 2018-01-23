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
  console.log(props);
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
                <TableRow key={player.userId} className={classNames(player.rightToTalk && classes.rightToTalk)}>
                  <TableCell>
                    <Chip
                      avatar={<Avatar src={player.iconUrl}/>}
                      label={player.userName}
                      onDelete={() => kick(player.userId)}
                    />
                  </TableCell>
                  <TableCell className={classes.card} >
                    {player.trump || ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
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
          !loading && joined && !group.allReady && ["1", "2", "3", "5", "8", "13", "21", "BIG", "?", "BREAK"].map(x =>
            <Tooltip key={x} title={x} placement="bottom">
              <span>
                <Button onClick={() => stand(x)} className={classes.bottomButton} fab color="primary" aria-label={x}>
                  {x}
                </Button>
              </span>
            </Tooltip>
          )
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
          <Button onClick={() => clearCards()} color="default" raised aria-label="Clear Cards">
            <ClearIcon/>Clear Cards
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
  "loadingCircle": {
    "margin": theme.spacing.unit * 2
  }
});

export const Board = withStyles(styles)(BoardComponent);
