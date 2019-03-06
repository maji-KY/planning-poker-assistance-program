import * as firebase from "firebase/app";
import "firebase/firestore";

export function getFirestore(): firebase.firestore.Firestore {
  if (firebase.firestore) {
    return firebase.firestore();
  }
  throw "firebase.firestore not found";

}
