import * as React from "react";

import * as classNames from 'classnames';
import Copyable from "utils/Copyable";

import { withStyles, StyleRulesCallback } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Snackbar from 'material-ui/Snackbar';

import MenuIcon from 'material-ui-icons/Menu';
import InputIcon from 'material-ui-icons/Input';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import DomainIcon from 'material-ui-icons/Domain';
import GroupIcon from 'material-ui-icons/Group';
import PersonIcon from 'material-ui-icons/Person';
import SettingsIcon from 'material-ui-icons/Settings';

import User from "models/User";

export class Error extends Copyable<Error> {
  constructor(readonly time: number, readonly message: string, readonly opened: boolean = true) {
    super();
  }
}

export interface StateProps {
  classes: any;
  children: any;
  title: string;
  auth: boolean;
  loginUser?: User;
  userMenuOpened: boolean;
  userMenuAnchor: HTMLElement;
  drawerOpened: boolean;
  errors: Error[];
}
export interface DispatchProps {
  login: Function;
  logout: Function;
  userMenuOpen: Function;
  userMenuClose: Function;
  drawerOpen: Function;
  drawerClose: Function;
  closeError: Function;
  pushError: Function;
}

function MyAppBarMenuComponent(props: StateProps & DispatchProps) {
  const { classes } = props;
  const { children, title, auth, login, drawerOpened, errors } = props;
  const { drawerOpen, drawerClose, closeError } = props;
  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <AppBar className={classNames(classes.appBar, drawerOpened && classes.appBarShift)}>
          <Toolbar>
            <IconButton
              color="contrast"
              aria-label="Menu"
              className={classNames(classes.menuButton, drawerOpened && classes.hide, !auth && classes.hide)}
              onClick={() => drawerOpen()}
            >
              <MenuIcon/>
            </IconButton>
            <Typography type="title" color="inherit" noWrap className={classes.title}>
              {title}
            </Typography>
            { auth ?
              <LoginMenu {...props} /> :
              <Button color="contrast" onClick={() => login()}>Login with Google&nbsp;<InputIcon /></Button>
            }
          </Toolbar>
        </AppBar>
        <Drawer
          type="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !drawerOpened && classes.drawerPaperClose),
          }}
          className={classNames(!auth && classes.hide)}
          open={drawerOpened}
        >
          <div className={classes.drawerInner}>
            <div className={classes.drawerHeader}>
              <IconButton onClick={() => drawerClose()}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <AppMenu />
          </div>
        </Drawer>
        <main className={classes.content}>{children}</main>
        {errors.map((error) => (
          <Snackbar
            key={error.time}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            open={error.opened}
            onRequestClose={() => closeError(error.time)}
            autoHideDuration={5000}
            message={<Typography className={classes.error}>Error: {error.message}</Typography>}
          />
        ))}
      </div>
    </div>
  );
}

function LoginMenu(props: StateProps & DispatchProps) {
  const { loginUser, userMenuOpened, userMenuAnchor, logout, userMenuOpen, userMenuClose, drawerClose } = props;
  return (
    <div>
      <IconButton
        aria-owns={userMenuOpened ? 'menu-appbar' : null}
        aria-haspopup="true"
        onClick={(e: any) => userMenuOpen(e.currentTarget)}
        color="contrast"
      >
        <Avatar alt="Avatar" src={loginUser && loginUser.iconUrl || ""} />
      </IconButton>
      <Menu
        anchorEl={userMenuAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={userMenuOpened}
        onRequestClose={() => userMenuClose()}
      >
        <MenuItem component="a" href="#/account">My account</MenuItem>
        <MenuItem onClick={() => {userMenuClose(); drawerClose(); logout()}}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

function AppMenu() {
  return (
    <div>
      <List>
        <ListItem button component="a" href="#/organization">
          <ListItemIcon>
            <DomainIcon />
          </ListItemIcon>
          <ListItemText primary="Organization" />
        </ListItem>
        <ListItem button component="a" href="#/group">
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Group" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component="a" href="#/account">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button component="a" href="#/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  );
}

const drawerWidth = 240;

const styles: StyleRulesCallback<string> = theme => ({
  root: {
    width: '100%',
    height: "100%",
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.navDrawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 36,
    [theme.breakpoints.up('sm')]: {
      marginLeft: -20,
    },
  },
  title: {
    flex: 1
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100vh - 56px)',
    "overflow": "scroll",
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100vh - 64px)',
      marginTop: 64,
    },
  },
  "error": {
    color: "#FF5FC0",
  }
});

export const MyAppBarMenu = withStyles(styles, { withTheme: true })(MyAppBarMenuComponent);
