// src/services/innertube.ts
import { ClientType, Innertube } from "youtubei.js";

let yt: Innertube | null = null;

export async function getInnertube() {
  if (!yt) {
    yt = await Innertube.create({
      client_type: ClientType.ANDROID,
      retrieve_player: false,
      lang: "en",
      user_agent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });
  }
  return yt;
}
