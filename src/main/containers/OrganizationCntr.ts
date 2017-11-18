import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Organization } from "components/Organization";

function mapStateToProps({ authReducer, myAppBarMenuReducer }: any): any {
  return Object.assign({}, authReducer, myAppBarMenuReducer);
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({}, dispatch);
}

const OrganizationCntr = connect(mapStateToProps, mapDispatchToProps)(Organization);

export default OrganizationCntr;
