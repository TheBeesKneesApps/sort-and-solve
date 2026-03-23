import { Platform } from 'react-native';
import mobileAds, {
  AdsConsent,
  AdsConsentStatus,
} from 'react-native-google-mobile-ads';

export const initializeAds = async (): Promise<void> => {
  try {
    if (Platform.OS === 'ios') {
      try {
        const { requestTrackingPermissionsAsync } = require('expo-tracking-transparency');
        await requestTrackingPermissionsAsync();
      } catch {
        // expo-tracking-transparency not available
      }
    }

    const consentInfo = await AdsConsent.requestInfoUpdate();
    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdsConsentStatus.REQUIRED
    ) {
      await AdsConsent.showForm();
    }

    await mobileAds().initialize();
  } catch {
    // Ads initialization failed — continue without ads
  }
};

export const reopenConsentForm = async (): Promise<void> => {
  try {
    await AdsConsent.showForm();
  } catch {
    // Consent form not available
  }
};
