import { Button } from '@/components/ui/button';
import { useAudioPlayer } from 'expo-audio';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PlayerScreen = () => {
  const player = useAudioPlayer(
    'https://rr2---sn-u5jitvojvhpo-a3vs.googlevideo.com/videoplayback?expire=1769251780&ei=ZE90aaveHMit9fwP2-O-aQ&ip=103.157.195.127&id=o-AMlSkHAjcGZNyc9J2h7hhtS3EQ2hb0goW8O4W8FTfO37&itag=139&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&cps=0&met=1769230180%2C&mh=Xi&mm=31%2C29&mn=sn-u5jitvojvhpo-a3vs%2Csn-qxaelned&ms=au%2Crdu&mv=m&mvi=2&pl=24&rms=au%2Cau&gcr=in&initcwndbps=1576250&bui=AW-iu_oT0lddd2fyaCEvOBqpDv-YjvEEXR9pcngsTqG8a0UaTE-2pqLL-Ty-SOI6hpt0aVlFFR6bIQ7e&spc=q5xjPI8Q2qq8&vprv=1&svpuc=1&mime=audio%2Fmp4&rqh=1&gir=yes&clen=826485&dur=135.325&lmt=1730764730612281&mt=1769229880&fvip=1&keepalive=yes&fexp=51552689%2C51565115%2C51565681%2C51580968&c=ANDROID&txp=5532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJEij0EwRAIgcVz0lCRlENqNRFQM3hab011MhMQMSS58P-i4DsKlEy8CICcJ2iu5qHvn8YvN86yK9ZKCK-WqHe9TOrFmgPO0le__&lsparams=cps%2Cmet%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crms%2Cinitcwndbps&lsig=APaTxxMwRgIhAOrmqn-v9mGWK7BCkt61tm-DxFnPBksOWUd_RzfK3X76AiEArlShhjr1Z5iBv1h3VoJR0DsaVuM3ilAOIh9t7t3byc4%3D',
    {
      updateInterval: 1000,
      // downloadFirst: true,
    }
  );

  return (
    <SafeAreaView className="mt-2 flex-1">
      {/* <ThemeToggle /> */}
      <View className="flex-1 items-center">
        <Text className="text-muted-foreground">Now Playing</Text>
        <Text className="text-xs text-foreground">Song name</Text>
        <Button onPress={() => player.play()}>
          <Text>Test</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PlayerScreen;
