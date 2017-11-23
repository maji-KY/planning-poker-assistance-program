import axios from "axios";
import * as React from "react";
import { InjectedFormProps } from "redux-form";

import { withStyles, StyleRulesCallback } from "material-ui/styles";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import { CircularProgress } from "material-ui/Progress";

import { MyTextField } from "components/parts/FormField";
import User from "models/User";

// validation
const required = (value: any) => value ? undefined : "required";
const notNbsp = (value: any) => value && value.trim && value.trim() !== "" ? undefined : "required";
const urlReg = /^https?:\/\/.+$/;
const isValidUrl = (value: any) => value.match(urlReg) ? undefined : "not a valid URL";
export const asyncValidate = (values: any) => axios
  .get(values.iconUrl)
  .then(() => {})
  .catch(() => {throw {"iconUrl": "cannot access the URL"}});

export interface StateProps {
  classes: any;
  currentIconUrl?: string;
  loginUser?: User;
  updating: boolean;
}

function UserSettingsFormComponent({currentIconUrl, updating, classes, handleSubmit, pristine, submitting, invalid, reset}: InjectedFormProps & StateProps) {

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <MyTextField fullWidth name="name" type="text" label="name" placeholder="name" validate={[required, notNbsp]} />
      </div>
      <div>
        <MyTextField fullWidth name="iconUrl" type="text" label="iconUrl" placeholder="iconUrl" validate={[required, isValidUrl]} />
      </div>
      <div>
        <Paper className={classes.iconPreviewArea}><img src={currentIconUrl} className={classes.iconPreview} /></Paper>
      </div>
      <div>
        <Button type="submit" className={classes.button} disabled={pristine || submitting || invalid || updating}>
          Change
          {updating && <CircularProgress size={24} className={classes.buttonProgress} />}
        </Button>
        <Button type="button" className={classes.button} onClick={reset}>Reset</Button>
      </div>
    </form>
  );

}

const styles: StyleRulesCallback<string> = theme => ({
  "iconPreviewArea": {
    "margin": "10px 0"
  },
  "iconPreview": {
    "height": 300,
    "width": 300,
    "margin": 15
  },
  "button": {
    "margin": 20,
    "padding": 20
  },
  "buttonProgress": {
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "marginTop": -12,
    "marginLeft": -12
  }
});

const UserSettingsForm = withStyles(styles, { "withTheme": true })(UserSettingsFormComponent);

export default UserSettingsForm;
