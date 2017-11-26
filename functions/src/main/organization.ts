import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

const corsFilter = cors({"origin": true});

export const createOrganization = functions.https.onRequest(async (req, res) => {
  corsFilter(req, res, await (async () => {
    const { userId, organizationName } = req.body;

    if (userId && organizationName) {
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
      res.status(400).send("userId and organizationName required");
    }
  }));
});
