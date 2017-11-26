import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const option = functions.config().firebase;

option && admin.initializeApp(option);

export * from "organization";

