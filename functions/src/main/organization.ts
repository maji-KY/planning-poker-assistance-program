import * as admin from "firebase-admin";
import { Request, Response } from "express";
import onHttpRequest from "onHttpRequest";

export const createOrganization = onHttpRequest(async (req: Request, res: Response, userId: string) => {
  const { organizationName } = req.body;
  if (organizationName) {
    const createdOrganizationId = (+new Date).toString(36);
    const fs = admin.firestore();
    await fs.collection("organizations").doc(createdOrganizationId).set({
      "name": organizationName
    });
    const uo = await fs.collection("UserOrganizations").doc(userId).get();
    const currentData = uo.exists ? uo.data() : {"organizationIds": []};
    const currentOrganizationIds: string[] = currentData.organizationIds;
    await fs.collection("UserOrganizations").doc(userId).set({
      "organizationIds": currentOrganizationIds.concat(createdOrganizationId)
    });

    res.status(201).send("created");
  } else {
    res.status(400).send("organizationName required");
  }
});
