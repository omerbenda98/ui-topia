import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { connectToDB } from "../../../utils/database";
import UiComp from "../../../models/UiComp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure this route is protected and only accessible via GET
  if (req.method !== "GET") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    // Connect to database
    connectToDB();

    // Get the user's session based on the request
    const session = await getSession({ req });

    if (!session || !session.user) {
      res.status(401).send("Unauthorized");
      return;
    }

    // Fetch UI Components created by the connected user from the database
    const uiComponents = await UiComp.find({
      creatorId: session.user.id as string,
    });

    // Send UI Components as JSON
    res.status(200).json(uiComponents);
  } catch (error: any) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
