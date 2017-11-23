import * as React from "react";
import {Field} from "redux-form";
import TextField from "material-ui/TextField";

const generateInputComponent = (fullWidth?: boolean) => function InputComponent({
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
    fullWidth={fullWidth}/>;
};

export interface Props {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  validate?: any;
  componentClass?: any;
  fullWidth?: boolean;
  children?: any;
}

export function MyTextField(props: Props) {
  return <Field
    component={generateInputComponent(props.fullWidth)}
    {...props}
  >{props.children}</Field>;
}
