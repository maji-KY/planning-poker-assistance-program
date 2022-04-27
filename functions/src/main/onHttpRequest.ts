import * as functions from "firebase-functions";
import { Request, Response } from "express";
import authFilter from "authFilter";
import * as cors from "cors";

const corsFilter = cors({ "origin": true });

export default function onHttpRequest(
  handler: (req: Request, res: Response, userId: string) => void,
): functions.HttpsFunction {
  return functions.https.onRequest((req: any, res: any) => {
    corsFilter(req, res, () => {
      authFilter(req, res, (userId: string) => {
        handler(req, res, userId);
      });
    });
  });
}
