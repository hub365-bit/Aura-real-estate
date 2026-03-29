import { Platform } from 'react-native';

export type AdType = 'banner' | 'interstitial' | 'rewarded';
export type AdPlacement = 
  | 'home_feed' 
  | 'property_details' 
  | 'search_results' 
  | 'booking_confirmation'
  | 'post_listing';

export interface AdConfig {
  enabled: boolean;
  testMode: boolean;
  bannerId?: string;
  interstitialId?: string;
  rewardedId?: string;
}

const adConfig: AdConfig = {
  enabled: true,
  testMode: true,
  bannerId: Platform.select({
    ios: 'ca-app-pub-xxxxx/xxxxx',
    android: 'ca-app-pub-xxxxx/xxxxx',
    default: undefined,
  }),
  interstitialId: Platform.select({
    ios: 'ca-app-pub-xxxxx/xxxxx',
    android: 'ca-app-pub-xxxxx/xxxxx',
    default: undefined,
  }),
  rewardedId: Platform.select({
    ios: 'ca-app-pub-xxxxx/xxxxx',
    android: 'ca-app-pub-xxxxx/xxxxx',
    default: undefined,
  }),
};

export function isAdsEnabled(): boolean {
  return adConfig.enabled && Platform.OS !== 'web';
}

export function shouldShowAd(placement: AdPlacement, userTier?: string): boolean {
  if (!isAdsEnabled()) {
    return false;
  }

  if (userTier === 'premium' || userTier === 'yearly' || userTier === 'monthly') {
    return false;
  }

  switch (placement) {
    case 'home_feed':
      return true;
    case 'property_details':
      return true;
    case 'search_results':
      return true;
    case 'booking_confirmation':
      return false;
    case 'post_listing':
      return false;
    default:
      return false;
  }
}

export async function loadAd(type: AdType): Promise<boolean> {
  console.log(`Loading ${type} ad...`);
  
  if (!isAdsEnabled()) {
    console.log('Ads are disabled');
    return false;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  console.log(`${type} ad loaded successfully`);
  return true;
}

export async function showAd(type: AdType): Promise<{ shown: boolean; rewarded?: boolean }> {
  console.log(`Showing ${type} ad...`);
  
  if (!isAdsEnabled()) {
    console.log('Ads are disabled');
    return { shown: false };
  }

  const loaded = await loadAd(type);
  if (!loaded) {
    return { shown: false };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (type === 'rewarded') {
    const watched = Math.random() > 0.3;
    return { shown: true, rewarded: watched };
  }

  return { shown: true };
}

export function getAdFrequency(placement: AdPlacement): number {
  switch (placement) {
    case 'home_feed':
      return 5;
    case 'search_results':
      return 8;
    case 'property_details':
      return 3;
    default:
      return 10;
  }
}

export function trackAdImpression(adId: string, placement: AdPlacement): void {
  console.log(`Ad impression tracked: ${adId} at ${placement}`);
}

export function trackAdClick(adId: string, placement: AdPlacement): void {
  console.log(`Ad click tracked: ${adId} at ${placement}`);
}
