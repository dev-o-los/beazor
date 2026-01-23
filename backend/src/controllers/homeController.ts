import type { NextFunction, Request, Response } from "express";
import { getInnertube } from "../client";
import type {
  HomeResponse,
  HomeSection,
  HomeSectionType,
  MusicItem,
} from "../utils/types.js";

function extractMusicItem(item: any): MusicItem | null {
  if (!item || !item.id || !item.title) return null;

  return {
    id: item.id, // videoId
    title: item.title,
    type: item.item_type ?? "song",
    duration: null,
    channelId: null,

    artists: item.artists?.map((artist: any) => ({
      id: artist.channel_id,
      name: artist.name,
    })),

    album: item.album
      ? {
          id: item.album.id,
          name: item.album.name,
        }
      : undefined,

    thumbnails:
      item.thumbnail?.contents?.map((t: any) => ({
        url: t.url,
        width: t.width,
        height: t.height,
      })) ?? [],

    runs: item.flex_columns?.[1]?.title.text ?? "",
  };
}

function detectSectionType(title: string): HomeSectionType {
  const t = title.toLowerCase();

  if (t.includes("quick")) return "quick_picks";
  if (t.includes("album")) return "albums_for_you";
  if (t.includes("new")) return "new_releases";

  return "unknown";
}

function extractSection(section: any): HomeSection | null {
  if (!section?.contents || !section?.header?.title?.text) return null;

  const title = section.header.title.text;

  const items: MusicItem[] = section.contents
    .map(extractMusicItem)
    .filter(Boolean);

  if (items.length === 0) return null;

  return {
    id: `${section.type}_${title}`,
    title,
    type: detectSectionType(title),
    items,
  };
}

export function normalizeHomeResponse(raw: any): HomeResponse {
  const sections: HomeSection[] = raw.sections
    .map(extractSection)
    .filter(Boolean);

  return {
    sections,
  };
}

export async function getHome(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const yt = await getInnertube();
    const home = await yt.music.getHomeFeed();

    const normalizeHomeData = normalizeHomeResponse(home);
    res.json(normalizeHomeData);
  } catch (e) {
    next(e);
  }
}
