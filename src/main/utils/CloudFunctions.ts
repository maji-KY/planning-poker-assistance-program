import * as firebase from "firebase/app";

export function funcURL(funcName: string): string {
  const options: any = firebase.app().options;
  return `https://us-central1-${options.projectId}.cloudfunctions.net/${funcName}`;
}
