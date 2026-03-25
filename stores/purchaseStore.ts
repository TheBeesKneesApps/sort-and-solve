import { Platform, Alert } from 'react-native';
import { create } from 'zustand';
import { IAP_SKUS, ALL_PRODUCT_SKUS, PACK_SKU_MAP, BUNDLE_PACKS } from '../config/iapConfig';
import { useUserStore } from './userStore';

interface Product {
  productId: string;
  localizedPrice: string;
}

interface PurchaseState {
  products: Product[];
  initialized: boolean;
  purchasing: boolean;
  init: () => Promise<void>;
  purchase: (sku: string) => Promise<void>;
  restore: () => Promise<void>;
  getPrice: (sku: string) => string;
  cleanup: () => void;
}

const CONSUMABLE_SKUS = new Set([
  IAP_SKUS.hints10,
  IAP_SKUS.hints25,
  IAP_SKUS.streakFreeze3,
]);

const grantPurchase = (productId: string) => {
  const userStore = useUserStore.getState();

  if (productId === IAP_SKUS.archivePass) {
    userStore.grantArchivePass();
  } else if (productId === IAP_SKUS.hints10) {
    userStore.addHints(10);
  } else if (productId === IAP_SKUS.hints25) {
    userStore.addHints(25);
  } else if (productId === IAP_SKUS.streakFreeze3) {
    userStore.addFreezes(3);
  } else if (productId === IAP_SKUS.unlockAll) {
    userStore.unlockAll();
  } else {
    const bundlePacks = BUNDLE_PACKS[productId];
    if (bundlePacks) {
      bundlePacks.forEach((packId) => userStore.unlockPack(packId));
    } else {
      const packId = Object.entries(PACK_SKU_MAP).find(
        ([, sku]) => sku === productId
      )?.[0];
      if (packId) {
        userStore.unlockPack(packId);
      }
    }
  }
};

let purchaseUpdateSub: { remove: () => void } | null = null;
let purchaseErrorSub: { remove: () => void } | null = null;

const getIap = async (): Promise<typeof import('expo-iap') | null> => {
  try {
    return await import('expo-iap');
  } catch {
    return null;
  }
};

export const usePurchaseStore = create<PurchaseState>((set, get) => ({
  products: [],
  initialized: false,
  purchasing: false,

  init: async () => {
    if (get().initialized) return;
    const Iap = await getIap();
    if (!Iap) return;

    try {
      await Iap.initConnection();

      const products = await Iap.fetchProducts({ skus: ALL_PRODUCT_SKUS });
      if (products) {
        set({
          products: products.map((p) => ({
            productId: p.id,
            localizedPrice: p.displayPrice,
          })),
          initialized: true,
        });
      }

      // Process any pending transactions from previous sessions
      try {
        const pending = await Iap.getAvailablePurchases();
        if (pending) {
          for (const purchase of pending) {
            if (!CONSUMABLE_SKUS.has(purchase.productId)) {
              grantPurchase(purchase.productId);
            }
            await Iap.finishTransaction({
              purchase,
              isConsumable: CONSUMABLE_SKUS.has(purchase.productId),
            }).catch(() => {});
          }
        }
      } catch {
        // Pending transaction check failed
      }

      purchaseUpdateSub = Iap.purchaseUpdatedListener((purchase) => {
        const state = (purchase as { transactionStateIOS?: number }).transactionStateIOS;
        if (state === 0) {
          Alert.alert(
            'Purchase pending',
            'Your purchase is waiting for approval. You\'ll receive your items once approved.'
          );
          set({ purchasing: false });
          return;
        }

        grantPurchase(purchase.productId);

        Iap.finishTransaction({
          purchase,
          isConsumable: CONSUMABLE_SKUS.has(purchase.productId),
        }).catch((err) => {
          console.warn('Failed to finish transaction:', err);
        });

        set({ purchasing: false });
      });

      purchaseErrorSub = Iap.purchaseErrorListener((error) => {
        set({ purchasing: false });
        if (error.code === 'user-cancelled') return;
        Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
      });
    } catch {
      // IAP not available
    }
  },

  purchase: async (sku: string) => {
    if (get().purchasing) return;
    const Iap = await getIap();
    if (!Iap) return;

    if (!get().initialized) {
      Alert.alert('Store not ready', 'Please try again in a moment.');
      return;
    }

    set({ purchasing: true });
    try {
      await Iap.requestPurchase({
        request: Platform.select({
          ios: { apple: { sku } },
          android: { google: { skus: [sku] } },
          default: { apple: { sku } },
        }),
        type: 'in-app',
      });
    } catch {
      set({ purchasing: false });
      Alert.alert('Purchase failed', 'Something went wrong. Please try again.');
    }
  },

  restore: async () => {
    const Iap = await getIap();
    if (!Iap) return;
    try {
      await Iap.restorePurchases();
      const purchases = await Iap.getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        let restoredCount = 0;
        for (const p of purchases) {
          if (!CONSUMABLE_SKUS.has(p.productId)) {
            grantPurchase(p.productId);
            restoredCount++;
          }
        }
        Alert.alert(
          'Purchases restored',
          restoredCount > 0
            ? `${restoredCount} purchase${restoredCount !== 1 ? 's' : ''} restored successfully.`
            : 'No purchases to restore.'
        );
      } else {
        Alert.alert('No purchases found', 'There are no purchases to restore for this account.');
      }
    } catch {
      Alert.alert('Restore failed', 'Could not restore purchases. Please check your internet connection and try again.');
    }
  },

  getPrice: (sku: string) => {
    const product = get().products.find((p) => p.productId === sku);
    return product?.localizedPrice ?? '';
  },

  cleanup: () => {
    purchaseUpdateSub?.remove();
    purchaseErrorSub?.remove();
    getIap().then((Iap) => Iap?.endConnection().catch(() => {}));
  },
}));
