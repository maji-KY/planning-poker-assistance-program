import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { reduxForm, InjectedFormProps, FormErrors } from "redux-form";
import CreateGroupForm, { StateProps, required, notNbsp, duplicate } from "components/group/CreateGroupForm";
import { create, createDialogClose } from "modules/Group";
import Organization from "models/Organization";

function handleSubmit(value: any, dispatch: Dispatch<{}>, props: InjectedFormProps & StateProps) {
  const actionDispatcher = bindActionCreators({
    create
  }, dispatch);
  const {loginUser, organization} = props;
  if (loginUser) {
    actionDispatcher.create({"user": loginUser, organization, "name": value.name});
  }
}

function validation(values: any, props: any): FormErrors<FormData> {
  const { "name": nameValue } = values;
  const name = required(nameValue) || notNbsp(nameValue) || duplicate(nameValue, values, props) || undefined;
  return name ? {name} : {};
}

function mapStateToProps(state: any): any {
  const { "groupReducer": { groups, createDialogOpened, creating } } = state;
  const { "userReducer": { loginUser } } = state;
  return {
    groups,
    createDialogOpened,
    creating,
    loginUser
  };
}

function mapDispatchToProps(dispatch: Dispatch<{}>): any {
  return bindActionCreators({createDialogClose}, dispatch);
}

const CreateGroupFormCntr: React.ComponentClass<{organization: Organization}> = connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    "form": "CreateGroupForm",
    "onSubmit": handleSubmit,
    "validate": validation
  })(CreateGroupForm)
) as React.ComponentClass<any>;

export default CreateGroupFormCntr;
