import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { reduxForm, InjectedFormProps, getFormValues } from "redux-form";
import UserSettingsForm, { StateProps } from "components/UserSettingsForm";
import { modUser } from "modules/User";

function handleSubmit(value: any, dispatch: Dispatch<any>, props: InjectedFormProps & StateProps) {
  const actionDispatcher = bindActionCreators({
    modUser
  }, dispatch);
  const loginUser = props.loginUser;
  const { name, iconUrl } = value;
  if (loginUser) {
    actionDispatcher.modUser(loginUser.copy({name, iconUrl}));
  }
}

function mapStateToProps(state: any): any {
  const { "userReducer": { loginUser, updating } } = state;
  const formValue: any = getFormValues("UserSettingsForm")(state);
  return {
    "initialValues": {
      "name": loginUser.name,
      "iconUrl": loginUser.iconUrl
    },
    "currentIconUrl": formValue && formValue.iconUrl,
    loginUser,
    updating
  };
}

const UserSettingsFormCntr = connect(mapStateToProps, null)(
  reduxForm({
    "form": "UserSettingsForm",
    "onSubmit": handleSubmit
  })(UserSettingsForm)
);

export default UserSettingsFormCntr;
