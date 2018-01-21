import * as firebase from "firebase/app";
import "firebase/firestore";
import { Firestore } from "firebase/firestore";

export function getFirestore(): Firestore {
  if (firebase.firestore) {
    return firebase.firestore();
  }
  throw "firebase.firestore not found";

}
