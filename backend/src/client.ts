// src/services/innertube.ts
import { Innertube } from "youtubei.js";

let yt: Innertube | null = null;

export async function getInnertube() {
  if (!yt) {
    yt = await Innertube.create({
      retrieve_player: true,
    });
  }
  return yt;
}
