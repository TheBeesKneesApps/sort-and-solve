import { useEffect, useRef, useCallback } from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useUserStore } from '../stores/userStore';
import { adUnitIds, AD_FREQUENCY } from '../config/adConfig';

export const useInterstitialAd = () => {
  const hasArchivePass = useUserStore((s) => s.hasArchivePass);
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const puzzlesSinceLastAd = useRef(0);
  const adLoaded = useRef(false);

  useEffect(() => {
    if (hasArchivePass) return;

    const ad = InterstitialAd.createForAdRequest(adUnitIds.betweenPuzzles);

    const loadUnsub = ad.addAdEventListener(AdEventType.LOADED, () => {
      adLoaded.current = true;
    });

    const closeUnsub = ad.addAdEventListener(AdEventType.CLOSED, () => {
      adLoaded.current = false;
      ad.load();
    });

    const errorUnsub = ad.addAdEventListener(AdEventType.ERROR, () => {
      adLoaded.current = false;
    });

    ad.load();
    interstitialRef.current = ad;

    return () => {
      loadUnsub();
      closeUnsub();
      errorUnsub();
    };
  }, [hasArchivePass]);

  const showInterstitialIfReady = useCallback(() => {
    if (hasArchivePass) return;

    puzzlesSinceLastAd.current += 1;

    if (
      puzzlesSinceLastAd.current >= AD_FREQUENCY.puzzlesBetweenInterstitials &&
      adLoaded.current
    ) {
      interstitialRef.current?.show();
      puzzlesSinceLastAd.current = 0;
    }
  }, [hasArchivePass]);

  return { showInterstitialIfReady };
};
