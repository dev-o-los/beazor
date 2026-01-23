export type HomeResponse = {
  sections: HomeSection[];
};

export type HomeSectionType =
  | "quick_picks"
  | "albums_for_you"
  | "new_releases"
  | "recommended"
  | "unknown";

export type HomeSection = {
  id: string;
  title: string;
  type: HomeSectionType;
  items: MusicItem[];
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type Artist = {
  id: string;
  name: string;
};

export type Album = {
  id: string;
  name: string;
};

export type MusicItem = {
  id: string;
  title: string;
  type: "song" | "album" | "playlist";
  artists?: Artist[];
  album?: Album;
  thumbnails: Thumbnail[];
  runs: string;
};
