import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { MyAppBarMenu, StateProps, DispatchProps } from "components/MyAppBarMenu";
import { login, logout } from "modules/Auth";
import { userMenuOpen, userMenuClose, drawerOpen, drawerClose, closeError, pushError } from "modules/MyAppBarMenu";

function mapStateToProps({ authReducer, myAppBarMenuReducer, userReducer }: any): StateProps {
  return Object.assign({}, authReducer, myAppBarMenuReducer, userReducer);
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return bindActionCreators({login, logout, userMenuOpen, userMenuClose, drawerOpen, drawerClose, closeError, pushError }, dispatch);
}

const MyAppBarMenuCntr: any = connect(mapStateToProps, mapDispatchToProps)(MyAppBarMenu);

export default MyAppBarMenuCntr;
