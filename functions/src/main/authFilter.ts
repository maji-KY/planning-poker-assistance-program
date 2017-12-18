import * as admin from "firebase-admin";
import { Request, Response } from "express";

export default function authFilter(req: Request, res: Response, cb: (userId: string) => void) {
  const authorization = req.headers.authorization;
  if (typeof authorization === "string") {
    const token = authorization.substring(7);
    admin.auth().verifyIdToken(token).then(
      data => cb(data.uid),
      reason => res.status(401).send(reason)
    ).catch(reason => res.status(500).send(reason));
  } else {
    res.status(401).send("authorization required");
  }
}
