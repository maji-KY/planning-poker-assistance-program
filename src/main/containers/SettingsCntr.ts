import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Settings } from "components/Settings";

function mapStateToProps({ authReducer, myAppBarMenuReducer }: any): any {
  return Object.assign({}, authReducer, myAppBarMenuReducer);
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({}, dispatch);
}

const SettingsCntr = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default SettingsCntr;
