import { fetchHome } from '@/innertube/home';
import { HomeResponse, HomeSection, HomeSectionType, MusicItem } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

function extractMusicItem(item: any): MusicItem | null {
  if (!item || !item.id || !item.title) return null;

  return {
    id: item.id, // videoId
    title: item.title,
    type: item.item_type ?? 'song',

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
  };
}

function detectSectionType(title: string): HomeSectionType {
  const t = title.toLowerCase();

  if (t.includes('quick')) return 'quick_picks';
  if (t.includes('album')) return 'albums_for_you';
  if (t.includes('new')) return 'new_releases';

  return 'unknown';
}

function extractSection(section: any): HomeSection | null {
  if (!section?.contents || !section?.header?.title?.text) return null;

  const title = section.header.title.text;

  const items: MusicItem[] = section.contents.map(extractMusicItem).filter(Boolean);

  if (items.length === 0) return null;

  return {
    id: `${section.type}_${title}`,
    title,
    type: detectSectionType(title),
    items,
  };
}

function normalizeHomeResponse(raw: any): HomeResponse {
  const sections: HomeSection[] = raw.sections.map(extractSection).filter(Boolean);

  return {
    sections,
  };
}

export const useHome = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['homefeed'],
    queryFn: fetchHome,
  });

  const homedata = normalizeHomeResponse(data);

  return {
    homedata,
    error,
    isPending,
  };
};
