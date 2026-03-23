import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WordGrid } from '../../components/game/WordGrid';
import { SolvedCategory } from '../../components/game/SolvedCategory';
import { LivesIndicator } from '../../components/game/LivesIndicator';
import { GameControls } from '../../components/game/GameControls';
import { WinScreen } from '../../components/game/WinScreen';
import { LoseScreen } from '../../components/game/LoseScreen';
import { Toast } from '../../components/game/Toast';
import { Header } from '../../components/common/Header';
import { AppBannerAd } from '../../components/ads/AppBannerAd';
import { HintModal } from '../../components/ads/HintModal';
import { useGameStore } from '../../stores/gameStore';
import { useUserStore } from '../../stores/userStore';
import { getPuzzleById } from '../../utils/puzzleLoader';
import { shareResult } from '../../utils/share';
import { triggerHaptic } from '../../utils/haptics';
import { playSound } from '../../utils/sounds';
import { useTheme } from '../../contexts/ThemeContext';
import { useInterstitialAd } from '../../hooks/useInterstitialAd';
import { useRewardedAd } from '../../hooks/useRewardedAd';
import { shared } from '../../constants/colors';
import { APP_CONFIG } from '../../config/appConfig';
import { adUnitIds } from '../../config/adConfig';
import { usePurchaseStore } from '../../stores/purchaseStore';
import { IAP_SKUS } from '../../config/iapConfig';
import { Puzzle } from '../../types';

export default function GameScreen() {
  const { puzzleId, pack, isDaily, review } = useLocalSearchParams<{
    puzzleId: string;
    pack?: string;
    isDaily?: string;
    review?: string;
  }>();
  const isReview = review === 'true';
  const router = useRouter();
  const { colors } = useTheme();
  const { showInterstitialIfReady } = useInterstitialAd();
  const { showRewardedAd: showRetryAd, loaded: retryAdLoaded } = useRewardedAd(adUnitIds.retryReward);
  const { showRewardedAd: showHintAd, loaded: hintAdLoaded } = useRewardedAd(adUnitIds.hintReward);
  const puzzleRef = useRef<Puzzle | null>(null);
  const [shakingWords, setShakingWords] = useState<string[]>([]);
  const [showHintModal, setShowHintModal] = useState(false);

  const {
    allWords,
    selectedWords,
    solvedCategories,
    remainingLives,
    gameStatus,
    hintedWord,
    toastMessage,
    hintsUsed,
    startTime,
    endTime,
    puzzle,
    guessHistory,
    initGame,
    toggleWord,
    submitGuess,
    shuffleWords,
    deselectAll,
    useHint,
    clearToast,
    retryAfterAd,
  } = useGameStore();

  const hintsRemaining = useUserStore((s) => s.hintsRemaining);
  const currentStreak = useUserStore((s) => s.currentStreak);
  const completePuzzle = useUserStore((s) => s.completePuzzle);
  const failPuzzle = useUserStore((s) => s.failPuzzle);
  const useUserHint = useUserStore((s) => s.useHint);
  const addHints = useUserStore((s) => s.addHints);
  const purchaseIAP = usePurchaseStore((s) => s.purchase);
  const getPrice = usePurchaseStore((s) => s.getPrice);

  useEffect(() => {
    if (!puzzleId) return;
    const loaded = getPuzzleById(puzzleId);
    if (loaded) {
      puzzleRef.current = loaded;
      if (!isReview) {
        initGame(loaded);
      }
    } else {
      router.back();
    }
  }, [puzzleId, initGame, router, isReview]);

  useEffect(() => {
    if (gameStatus === 'won' && puzzleId) {
      triggerHaptic('success');
      playSound('win');
      const timeS = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
      completePuzzle(puzzleId, isDaily === 'true', {
        mistakes: APP_CONFIG.maxLives - remainingLives,
        timeSeconds: timeS,
        hintsUsed,
        solvedCategories: solvedCategories.length,
      });
    } else if (gameStatus === 'lost' && puzzleId) {
      triggerHaptic('error');
      const timeS = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
      failPuzzle(puzzleId, {
        mistakes: APP_CONFIG.maxLives,
        timeSeconds: timeS,
        hintsUsed,
        solvedCategories: solvedCategories.length,
      });
    }
  }, [gameStatus, puzzleId, isDaily, completePuzzle, failPuzzle, endTime, startTime, remainingLives, hintsUsed, solvedCategories.length]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(clearToast, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  const handleBack = useCallback(() => {
    if (gameStatus === 'playing' && solvedCategories.length > 0) {
      Alert.alert('Quit puzzle?', 'Your progress will be lost.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  }, [gameStatus, solvedCategories.length, router]);

  const handleSubmit = useCallback(() => {
    const wordsBeforeSubmit = [...selectedWords];
    const result = submitGuess();
    if (result.result === 'correct') {
      triggerHaptic('success');
      playSound('correct');
    } else if (result.result === 'incorrect') {
      triggerHaptic('error');
      playSound('wrong');
      setShakingWords(wordsBeforeSubmit);
      setTimeout(() => setShakingWords([]), 300);
    }
  }, [submitGuess, selectedWords]);

  const handleHint = useCallback(() => {
    if (hintsRemaining > 0) {
      const result = useHint(hintsRemaining);
      if (result) {
        triggerHaptic('light');
        useUserHint();
      }
    } else {
      setShowHintModal(true);
    }
  }, [hintsRemaining, useHint, useUserHint]);

  const handleShare = useCallback(() => {
    if (!puzzleId) return;
    shareResult({
      puzzleId,
      isDaily: isDaily === 'true',
      guessHistory,
      solvedCount: solvedCategories.length,
      maxLives: APP_CONFIG.maxLives,
      livesRemaining: remainingLives,
    });
  }, [puzzleId, isDaily, guessHistory, solvedCategories.length, remainingLives]);

  const handleNext = useCallback(() => {
    showInterstitialIfReady();
    router.back();
  }, [router, showInterstitialIfReady]);

  const handleRetry = useCallback(() => {
    showRetryAd(() => {
      retryAfterAd();
    });
  }, [retryAfterAd, showRetryAd]);

  const titleStr = isDaily === 'true'
    ? 'Daily puzzle'
    : pack === 'free'
    ? `Free #${puzzleId?.split('_')[1] ?? ''}`
    : 'Puzzle';

  const timeTaken = endTime && startTime
    ? Math.floor((endTime - startTime) / 1000)
    : 0;
  const mistakes = APP_CONFIG.maxLives - remainingLives;

  // Review mode — show all solved categories
  if (isReview && puzzleRef.current) {
    const reviewPuzzle = puzzleRef.current;
    const reviewResult = useUserStore.getState().puzzleResults[puzzleId ?? ''];
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Header title="Review" />
        <View style={styles.gameArea}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.reviewTitle, { color: colors.text }]}>
              {titleStr}
            </Text>
            {reviewResult && (
              <Text style={[styles.reviewStats, { color: colors.textSecondary }]}>
                {reviewResult.mistakes} mistake{reviewResult.mistakes !== 1 ? 's' : ''} · {Math.floor(reviewResult.timeSeconds / 60)}:{(reviewResult.timeSeconds % 60).toString().padStart(2, '0')}
              </Text>
            )}
          </View>
          <View style={styles.solvedArea}>
            {reviewPuzzle.categories.map((cat, i) => (
              <SolvedCategory key={cat.label} category={cat} index={i} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (gameStatus === 'won') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <WinScreen
          categories={solvedCategories}
          timeTaken={timeTaken}
          mistakes={mistakes}
          hintsUsed={hintsUsed}
          streak={currentStreak}
          isDaily={isDaily === 'true'}
          onShare={handleShare}
          onNext={handleNext}
        />
      </SafeAreaView>
    );
  }

  if (gameStatus === 'lost') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <LoseScreen
          allCategories={puzzle.categories ? [...puzzle.categories] : []}
          solvedCategories={solvedCategories}
          onRetry={handleRetry}
          onShare={handleShare}
          onNext={handleNext}
        />
      </SafeAreaView>
    );
  }

  const hintEmpty = hintsRemaining === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Header
        title={titleStr}
        onBack={handleBack}
        rightElement={
          <Text
            onPress={handleHint}
            style={[
              styles.hintBadge,
              {
                backgroundColor: hintEmpty ? colors.hintBadgeEmptyBg : colors.hintBadgeBg,
                color: hintEmpty ? colors.hintBadgeEmptyText : shared.accent,
              },
            ]}
          >
            {'\uD83D\uDCA1'} {hintsRemaining}
          </Text>
        }
      />

      <View style={styles.gameArea}>
        {solvedCategories.length > 0 && (
          <View style={styles.solvedArea}>
            {solvedCategories.map((cat, i) => (
              <SolvedCategory key={cat.label} category={cat} index={i} />
            ))}
          </View>
        )}

        <WordGrid
          words={allWords}
          selectedWords={selectedWords}
          hintedWord={hintedWord}
          shakingWords={shakingWords}
          onWordPress={toggleWord}
        />

        <LivesIndicator remaining={remainingLives} />

        {toastMessage && <Toast message={toastMessage} />}

        <GameControls
          selectedCount={selectedWords.length}
          onShuffle={() => {
            shuffleWords();
            triggerHaptic('light');
            playSound('shuffle');
          }}
          onDeselect={deselectAll}
          onSubmit={handleSubmit}
        />
      </View>

      <AppBannerAd unitId={adUnitIds.gameBanner} />

      {showHintModal && (
        <HintModal
          adLoaded={hintAdLoaded}
          hints10Price={getPrice(IAP_SKUS.hints10)}
          hints25Price={getPrice(IAP_SKUS.hints25)}
          onWatchAd={() => {
            showHintAd(() => {
              addHints(1);
              setShowHintModal(false);
            });
          }}
          onBuyHints10={() => {
            purchaseIAP(IAP_SKUS.hints10);
            setShowHintModal(false);
          }}
          onBuyHints25={() => {
            purchaseIAP(IAP_SKUS.hints25);
            setShowHintModal(false);
          }}
          onDismiss={() => setShowHintModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 14,
  },
  solvedArea: {
    gap: 6,
    marginBottom: 6,
  },
  reviewHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  reviewStats: {
    fontSize: 13,
  },
  hintBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
