import { Innertube } from 'youtubei.js';

// let ytInstance: Innertube | null = null;
let ytInstance = null;

export async function getYT() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      retrieve_player: false, // faster for browse only
    });
  }
  return ytInstance;
}
