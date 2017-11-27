import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { Organization } from "components/organization/Organization";
import { createDialogOpen, createDialogClose } from "modules/Organization";

function mapStateToProps({ organizationReducer }: any): any {
  return Object.assign({}, organizationReducer);
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({createDialogOpen, createDialogClose}, dispatch);
}

const OrganizationCntr = connect(mapStateToProps, mapDispatchToProps)(Organization);

export default OrganizationCntr;
