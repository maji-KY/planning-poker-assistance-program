import * as admin from "firebase-admin";
import { Request, Response } from "express";
import onHttpRequest from "onHttpRequest";

export const createOrganization = onHttpRequest(async (req: Request, res: Response, userId: string) => {
  const { organizationName } = req.body;
  if (organizationName) {
    const createdOrganizationId = (+new Date()).toString(36);
    const fs = admin.firestore();
    await fs.collection("organizations").doc(createdOrganizationId).set({
      "name": organizationName,
    });
    const uo = await fs.collection("UserOrganizations").doc(userId).get();
    const currentData = uo.exists && uo.data();
    const currentOrganizationIds: string[] = (currentData && currentData.organizationIds) || [];
    await fs
      .collection("UserOrganizations")
      .doc(userId)
      .set({
        "organizationIds": currentOrganizationIds.concat(createdOrganizationId),
      });

    res.status(201).send("created");
  } else {
    res.status(400).send("organizationName required");
  }
});

export const acceptJoinRequest = onHttpRequest(async (req: Request, res: Response, userId: string) => {
  const { target, user } = req.body;
  const fs = admin.firestore();
  const requestUo = await fs.collection("UserOrganizations").doc(userId).get();
  const requestUoData = requestUo.exists && requestUo.data();
  const validRequest = (requestUoData ? requestUoData.organizationIds : []).find((x: string) => x === target.id);
  if (!validRequest) {
    res.status(401).send("unauthorized request");
  } else if (target && user) {
    const uo = await fs.collection("UserOrganizations").doc(user.id).get();
    const currentData = uo.exists && uo.data();
    const currentOrganizationIds: string[] = (currentData && currentData.organizationIds) || [];
    await fs
      .collection("UserOrganizations")
      .doc(user.id)
      .set({
        "organizationIds": currentOrganizationIds.concat(target.id),
      });
    await fs.collection("organizations").doc(target.id).collection("joinRequests").doc(user.id).delete();

    res.status(205).send("user joined");
  } else {
    res.status(400).send("target and user required");
  }
});
