import { Router } from "express";
import { getMusicInfo, getStreamingUrl } from "../controllers/musicController";

const router = Router();

router.get("/music/:videoId", getMusicInfo);
router.get("/music/stream/:videoId", getStreamingUrl);

export default router;
