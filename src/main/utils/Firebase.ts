import * as firebase from "firebase/app";
import "firebase/firestore";
import { FirebaseFirestore } from "@firebase/firestore-types";

export function getFirestore(): FirebaseFirestore {
  if (firebase.firestore) {
    return firebase.firestore();
  }
  throw "firebase.firestore not found";

}
