import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Settings } from "components/Settings";
import { pushError } from "modules/MyAppBarMenu";

function mapStateToProps({ userReducer }: any): any {
  return Object.assign({}, userReducer);
}

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return bindActionCreators({pushError}, dispatch);
}

const SettingsCntr = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default SettingsCntr;
