import { Platform } from 'react-native';

const IS_DEV = __DEV__;

// Test ad unit IDs from Google (safe to use in development)
const TEST_BANNER = 'ca-app-pub-3940256099942544/9214589741';
const TEST_INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712';
const TEST_REWARDED = 'ca-app-pub-3940256099942544/5224354917';

export const adUnitIds = {
  homeBanner: IS_DEV
    ? TEST_BANNER
    : Platform.select({
        ios: 'ca-app-pub-5681113031004469/8084664955',
        android: TEST_BANNER,
        default: TEST_BANNER,
      })!,
  gameBanner: IS_DEV
    ? TEST_BANNER
    : Platform.select({
        ios: 'ca-app-pub-5681113031004469/1435496123',
        android: TEST_BANNER,
        default: TEST_BANNER,
      })!,
  betweenPuzzles: IS_DEV
    ? TEST_INTERSTITIAL
    : Platform.select({
        ios: 'ca-app-pub-5681113031004469/9122414450',
        android: TEST_INTERSTITIAL,
        default: TEST_INTERSTITIAL,
      })!,
  retryReward: IS_DEV
    ? TEST_REWARDED
    : Platform.select({
        ios: 'ca-app-pub-5681113031004469/2373173273',
        android: TEST_REWARDED,
        default: TEST_REWARDED,
      })!,
  hintReward: IS_DEV
    ? TEST_REWARDED
    : Platform.select({
        ios: 'ca-app-pub-5681113031004469/7809332782',
        android: TEST_REWARDED,
        default: TEST_REWARDED,
      })!,
  archiveReward: IS_DEV
    ? TEST_REWARDED
    : Platform.select({
        ios: 'ca-app-pub-5681113031004469/5391753704',
        android: TEST_REWARDED,
        default: TEST_REWARDED,
      })!,
  freezeReward: IS_DEV
    ? TEST_REWARDED
    : Platform.select({
        ios: 'ca-app-pub-5681113031004469/4298430787',
        android: TEST_REWARDED,
        default: TEST_REWARDED,
      })!,
} as const;

export const AD_FREQUENCY = {
  puzzlesBetweenInterstitials: 3,
} as const;
