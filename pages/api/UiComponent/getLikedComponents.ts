// pages/api/components/liked.js
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import UiComp from "../../../models/UiComp";
import { connectToDB } from "../../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    await connectToDB();
    const session = await getSession({ req });

    if (!session?.user?.id) {
      return res.status(401).end("Unauthorized");
    }

    const userId = session.user.id;
    const likedComponents = await UiComp.find({ likes: userId });

    return res.status(200).json(likedComponents);
  } catch (error) {
    console.error("Error fetching liked components:", error);
    return res.status(500).end("Internal Server Error");
  }
}
