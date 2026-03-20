import { useEffect, useRef, useState, useCallback } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';

export const useRewardedAd = (unitId: string) => {
  const rewardedRef = useRef<RewardedAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const onRewardRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(unitId);

    const loadUnsub = ad.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      setLoading(false);
    });

    const earnUnsub = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        onRewardRef.current?.();
      }
    );

    const closeUnsub = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      ad.load();
      setLoading(true);
    });

    const errorUnsub = ad.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false);
      setLoading(false);
    });

    ad.load();
    setLoading(true);
    rewardedRef.current = ad;

    return () => {
      loadUnsub();
      earnUnsub();
      closeUnsub();
      errorUnsub();
    };
  }, [unitId]);

  const showRewardedAd = useCallback(
    (onReward: () => void): boolean => {
      if (!loaded || !rewardedRef.current) return false;
      onRewardRef.current = onReward;
      rewardedRef.current.show();
      return true;
    },
    [loaded]
  );

  return { showRewardedAd, loaded, loading };
};
