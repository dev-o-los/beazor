import type { NextFunction, Request, Response } from "express";
import path from "path";
// import { YtDlp } from "ytdlp-nodejs";
import { getInnertube } from "../client";

const binaryPath = path.join(
  process.cwd(),
  process.env.NODE_ENV === "development" ? "yt-dlp.exe" : "yt-dlp",
);

// const ytDlp = new YtDlp({
//   binaryPath: binaryPath,
// });

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
    const proc = Bun.spawn([
      binaryPath,
      "--js-runtimes",
      "bun",
      "-f",
      "bestaudio",
      "-g",
      url,
    ]);

    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();

    if (stderr) {
      console.error(stderr);
      return res.status(500).json({ message: stderr });
    }

    return res.json({ url: stdout.trim() });
  } catch (e) {
    res.status(500);
    next(e);
  }

  // try {
  //   const file = await ytDlp.getInfoAsync(url);

  //   // console.log(file);

  //   return res.json(file);
  // } catch (err: any) {
  //   res.status(500);
  //   next(err);
  // }
}

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
