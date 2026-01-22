import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PlayerScreen = () => {
  return (
    <SafeAreaView className="mt-2 flex-1 items-center">
      {/* <ThemeToggle /> */}
      <View className="flex-1 items-center">
        <Text className="text-muted-foreground">Now Playing</Text>
        <Text className="text-xs text-foreground">Song name</Text>
      </View>
    </SafeAreaView>
  );
};

export default PlayerScreen;
