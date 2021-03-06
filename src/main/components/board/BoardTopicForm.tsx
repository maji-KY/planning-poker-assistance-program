import * as React from "react";
import { Form, InjectedFormProps } from "redux-form";

import { withStyles, WithStyles, StyleRulesCallback } from "material-ui/styles";
import Button from "material-ui/Button";
import { CircularProgress } from "material-ui/Progress";

import { MyTextField } from "components/parts/FormField";
import Group from "models/Group";

// validation
export const required = (value: any) => value ? undefined : "required";
export const notNbsp = (value: any) => value && value.trim && value.trim() !== "" ? undefined : "required";
export const notChanged = (value: any, allValues: any, props: any) => value === props.group.topic ? "not changed" : undefined;

function BoardTopicFormComponent({
  loading,
  classes,
  handleSubmit,
  reset,
  pristine,
  submitting,
  invalid
}: InjectedFormProps & WithStyles & {group: Group, loading: boolean}) {

  return (
    <Form onSubmit={handleSubmit}>
      <MyTextField margin="dense" name="topic" type="text" label="Change Topic" validate={[required, notNbsp, notChanged]} />
      <Button onClick={() => reset()} disabled={submitting}>
        Clear
      </Button>
      <Button type="submit" color="primary" disabled={loading || pristine || submitting || invalid}>
        Change
        {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
      </Button>
    </Form>
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

const BoardTopicForm = withStyles(styles, { "withTheme": true })(BoardTopicFormComponent);

export default BoardTopicForm;
