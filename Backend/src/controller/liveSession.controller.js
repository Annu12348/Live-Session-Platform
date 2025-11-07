import { v4 as uuidv4 } from "uuid";
import liveSessionModel from "../models/liveSession.models.js";

export const liveSessionController = async (req, res) => {
  try {
    const { type } = req.body;
    const unique_id = uuidv4();
    const userurl = `https://live-session-platforms.onrender.com/session/${unique_id}`;

    if (!type) {
        return res.status(400).json({
            message: "Type is required."
        });
    }
    if (!unique_id) {
        return res.status(500).json({
            message: "Failed to generate unique session ID."
        });
    }
    if (!userurl) {
        return res.status(500).json({
            message: "Failed to generate user URL."
        });
    }

    const newSession = await liveSessionModel.create({
      type,
      unique_id,
      userurl,
    });

    if (!newSession) {
        return res.status(500).json({
            message: "Failed to create live session."
        });
    }

    res.status(201).json({
      success: true,
      message: "Live session started successfully!",
      data: newSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "An unexpected error occurred while starting the live session. Please try again later.",
    });
  }
};

export const getLiveSessionController = async (req, res) => {
  try {
    const { unique_id } = req.params;
    if (!unique_id) {
        return res.status(400).json({
            message: "Unique ID is required."
        });
    }

    const sessions = await liveSessionModel.findOne({unique_id})
    if (!sessions) {
        return res.status(404).json({
            message: "Session not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Live session fetched successfully.",
        data: sessions
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "An unexpected error occurred while starting the live session. Please try again later.",
    });
  }
};
