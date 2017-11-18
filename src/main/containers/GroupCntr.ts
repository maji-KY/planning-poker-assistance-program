import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Group } from "components/Group";

function mapStateToProps({ authReducer, myAppBarMenuReducer }: any): any {
  return Object.assign({}, authReducer, myAppBarMenuReducer);
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({}, dispatch);
}

const GroupCntr = connect(mapStateToProps, mapDispatchToProps)(Group);

export default GroupCntr;
