import type { NextFunction, Request, Response } from "express";
import { getInnertube } from "../client";

export async function getMusicInfo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { videoId } = req.params;

    const yt = await getInnertube();
    const info = await yt.music.getInfo(videoId as string);

    const data = {
      channelId: info.basic_info.channel_id,
      title: info.basic_info.title,
      duration: info.basic_info.duration,
      thumbnail: info.basic_info.thumbnail,
      view_count: info.basic_info.view_count,
      url: info.basic_info.url_canonical,
    };

    res.json(data);
  } catch (e) {
    next(e);
  }
}
