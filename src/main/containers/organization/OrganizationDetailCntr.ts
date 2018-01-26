import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { OrganizationDetail } from "components/organization/OrganizationDetail";
import { createDialogOpen, createDialogClose, load } from "modules/Group";
import { transition } from "modules/MyAppBarMenu";

function mapStateToProps({ organizationReducer, groupReducer, userReducer }: any): any {
  return {...{"organizations": organizationReducer.organizations}, ...groupReducer, ...{"user": userReducer.loginUser}};
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({createDialogOpen, createDialogClose, transition, load}, dispatch);
}

const OrganizationDetailCntr = connect(mapStateToProps, mapDispatchToProps)(OrganizationDetail);

export default OrganizationDetailCntr;
