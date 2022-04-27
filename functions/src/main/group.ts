import * as admin from "firebase-admin";
import { Request, Response } from "express";
import onHttpRequest from "onHttpRequest";

export const createGroup = onHttpRequest(async (req: Request, res: Response, userId: string) => {
  const { organizationId, groupName } = req.body;
  if (organizationId && groupName) {
    const fs = admin.firestore();
    const user = await fs.collection("users").doc(userId).get();
    if (user.exists) {
      const createdGroupId = (+new Date()).toString(36);
      const organizationRef = fs.collection("organizations").doc(organizationId);
      const organization = await organizationRef.get();
      if (organization.exists) {
        await organizationRef.collection("groups").doc(createdGroupId).set({
          "name": groupName,
          "topic": "New Planning",
          "allReady": false,
        });
        res.status(201).send("created");
      } else {
        res.status(400).send("invalid organizationId");
      }
    } else {
      res.status(400).send("invalid userId");
    }
  } else {
    res.status(400).send("organizationId and groupName required");
  }
});

export const test = onHttpRequest((req: Request, res: Response, userId: string) => {
  res.status(200).send(`userId: ${userId}`);
});
