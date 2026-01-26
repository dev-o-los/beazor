import { Button } from '@/components/ui/button';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YouTube } from 'soundcord';
import { YTubeNoAPI } from 'ytube-noapi';
import { YTMusicInnertube } from '../innertube/client';

const yt = new YouTube();
const ytm = new YTMusicInnertube();
const youtube = new YTubeNoAPI();

async function example() {
  try {
    // 1. Fetch home (Explore/Home feed)
    // const home = await ytm.getPlayer();
    // const jsonString = JSON.stringify(home, null, 2);
    // console.log(jsonString);

    const player = await ytm.getPlayer('xOazTYPrt64');

    // 3. Extract best stream
    const streamInfo = ytm.extractBestAudioStream(player);

    console.log('\n=== STREAMING INFO ===');
    console.log('Title:', streamInfo.title);
    console.log('Author:', streamInfo.author);
    console.log('Best audio URL:', streamInfo.url?.substring(0, 120) + '...');
    console.log('Bitrate:', streamInfo.bitrate);
    console.log('MimeType:', streamInfo.mimeType);
    console.log(
      'Duration (approx):',
      Math.round((streamInfo.approxDurationMs || 0) / 1000 / 60),
      'minutes'
    );
    if (streamInfo.isCiphered) {
      console.warn('WARNING: URL is ciphered – needs signature deciphering');
    }
  } catch (err) {
    console.error('Demo failed:', err);
  }
}

const PlayerScreen = () => {
  const test = async () => {
    // Get video details
    // const video = await youtube.getVideo('GZqg92qFOaw');
    // console.log(JSON.stringify(video, null, 2));
    // const videoUrl = youtube.getVideoUrl('GZqg92qFOaw');
    // console.log(JSON.stringify(videoUrl, null, 2));
    // console.log(playerDetails);

    const results = await yt.search('never gonna give you up');
    const stream = await yt.getStream(results[0].id);
    console.log(stream.url);
  };

  return (
    <SafeAreaView className="mt-2 flex-1">
      {/* <ThemeToggle /> */}
      <View className="flex-1 items-center">
        <Text className="text-muted-foreground">Now Playing</Text>
        <Text className="text-xs text-foreground">Song name</Text>
        <Button onPress={test}>
          <Text>Test</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PlayerScreen;
