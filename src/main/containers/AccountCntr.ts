import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Account } from "components/Account";

function mapStateToProps({ authReducer, myAppBarMenuReducer }: any): any {
  return Object.assign({}, authReducer, myAppBarMenuReducer);
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({}, dispatch);
}

const AccountCntr = connect(mapStateToProps, mapDispatchToProps)(Account);

export default AccountCntr;
