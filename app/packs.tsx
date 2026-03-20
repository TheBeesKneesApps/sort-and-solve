import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '../components/common/Header';
import { PACK_CATEGORIES } from '../config/appConfig';
import { useUserStore } from '../stores/userStore';
import { useTheme } from '../contexts/ThemeContext';
import { categoryLightColors, categoryDarkColors, shared } from '../constants/colors';
import { usePurchaseStore } from '../stores/purchaseStore';
import { IAP_SKUS, PACK_SKU_MAP } from '../config/iapConfig';

export default function PacksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const unlockedPacks = useUserStore((s) => s.unlockedPacks);
  const completedPuzzles = useUserStore((s) => s.completedPuzzles);
  const purchaseIAP = usePurchaseStore((s) => s.purchase);
  const getPrice = usePurchaseStore((s) => s.getPrice);

  const isPackUnlocked = (packId: string) => {
    return (
      unlockedPacks.includes('all') ||
      unlockedPacks.includes(packId) ||
      packId === 'free'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Header title="Puzzle packs" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PACK_CATEGORIES.map((category, ci) => (
          <View key={category.name} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
                {category.name.toUpperCase()}
              </Text>
              {category.bundlePrice ? (
                <View
                  style={[
                    styles.bundleBadge,
                    { backgroundColor: categoryLightColors[ci % 4] },
                  ]}
                >
                  <Text
                    style={[
                      styles.bundleText,
                      { color: categoryDarkColors[ci % 4] },
                    ]}
                  >
                    Bundle {category.bundlePrice}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={[styles.packList, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              {category.packs.map((pack, pi) => {
                const unlocked = isPackUnlocked(pack.id);
                return (
                  <Pressable
                    key={pack.id}
                    style={[
                      styles.packRow,
                      pi > 0 && styles.packRowBorder,
                      pi > 0 && { borderTopColor: colors.divider },
                    ]}
                    onPress={() => {
                      if (unlocked) {
                        router.push(`/pack/${pack.id}`);
                      } else {
                        const sku = PACK_SKU_MAP[pack.id];
                        if (sku) purchaseIAP(sku);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.packIcon,
                        { backgroundColor: categoryLightColors[ci % 4] },
                      ]}
                    >
                      <Text
                        style={[
                          styles.packIconText,
                          { color: categoryDarkColors[ci % 4] },
                        ]}
                      >
                        {pack.name[0]}
                      </Text>
                    </View>
                    <View style={styles.packInfo}>
                      <Text style={[styles.packName, { color: colors.text }]}>{pack.name}</Text>
                      <Text style={[styles.packCount, { color: colors.textTertiary }]}>
                        {pack.puzzleCount} puzzles
                      </Text>
                    </View>
                    <View style={[styles.priceBtn, { backgroundColor: colors.priceBtnBg }]}>
                      <Text style={[styles.priceText, { color: colors.text }]}>
                        {unlocked ? 'Play' : (getPrice(PACK_SKU_MAP[pack.id]) || pack.price)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {unlockedPacks.includes('all') ? (
          <View style={[styles.unlockAll, { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.cardBorder }]}>
            <Text style={[styles.unlockAllTitle, { color: shared.success }]}>
              Everything unlocked
            </Text>
          </View>
        ) : (
          <Pressable
            style={[styles.unlockAll, { backgroundColor: colors.text }]}
            onPress={() => purchaseIAP(IAP_SKUS.unlockAll)}
          >
            <Text style={[styles.unlockAllTitle, { color: colors.background }]}>
              Unlock everything
            </Text>
            <Text style={[styles.unlockAllSub, { color: colors.background, opacity: 0.5 }]}>
              All packs, current & future {'\u00B7'} {getPrice(IAP_SKUS.unlockAll) || '$14.99'}
            </Text>
          </Pressable>
        )}
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
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  bundleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  bundleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  packList: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  packRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    paddingHorizontal: 14,
  },
  packRowBorder: {
    borderTopWidth: 1,
  },
  packIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  packIconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 14,
    fontWeight: '600',
  },
  packCount: {
    fontSize: 11,
  },
  priceBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  unlockAll: {
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  unlockAllTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  unlockAllSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
});
