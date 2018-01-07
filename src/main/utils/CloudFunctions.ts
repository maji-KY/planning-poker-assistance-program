import axios, {AxiosPromise} from "axios";

import * as firebase from "firebase/app";

export function funcURL(funcName: string): string {
  const options: any = firebase.app().options;
  return `https://us-central1-${options.projectId}.cloudfunctions.net/${funcName}`;
}

export function post(funcName: string, data: any): AxiosPromise<any> {
  if (!firebase.auth) return Promise.reject("firebase.auth not found");
  const currentUser = firebase.auth().currentUser;
  return currentUser ? currentUser.getIdToken(true).then(x =>
    axios.post(funcURL(funcName), data, {"headers": {"Authorization": `Bearer ${x}`}})
  ) : Promise.reject("currentUser is null");
}
