import { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Types } from "mongoose";
import UiComp from "../../../models/UiComp";
import { connectToDB } from "../../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDB();

    // Destructuring `_id` and `userid` from the request body
    const { _id, userid } = req.body;

    // Validate the _id and userid are provided
    if (!_id || !userid) {
      return res
        .status(400)
        .json({ error: "Component ID and User ID are required" });
    }

    // Convert userid from string to MongoDB ObjectId if it's a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    const userId = new mongoose.Types.ObjectId(userid);

    const uiComponent = await UiComp.findById(_id);
    if (!uiComponent) {
      return res.status(404).json({ error: "Component not found" });
    }

    // Check if the user has already liked the component
    const isLiked = uiComponent.likes.some((like: Types.ObjectId) =>
      like.equals(userId)
    );

    if (isLiked) {
      // User has already liked, so we remove the like
      uiComponent.likes.pull(userId);
    } else {
      // User has not liked yet, so we add a new like
      uiComponent.likes.addToSet(userId);
    }

    const updatedComponent = await uiComponent.save();
    return res.status(200).json(updatedComponent.likes);
  } catch (error) {
    console.error("Error in like handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
