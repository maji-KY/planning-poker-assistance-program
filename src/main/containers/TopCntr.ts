import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Top } from "components/Top";

function mapStateToProps({ authReducer, myAppBarMenuReducer }: any): any {
  return Object.assign({}, authReducer, myAppBarMenuReducer);
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({}, dispatch);
}

const TopCntr = connect(mapStateToProps, mapDispatchToProps)(Top);

export default TopCntr;
