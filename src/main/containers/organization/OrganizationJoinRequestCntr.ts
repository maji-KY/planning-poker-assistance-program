import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { OrganizationJoinRequest } from "components/organization/OrganizationJoinRequest";
import { accept, cancelJoin } from "modules/OrganizationJoinRequest";

function mapStateToProps({ organizationJoinRequestReducer }: any): any {
  return {...organizationJoinRequestReducer};
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({accept, "refuse": cancelJoin}, dispatch);
}

const OrganizationJoinRequestCntr = connect(mapStateToProps, mapDispatchToProps)(OrganizationJoinRequest);

export default OrganizationJoinRequestCntr;
