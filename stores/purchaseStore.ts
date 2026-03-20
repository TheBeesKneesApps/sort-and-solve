import { Platform } from 'react-native';
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

const getRNIap = async (): Promise<typeof import('react-native-iap') | null> => {
  try {
    return await import('react-native-iap');
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
    const RNIap = await getRNIap();
    if (!RNIap) return;

    try {
      await RNIap.initConnection();

      const products = await RNIap.fetchProducts({ skus: ALL_PRODUCT_SKUS });
      if (products) {
        set({
          products: products.map((p) => ({
            productId: p.id,
            localizedPrice: p.displayPrice,
          })),
          initialized: true,
        });
      }

      purchaseUpdateSub = RNIap.purchaseUpdatedListener(async (purchase) => {
        grantPurchase(purchase.productId);
        await RNIap.finishTransaction({
          purchase,
          isConsumable: CONSUMABLE_SKUS.has(purchase.productId),
        });
        set({ purchasing: false });
      });

      purchaseErrorSub = RNIap.purchaseErrorListener(() => {
        set({ purchasing: false });
      });
    } catch {
      // IAP not available
    }
  },

  purchase: async (sku: string) => {
    if (get().purchasing) return;
    const RNIap = await getRNIap();
    if (!RNIap) return;
    set({ purchasing: true });
    try {
      await RNIap.requestPurchase({
        request: Platform.select({
          ios: { apple: { sku } },
          android: { google: { skus: [sku] } },
          default: { apple: { sku } },
        }),
        type: 'in-app',
      });
    } catch {
      set({ purchasing: false });
    }
  },

  restore: async () => {
    const RNIap = await getRNIap();
    if (!RNIap) return;
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (purchases) {
        purchases.forEach((p) => grantPurchase(p.productId));
      }
    } catch {
      // Restore failed silently
    }
  },

  getPrice: (sku: string) => {
    const product = get().products.find((p) => p.productId === sku);
    return product?.localizedPrice ?? '';
  },

  cleanup: () => {
    purchaseUpdateSub?.remove();
    purchaseErrorSub?.remove();
    getRNIap().then((RNIap) => RNIap?.endConnection().catch(() => {}));
  },
}));
