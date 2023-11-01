// pages/api/saveComponent.ts

import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import UiComp from "@models/UiComp";
import { connectToDB } from "@utils/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDB(); // Assuming you have a utility function to connect to MongoDB

  if (req.method === "POST") {
    const { html, css, type, creatorId } = req.body;

    try {
      const newComp = await UiComp.create({ html, css, type, creatorId });
      res.status(201).json(newComp);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" }); // Handle methods other than POST
  }
};
