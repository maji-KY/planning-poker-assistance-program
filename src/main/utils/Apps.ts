import * as firebase from "firebase/app";
import { User } from "@firebase/auth-types";

export function initialized(): boolean {
  return firebase.apps.length !== 0;
}

export function loginUser(): User | null {
  return firebase.auth && firebase.auth().currentUser || null;
}
