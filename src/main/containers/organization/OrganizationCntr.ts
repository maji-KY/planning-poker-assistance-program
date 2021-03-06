import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Organization } from "components/organization/Organization";
import { createDialogOpen, createDialogClose, refresh } from "modules/Organization";
import { transition } from "modules/MyAppBarMenu";
import { requestJoin } from "modules/OrganizationJoinRequest";

function mapStateToProps({ organizationReducer, userReducer }: any): any {
  return Object.assign({}, organizationReducer, {"user": userReducer.loginUser});
}

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return bindActionCreators({createDialogOpen, createDialogClose, transition, refresh, requestJoin}, dispatch);
}

const OrganizationCntr = connect(mapStateToProps, mapDispatchToProps)(Organization);

export default OrganizationCntr;
