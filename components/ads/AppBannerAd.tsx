import React, { useRef } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  useForeground,
} from 'react-native-google-mobile-ads';
import { useUserStore } from '../../stores/userStore';

interface AppBannerAdProps {
  unitId: string;
}

export const AppBannerAd: React.FC<AppBannerAdProps> = ({ unitId }) => {
  const hasArchivePass = useUserStore((s) => s.hasArchivePass);
  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load();
    }
  });

  if (hasArchivePass) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        ref={bannerRef}
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdFailedToLoad={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 16,
  },
});
