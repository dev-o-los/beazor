import type { NextFunction, Request, Response } from "express";
import { YtDlp } from "ytdlp-nodejs";
import { getInnertube } from "../client";

const ytDlp = new YtDlp({
  binaryPath: "C:/Users/utk27/Documents/beazor/backend/src/yt-dlp.exe",
});

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

    res.json(info);
  } catch (e) {
    next(e);
  }
}

export async function getStreamingUrl(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { videoId } = req.params;
  // uNHXrFkua6A test v_id

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  if (!videoId || typeof videoId !== "string" || videoId.length !== 11) {
    return res.status(400).json({ message: "Invalid YouTube video ID" });
  }

  try {
    const file = await ytDlp.getInfoAsync(url);

    // console.log(file);

    return res.json(file);
  } catch (err: any) {
    res.status(500);
    next(err);
  }
}
