import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/common/Header';
import { useUserStore } from '../stores/userStore';
import { useTheme } from '../contexts/ThemeContext';
import { shared } from '../constants/colors';
import { ThemeMode } from '../constants/colors';
import { reopenConsentForm } from '../utils/adInit';
import { usePurchaseStore } from '../stores/purchaseStore';
import { IAP_SKUS } from '../config/iapConfig';

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
  { label: 'System', value: 'system' },
];

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const soundEnabled = useUserStore((s) => s.soundEnabled);
  const hapticEnabled = useUserStore((s) => s.hapticEnabled);
  const notificationsEnabled = useUserStore((s) => s.notificationsEnabled);
  const hasArchivePass = useUserStore((s) => s.hasArchivePass);
  const freezesRemaining = useUserStore((s) => s.freezesRemaining);
  const toggleSound = useUserStore((s) => s.toggleSound);
  const toggleHaptic = useUserStore((s) => s.toggleHaptic);
  const toggleNotifications = useUserStore((s) => s.toggleNotifications);
  const purchase = usePurchaseStore((s) => s.purchase);
  const restore = usePurchaseStore((s) => s.restore);
  const getPrice = usePurchaseStore((s) => s.getPrice);
  const unlockAll = useUserStore((s) => s.unlockAll);
  const addHints = useUserStore((s) => s.addHints);
  const addFreezes = useUserStore((s) => s.addFreezes);
  const resetToDefault = useUserStore((s) => s.resetToDefault);

  const [devMode, setDevMode] = useState(false);
  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleVersionTap = () => {
    const now = Date.now();
    if (now - lastTap.current > 1000) tapCount.current = 0;
    lastTap.current = now;
    tapCount.current += 1;
    if (tapCount.current >= 5) {
      setDevMode(true);
      tapCount.current = 0;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Header title="Settings" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>APPEARANCE</Text>
        <View style={[styles.group, { backgroundColor: colors.settingsGroupBg, borderColor: colors.cardBorder }]}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeOptions}>
              {THEME_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setMode(opt.value)}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: mode === opt.value ? colors.text : 'transparent',
                      borderColor: colors.buttonBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: mode === opt.value ? colors.background : colors.textSecondary },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>PREFERENCES</Text>
        <View style={[styles.group, { backgroundColor: colors.settingsGroupBg, borderColor: colors.cardBorder }]}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Archive Pass</Text>
              <Text style={[styles.rowSub, { color: colors.textTertiary }]}>
                {hasArchivePass ? 'Purchased' : 'Ad-free + daily archive access'}
              </Text>
            </View>
            {hasArchivePass ? (
              <Text style={[styles.purchased, { color: shared.success }]}>Purchased</Text>
            ) : (
              <Pressable onPress={() => purchase(IAP_SKUS.archivePass)} style={[styles.priceBtn, { backgroundColor: shared.accent }]}>
                <Text style={styles.priceText}>{getPrice(IAP_SKUS.archivePass) || 'Buy'}</Text>
              </Pressable>
            )}
          </View>
          <View style={[styles.row, styles.rowBorder, { borderTopColor: colors.divider }]}>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                Streak freezes: {freezesRemaining} remaining
              </Text>
              <Text style={[styles.rowSub, { color: colors.textTertiary }]}>
                Protects your streak if you miss a day
              </Text>
            </View>
            <Pressable onPress={() => purchase(IAP_SKUS.streakFreeze3)} style={[styles.priceBtn, { backgroundColor: shared.accent }]}>
              <Text style={styles.priceText}>{getPrice(IAP_SKUS.streakFreeze3) || 'Buy'}</Text>
            </Pressable>
          </View>
          <View style={[styles.row, styles.rowBorder, { borderTopColor: colors.divider }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Sound effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: colors.divider, true: shared.success }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.row, styles.rowBorder, { borderTopColor: colors.divider }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Haptic feedback</Text>
            <Switch
              value={hapticEnabled}
              onValueChange={toggleHaptic}
              trackColor={{ false: colors.divider, true: shared.success }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.row, styles.rowBorder, { borderTopColor: colors.divider }]}>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>Daily reminder</Text>
              <Text style={[styles.rowSub, { color: colors.textTertiary }]}>9:00 AM</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.divider, true: shared.success }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ABOUT</Text>
        <View style={[styles.group, { backgroundColor: colors.settingsGroupBg, borderColor: colors.cardBorder }]}>
          {['Rate this app', 'Privacy policy', 'Restore purchases', 'Manage ad preferences', 'Contact us'].map(
            (label, i) => (
              <Pressable
                key={label}
                onPress={
                  label === 'Manage ad preferences' ? reopenConsentForm
                  : label === 'Restore purchases' ? restore
                  : undefined
                }
                style={[styles.row, i > 0 && styles.rowBorder, i > 0 && { borderTopColor: colors.divider }]}
              >
                <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
                <Text style={[styles.chevron, { color: colors.textTertiary }]}>{'\u203A'}</Text>
              </Pressable>
            )
          )}
        </View>

        {devMode && (
          <>
            <Text style={[styles.sectionTitle, { color: shared.error }]}>DEV TOOLS</Text>
            <View style={[styles.group, { backgroundColor: colors.settingsGroupBg, borderColor: shared.error }]}>
              <Pressable
                style={styles.row}
                onPress={() => { unlockAll(); addHints(99); addFreezes(3); }}
              >
                <Text style={[styles.rowLabel, { color: colors.text }]}>Unlock everything + 99 hints + 3 freezes</Text>
              </Pressable>
              <Pressable
                style={[styles.row, styles.rowBorder, { borderTopColor: colors.divider }]}
                onPress={() => addHints(10)}
              >
                <Text style={[styles.rowLabel, { color: colors.text }]}>+10 hints</Text>
              </Pressable>
              <Pressable
                style={[styles.row, styles.rowBorder, { borderTopColor: colors.divider }]}
                onPress={() => addFreezes(3)}
              >
                <Text style={[styles.rowLabel, { color: colors.text }]}>+3 freezes</Text>
              </Pressable>
              <Pressable
                style={[styles.row, styles.rowBorder, { borderTopColor: colors.divider }]}
                onPress={resetToDefault}
              >
                <Text style={[styles.rowLabel, { color: shared.error }]}>Reset to free user (wipes all data)</Text>
              </Pressable>
            </View>
          </>
        )}

        <Text
          style={[styles.versionText, { color: colors.textTertiary }]}
          onPress={handleVersionTap}
        >
          Sort & Solve v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  group: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderTopWidth: 1,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  rowSub: {
    fontSize: 11,
    marginTop: 1,
  },
  purchased: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    paddingHorizontal: 14,
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appIconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 13,
    fontWeight: '600',
  },
  appTag: {
    fontSize: 11,
  },
  getBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  getText: {
    fontSize: 11,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 16,
  },
});
