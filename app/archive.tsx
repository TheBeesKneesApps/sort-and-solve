import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  getDaysInMonth,
  isSameDay,
  isBefore,
  isAfter,
  startOfDay,
  parseISO,
} from 'date-fns';
import { Header } from '../components/common/Header';
import { MonthNavigator } from '../components/archive/MonthNavigator';
import { CalendarGrid, DayCellState } from '../components/archive/CalendarGrid';
import { useTheme } from '../contexts/ThemeContext';
import { useUserStore } from '../stores/userStore';
import { usePurchaseStore } from '../stores/purchaseStore';
import { IAP_SKUS } from '../config/iapConfig';
import { shared } from '../constants/colors';
import { APP_CONFIG } from '../config/appConfig';
import { getDailyPuzzleForDate } from '../utils/dailyPuzzle';

const ARCHIVE_PASS_FALLBACK = 'Buy';

export default function ArchiveScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const completedPuzzles = useUserStore((s) => s.completedPuzzles);
  const hasArchivePass = useUserStore((s) => s.hasArchivePass);
  const purchaseIAP = usePurchaseStore((s) => s.purchase);
  const getPrice = usePurchaseStore((s) => s.getPrice);

  const today = useMemo(() => startOfDay(new Date()), []);
  const epoch = useMemo(() => startOfDay(parseISO(APP_CONFIG.dailyPuzzleEpoch)), []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const completedSet = useMemo(() => new Set(completedPuzzles), [completedPuzzles]);

  const canGoNext = useMemo(() => {
    const nextMonth = new Date(viewYear, viewMonth + 1, 1);
    return !isAfter(startOfDay(nextMonth), startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)));
  }, [viewYear, viewMonth, today]);

  const handlePrevious = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const handleNext = useCallback(() => {
    if (!canGoNext) return;
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewMonth, canGoNext]);

  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(new Date(viewYear, viewMonth));
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = startOfDay(new Date(viewYear, viewMonth, day));
      const isToday = isSameDay(date, today);
      const isFutureDay = isAfter(date, today);
      const isBeforeEpoch = isBefore(date, epoch);

      // Look up the actual puzzle for this date
      const puzzle = (!isFutureDay && !isBeforeEpoch) ? getDailyPuzzleForDate(date) : null;
      const puzzleId = puzzle?.id ?? null;
      const isSolved = puzzleId ? completedSet.has(puzzleId) : false;

      let state: DayCellState;
      if (isFutureDay || isBeforeEpoch || !puzzleId) {
        state = 'future';
      } else if (isSolved) {
        state = 'solved';
      } else if (isToday) {
        state = 'today';
      } else if (hasArchivePass) {
        state = 'missed_free';
      } else {
        state = 'missed_locked';
      }

      return { day, state, puzzleId };
    });
  }, [viewYear, viewMonth, completedSet, today, epoch, hasArchivePass]);

  const handleDayPress = useCallback((puzzleId: string) => {
    router.push(`/game/${puzzleId}?pack=daily&isDaily=true`);
  }, [router]);

  const handleArchivePassPress = () => {
    purchaseIAP(IAP_SKUS.archivePass);
  };

  const archivePassButton = hasArchivePass ? (
    <Text style={[styles.passCheck, { color: shared.success }]}>{'\u2713'}</Text>
  ) : (
    <Pressable
      onPress={handleArchivePassPress}
      style={[styles.passButton, { backgroundColor: shared.accent }]}
      hitSlop={8}
    >
      <Text style={styles.passButtonText}>
        Archive Pass {getPrice(IAP_SKUS.archivePass) || ARCHIVE_PASS_FALLBACK}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Header title="Daily Archive" rightElement={archivePassButton} />
      <MonthNavigator
        year={viewYear}
        month={viewMonth}
        canGoNext={canGoNext}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      <CalendarGrid
        year={viewYear}
        month={viewMonth}
        days={days}
        onDayPress={handleDayPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  passButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  passButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  passCheck: {
    fontSize: 18,
    fontWeight: '700',
    width: 28,
    textAlign: 'center',
  },
});
