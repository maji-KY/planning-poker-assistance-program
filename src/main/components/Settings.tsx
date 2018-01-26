import * as React from "react";

import Typography from "material-ui/Typography";

import LoadingCircle from "components/parts/LoadingCircle";
import UserSettingsForm from "containers/UserSettingsFormCntr";
import User from "models/User";

interface StateProps {
  loginUser?: User;
}
export interface DispatchProps {
  pushError: Function;
}

export function Settings(props: StateProps & DispatchProps) {
  const { loginUser } = props;
  return (
    <div>
      <Typography type="title">Settings</Typography>
      { loginUser
        ? <UserSettingsForm />
        : <LoadingCircle />
      }
    </div>
  );
}
