import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { reduxForm, InjectedFormProps, FormErrors } from "redux-form";
import CreateOrganizationForm, { StateProps, required, notNbsp, duplicate } from "components/organization/CreateOrganizationForm";
import { create, createDialogClose } from "modules/Organization";

function handleSubmit(value: any, dispatch: Dispatch<{}>, props: InjectedFormProps & StateProps) {
  const actionDispatcher = bindActionCreators({
    create
  }, dispatch);
  const loginUser = props.loginUser;
  if (loginUser) {
    actionDispatcher.create({"user": loginUser, "name": value.name});
  }
}

function validation(values: any, props: any): FormErrors<FormData> {
  const { "name": nameValue } = values;
  const name = required(nameValue) || notNbsp(nameValue) || duplicate(nameValue, values, props) || undefined;
  return name ? {name} : {};
}

function mapStateToProps(state: any): any {
  const { "organizationReducer": { organizations, createDialogOpened, creating } } = state;
  const { "userReducer": { loginUser } } = state;
  return {
    organizations,
    createDialogOpened,
    creating,
    loginUser
  };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({createDialogClose}, dispatch);
}

const CreateOrganizationFormCntr = connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    "form": "CreateOrganizationForm",
    "onSubmit": handleSubmit,
    "validate": validation
  })(CreateOrganizationForm)
);

export default CreateOrganizationFormCntr;
