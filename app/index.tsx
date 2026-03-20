import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyPuzzleCard } from '../components/home/DailyPuzzleCard';
import { FreePuzzlesCard } from '../components/home/FreePuzzlesCard';
import { PacksCard } from '../components/home/PacksCard';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';
import { NotificationPrompt } from '../components/common/NotificationPrompt';
import { Logo } from '../components/common/Logo';
import { AppBannerAd } from '../components/ads/AppBannerAd';
import { useUserStore } from '../stores/userStore';
import { useTheme } from '../contexts/ThemeContext';
import { getPackProgress } from '../utils/puzzleLoader';
import { getDailyPuzzle } from '../utils/dailyPuzzle';
import { adUnitIds } from '../config/adConfig';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const completedPuzzles = useUserStore((s) => s.completedPuzzles);
  const currentStreak = useUserStore((s) => s.currentStreak);
  const longestStreak = useUserStore((s) => s.longestStreak);
  const totalPuzzlesSolved = useUserStore((s) => s.totalPuzzlesSolved);
  const freezesRemaining = useUserStore((s) => s.freezesRemaining);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const checkAndApplyFreeze = useUserStore((s) => s.checkAndApplyFreeze);

  // Check for streak freeze on home screen load
  React.useEffect(() => {
    if (isHydrated) {
      checkAndApplyFreeze();
    }
  }, [isHydrated, checkAndApplyFreeze]);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);
  const notificationsEnabled = useUserStore((s) => s.notificationsEnabled);
  const notificationPromptShown = useUserStore((s) => s.notificationPromptShown);
  const setNotificationPromptShown = useUserStore((s) => s.setNotificationPromptShown);
  const toggleNotifications = useUserStore((s) => s.toggleNotifications);

  const showNotificationPrompt =
    onboardingComplete &&
    !notificationPromptShown &&
    !notificationsEnabled &&
    totalPuzzlesSolved >= 3;

  if (!isHydrated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loading}>
          <Text style={[styles.loadingText, { color: colors.textTertiary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const freeProgress = getPackProgress('free', completedPuzzles);
  const dailyPuzzle = getDailyPuzzle();
  const isDailyCompleted = dailyPuzzle
    ? completedPuzzles.includes(dailyPuzzle.id)
    : false;

  const handleDailyPress = () => {
    if (dailyPuzzle) {
      router.push(`/game/${dailyPuzzle.id}?pack=daily&isDaily=true`);
    }
  };

  const handleFreePress = () => {
    router.push('/pack/free');
  };

  const handlePacksPress = () => {
    router.push('/packs');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {!onboardingComplete && (
        <OnboardingModal onDismiss={setOnboardingComplete} />
      )}
      {showNotificationPrompt && (
        <NotificationPrompt
          onAccept={() => {
            toggleNotifications();
            setNotificationPromptShown();
          }}
          onDismiss={setNotificationPromptShown}
        />
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Logo size={28} />
          <Text style={[styles.title, { color: colors.text }]}>Sort & Solve</Text>
          <Text style={[styles.label, { color: colors.textTertiary }]}>WORD PUZZLE</Text>
        </View>

        <DailyPuzzleCard
          isCompleted={isDailyCompleted}
          onPress={handleDailyPress}
        />

        <Pressable
          style={[styles.archiveCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => router.push('/archive')}
        >
          <View style={styles.archiveRow}>
            <View>
              <Text style={[styles.archiveTitle, { color: colors.text }]}>Daily archive</Text>
              <Text style={[styles.archiveSub, { color: colors.textSecondary }]}>
                Browse past daily puzzles
              </Text>
            </View>
            <Text style={[styles.arrow, { color: colors.textTertiary }]}>{'\u203A'}</Text>
          </View>
        </Pressable>

        <FreePuzzlesCard
          completed={freeProgress.completed}
          total={freeProgress.total}
          onPress={handleFreePress}
        />
        <PacksCard onPress={handlePacksPress} showNewBadge />

        <View style={styles.spacer} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              {'\uD83D\uDD25'} streak
              {freezesRemaining > 0 ? ` | \u2744\uFE0F ${freezesRemaining}` : ''}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{totalPuzzlesSolved}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>solved</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{longestStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
              {'\uD83C\uDFC6'} best
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            style={[styles.footerLink, { color: colors.textSecondary }]}
            onPress={() => router.push('/settings')}
          >
            Settings
          </Text>
          <Text
            style={[styles.footerLink, { color: colors.textSecondary }]}
            onPress={() => router.push('/stats')}
          >
            Stats
          </Text>
        </View>
      </ScrollView>
      <AppBannerAd unitId={adUnitIds.homeBanner} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingTop: 12,
  },
  titleSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  archiveCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  archiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  archiveTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  archiveSub: {
    fontSize: 12,
    marginTop: 3,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '500',
  },
});
