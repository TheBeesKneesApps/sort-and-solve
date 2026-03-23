import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { useUserStore } from '../stores/userStore';
import { usePurchaseStore } from '../stores/purchaseStore';
import { initializeAds } from '../utils/adInit';
import { preloadSounds } from '../utils/sounds';

const InnerLayout = () => {
  const hydrate = useUserStore((s) => s.hydrate);
  const initPurchases = usePurchaseStore((s) => s.init);
  const cleanupPurchases = usePurchaseStore((s) => s.cleanup);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    hydrate();
    initializeAds();
    initPurchases();
    preloadSounds();
    return () => cleanupPurchases();
  }, [hydrate, initPurchases, cleanupPurchases]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}
