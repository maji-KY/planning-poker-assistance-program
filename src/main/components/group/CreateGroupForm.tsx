import * as React from "react";
import { Form, InjectedFormProps } from "redux-form";

import { withStyles, WithStyles, StyleRulesCallback } from "material-ui/styles";
import Button from "material-ui/Button";
import { CircularProgress } from "material-ui/Progress";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";

import { MyAutoFocusTextField } from "components/parts/FormField";
import User from "models/User";
import Organization from "models/Organization";
import Group from "models/Group";

// validation
export const required = (value: any) => value ? undefined : "required";
export const notNbsp = (value: any) => value && value.trim && value.trim() !== "" ? undefined : "required";
export const duplicate = (value: any, allValues: any, props: any) => props.groups.find((x: any) => x.name === value) ? "duplicate name" : undefined;

export interface StateProps {
  organization: Organization;
  groups: Group[];
  creating: boolean;
  createDialogOpened: boolean;
  loginUser: User;
}
export interface DispatchProps {
  createDialogClose: Function;
}

function CreateGroupFormComponent({
  createDialogOpened,
  creating,
  createDialogClose,
  classes,
  handleSubmit,
  pristine,
  submitting,
  invalid
}: InjectedFormProps & StateProps & DispatchProps & WithStyles) {

  return (
    <Dialog open={createDialogOpened} onRequestClose={() => createDialogClose()}>
      <Form onSubmit={handleSubmit}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create new group,<br />please enter group name here.
          </DialogContentText>
          <MyAutoFocusTextField margin="dense" name="name" type="text" label="Group Name" validate={[required, notNbsp, duplicate]} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => createDialogClose()} disabled={submitting || creating}>
            Cancel
          </Button>
          <Button type="submit" color="primary" disabled={pristine || submitting || invalid || creating}>
            Create
            {creating && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );

}

const styles: StyleRulesCallback<string> = theme => ({
  "buttonProgress": {
    "position": "absolute",
    "top": "50%",
    "left": "50%",
    "marginTop": -12,
    "marginLeft": -12
  }
});

const CreateGroupForm = withStyles(styles, { "withTheme": true })(CreateGroupFormComponent);

export default CreateGroupForm;
