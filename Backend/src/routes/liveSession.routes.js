import express from "express";
import { getLiveSessionController, liveSessionController } from "../controller/liveSession.controller.js";
const router = express.Router();

router.post("/teacher/start-session", liveSessionController)
router.get("/student/session/:unique_id", getLiveSessionController)

export default router;