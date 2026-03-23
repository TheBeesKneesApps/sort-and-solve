import { Audio } from 'expo-av';
import { useUserStore } from '../stores/userStore';

type SoundName = 'tap' | 'correct' | 'wrong' | 'win' | 'shuffle';

const soundFiles: Record<SoundName, ReturnType<typeof require>> = {
  tap: require('../assets/sounds/tap.wav'),
  correct: require('../assets/sounds/correct.wav'),
  wrong: require('../assets/sounds/wrong.wav'),
  win: require('../assets/sounds/win.wav'),
  shuffle: require('../assets/sounds/shuffle.wav'),
};

const loadedSounds: Partial<Record<SoundName, Audio.Sound>> = {};

const VOLUME: Record<SoundName, number> = {
  tap: 0.5,
  correct: 0.6,
  wrong: 0.55,
  win: 0.7,
  shuffle: 0.5,
};

export const preloadSounds = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
    });

    const names = Object.keys(soundFiles) as SoundName[];
    await Promise.all(
      names.map(async (name) => {
        const { sound } = await Audio.Sound.createAsync(soundFiles[name], {
          volume: VOLUME[name],
        });
        loadedSounds[name] = sound;
      })
    );
  } catch {
    // Sound loading failed — continue without sounds
  }
};

export const playSound = async (name: SoundName): Promise<void> => {
  const enabled = useUserStore.getState().soundEnabled;
  if (!enabled) return;

  const sound = loadedSounds[name];
  if (!sound) return;

  try {
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    // Playback failed — fail silently
  }
};
