import { Router } from "express";
import { getMusicInfo } from "../controllers/musicController";

const router = Router();

router.get("/music/:videoId", getMusicInfo);

export default router;
