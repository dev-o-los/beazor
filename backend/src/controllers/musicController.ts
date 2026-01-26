import type { NextFunction, Request, Response } from "express";
import { YouTube } from "soundcord";

const yt = new YouTube();

export async function getStreamingUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { videoId } = req.params;
  // uNHXrFkua6A test v_id

  if (!videoId || typeof videoId !== "string" || videoId.length !== 11) {
    return res.status(400).json({ message: "Invalid YouTube video ID" });
  }

  try {
    const stream = await yt.getStream(videoId);

    res.json({
      ...stream,
      videoId,
    });
  } catch (e) {
    res.status(500);
    next(e);
  }
}

export async function getMusicInfo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { videoId } = req.params;

    if (!videoId || typeof videoId !== "string" || videoId.length !== 11) {
      return res.status(400).json({ message: "Invalid YouTube video ID" });
    }

    const info = await yt.search("lil tecca salty");

    // const data = {
    //   channelId: info.basic_info.channel_id,
    //   title: info.basic_info.title,
    //   duration: info.basic_info.duration,
    //   thumbnail: info.basic_info.thumbnail,
    //   view_count: info.basic_info.view_count,
    //   url: info.basic_info.url_canonical,
    // };

    res.json(info);
  } catch (e) {
    next(e);
  }
}
