import * as React from "react";
import {Field} from "redux-form";
import TextField from "material-ui/TextField";

function InputComponent({
  input,
  placeholder,
  label,
  "meta": {
    touched,
    error
  }
}: any): JSX.Element {
  const isError = !!(touched && error);
  return <TextField {...input}
    placeholder={placeholder}
    label={isError ? error : label}
    error={isError}
    fullWidth
  />;
}

function AutoFocusInputComponent({
  input,
  placeholder,
  label,
  "meta": {
    touched,
    error
  }
}: any): JSX.Element {
  const isError = !!(touched && error);
  return <TextField {...input}
    placeholder={placeholder}
    label={isError ? error : label}
    error={isError}
    fullWidth
    autoFocus
    margin="dense"
  />;
}

export interface Props {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  validate?: any;
  componentClass?: any;
  fullWidth?: boolean;
  autoFocus?: boolean;
  margin?: string;
  children?: any;
}

export function MyTextField(props: Props) {
  return <Field
    component={InputComponent}
    {...props}
  >{props.children}</Field>;
}

export function MyAutoFocusTextField(props: Props) {
  return <Field
    component={AutoFocusInputComponent}
    {...props}
  >{props.children}</Field>;
}
