// pages/api/uiComponent/getAllComponents.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDB } from "@utils/database"; // Adjust the import according to your project structure
import UiComponent from "@models/UiComp"; // Adjust the import according to your project structure

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).send({ error: "Method Not Allowed" });
  }

  try {
    await connectToDB();
    const components = await UiComponent.find();
    res.status(200).json(components);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
