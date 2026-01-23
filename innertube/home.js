import { getYT } from './client.js';

export async function fetchHome() {
  const yt = await getYT();
  const home = await yt.music.getHomeFeed();

  return home;
}
