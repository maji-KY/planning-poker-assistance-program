import * as firebase from "firebase/app";

export function initialized(): boolean {
  return firebase.apps.length !== 0;
}
