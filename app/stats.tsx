import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Share, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/common/Header';
import { TopStatsRow } from '../components/stats/TopStatsRow';
import { GuessDistribution } from '../components/stats/GuessDistribution';
import { TimeStats } from '../components/stats/TimeStats';
import { StreakCalendar, DayStatus } from '../components/stats/StreakCalendar';
import { useTheme } from '../contexts/ThemeContext';
import { useUserStore } from '../stores/userStore';

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

const buildStreakDays = (
  completedPuzzles: string[],
): { date: string; status: DayStatus }[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { date: string; status: DayStatus }[] = [];
  const completedSet = new Set(completedPuzzles);

  // Go back 29 days from today (30 days total including today)
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dailyId = `daily_${dateStr}`;
    const isFuture = date > today;

    let status: DayStatus = 'missed';
    if (isFuture) {
      status = 'future';
    } else if (completedSet.has(dailyId)) {
      status = 'solved';
    }

    days.push({ date: dateStr, status });
  }

  return days;
};

export default function StatsScreen() {
  const { colors } = useTheme();
  const totalPuzzlesSolved = useUserStore((s) => s.totalPuzzlesSolved);
  const totalPuzzlesFailed = useUserStore((s) => s.totalPuzzlesFailed);
  const currentStreak = useUserStore((s) => s.currentStreak);
  const longestStreak = useUserStore((s) => s.longestStreak);
  const completedPuzzles = useUserStore((s) => s.completedPuzzles);

  const totalPlayed = totalPuzzlesSolved + totalPuzzlesFailed;
  const winPercent = totalPlayed > 0 ? Math.round((totalPuzzlesSolved / totalPlayed) * 100) : 0;

  // Placeholder distribution (actual tracking would require persisted game results)
  const distribution = useMemo(() => ({
    '0': Math.round(totalPuzzlesSolved * 0.3),
    '1': Math.round(totalPuzzlesSolved * 0.35),
    '2': Math.round(totalPuzzlesSolved * 0.2),
    '3': Math.round(totalPuzzlesSolved * 0.15),
    'X': totalPuzzlesFailed,
  }), [totalPuzzlesSolved, totalPuzzlesFailed]);

  const streakDays = useMemo(() => buildStreakDays(completedPuzzles), [completedPuzzles]);

  const handleShare = async () => {
    const text = [
      'Sort & Solve Stats',
      `Played: ${totalPlayed}`,
      `Win %: ${winPercent}%`,
      `Current Streak: ${currentStreak}`,
      `Best Streak: ${longestStreak}`,
    ].join('\n');

    try {
      await Share.share(
        Platform.OS === 'ios' ? { message: text } : { message: text, title: 'Sort & Solve Stats' },
      );
    } catch {
      // User cancelled — fail silently
    }
  };

  const shareButton = (
    <Pressable onPress={handleShare} hitSlop={12}>
      <Text style={[styles.shareIcon, { color: colors.textSecondary }]}>Share</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Header title="Your Stats" rightElement={shareButton} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TopStatsRow
          played={totalPlayed}
          winPercent={winPercent}
          currentStreak={currentStreak}
          bestStreak={longestStreak}
        />
        <View style={styles.spacer} />
        <GuessDistribution distribution={distribution} />
        <View style={styles.spacer} />
        <TimeStats averageTime="--" fastestTime="--" slowestTime="--" />
        <View style={styles.spacer} />
        <StreakCalendar days={streakDays} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 18,
  },
  spacer: {
    height: 14,
  },
  bottomSpacer: {
    height: 32,
  },
  shareIcon: {
    fontSize: 13,
    fontWeight: '600',
  },
});
