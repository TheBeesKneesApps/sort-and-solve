import { PackCategoryDefinition } from '../types';

export const APP_CONFIG = {
  appName: 'Sort & Solve',
  appSubtitle: 'Find the 4 hidden groups',
  dailyPuzzleEpoch: '2026-03-01',
  initialHints: 5,
  maxLives: 4,
  interstitialFrequency: 3,
  archiveFreeWindowDays: 7,
} as const;

export const AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
} as const;

export const IAP_PRODUCTS = {
  archivePass: 'sort_archive_pass',
  hints10: 'sort_hints_10',
  hints25: 'sort_hints_25',
  streakFreeze3: 'sort_streak_freeze_3',
  unlockAll: 'sort_unlock_everything',
} as const;

export const PACK_CATEGORIES: PackCategoryDefinition[] = [
  {
    name: 'Free',
    bundlePrice: '',
    bundleProductId: '',
    packs: [
      {
        id: 'free',
        name: 'Mixed Topics',
        puzzleCount: 30,
        price: 'Free',
        category: 'free',
        dataFile: 'free',
        productId: '',
      },
    ],
  },
  {
    name: 'General',
    bundlePrice: '',
    bundleProductId: '',
    packs: [
      { id: 'pop_culture', name: 'Pop Culture', puzzleCount: 50, price: '$1.99', category: 'general', dataFile: 'pop-culture', productId: 'sort_pack_pop_culture' },
      { id: 'science', name: 'Science & Nature', puzzleCount: 50, price: '$1.99', category: 'general', dataFile: 'science', productId: 'sort_pack_science' },
    ],
  },
  {
    name: 'Music',
    bundlePrice: '',
    bundleProductId: '',
    packs: [
      { id: 'rap', name: 'Rap & Hip Hop', puzzleCount: 50, price: '$1.99', category: 'music', dataFile: 'rap', productId: 'sort_pack_rap' },
      { id: 'rock', name: 'Rock', puzzleCount: 50, price: '$1.99', category: 'music', dataFile: 'rock', productId: 'sort_pack_rock' },
    ],
  },
  {
    name: 'Movies',
    bundlePrice: '',
    bundleProductId: '',
    packs: [
      { id: '90s_movies', name: '90s Movies', puzzleCount: 50, price: '$1.99', category: 'movies', dataFile: '90s-movies', productId: 'sort_pack_90s_movies' },
    ],
  },
  {
    name: 'Sports',
    bundlePrice: '',
    bundleProductId: '',
    packs: [
      { id: 'nfl', name: 'NFL', puzzleCount: 50, price: '$1.99', category: 'sports', dataFile: 'nfl', productId: 'sort_pack_nfl' },
    ],
  },
];
