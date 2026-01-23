// src/controllers/home.controller.ts
import type { NextFunction, Request, Response } from "express";
import { getInnertube } from "../client";

export async function getHome(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const yt = await getInnertube();
    const home = await yt.music.getHomeFeed();
    res.json(home);
  } catch (e) {
    next(e);
  }
}
