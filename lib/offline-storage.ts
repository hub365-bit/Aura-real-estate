import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property, ServiceProvider, Booking, Event } from '@/types';

const KEYS = {
  SAVED_PROPERTIES: 'aura_saved_properties',
  SAVED_SERVICES: 'aura_saved_services',
  SAVED_EVENTS: 'aura_saved_events',
  PENDING_BOOKINGS: 'aura_pending_bookings',
  SAVED_SEARCHES: 'aura_saved_searches',
  OFFLINE_MODE: 'aura_offline_mode',
  LAST_SYNC: 'aura_last_sync',
} as const;

export async function savePropertyOffline(property: Property): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(KEYS.SAVED_PROPERTIES);
    const properties: Property[] = existing ? JSON.parse(existing) : [];
    
    const index = properties.findIndex(p => p.id === property.id);
    if (index >= 0) {
      properties[index] = property;
    } else {
      properties.push(property);
    }
    
    await AsyncStorage.setItem(KEYS.SAVED_PROPERTIES, JSON.stringify(properties));
    console.log('[Offline] Property saved:', property.id);
  } catch (error) {
    console.error('[Offline] Failed to save property:', error);
  }
}

export async function getSavedProperties(): Promise<Property[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SAVED_PROPERTIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[Offline] Failed to get saved properties:', error);
    return [];
  }
}

export async function savePendingBooking(booking: Partial<Booking>): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(KEYS.PENDING_BOOKINGS);
    const bookings: Partial<Booking>[] = existing ? JSON.parse(existing) : [];
    bookings.push(booking);
    
    await AsyncStorage.setItem(KEYS.PENDING_BOOKINGS, JSON.stringify(bookings));
    console.log('[Offline] Booking saved for later sync');
  } catch (error) {
    console.error('[Offline] Failed to save pending booking:', error);
  }
}

export async function getPendingBookings(): Promise<Partial<Booking>[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PENDING_BOOKINGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[Offline] Failed to get pending bookings:', error);
    return [];
  }
}

export async function clearPendingBookings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.PENDING_BOOKINGS);
  } catch (error) {
    console.error('[Offline] Failed to clear pending bookings:', error);
  }
}

export async function saveSearch(query: string, filters: any): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(KEYS.SAVED_SEARCHES);
    const searches: any[] = existing ? JSON.parse(existing) : [];
    
    searches.unshift({
      query,
      filters,
      savedAt: new Date().toISOString(),
    });
    
    const limited = searches.slice(0, 20);
    await AsyncStorage.setItem(KEYS.SAVED_SEARCHES, JSON.stringify(limited));
  } catch (error) {
    console.error('[Offline] Failed to save search:', error);
  }
}

export async function getSavedSearches(): Promise<any[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.SAVED_SEARCHES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[Offline] Failed to get saved searches:', error);
    return [];
  }
}

export async function setOfflineMode(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.OFFLINE_MODE, JSON.stringify(enabled));
  } catch (error) {
    console.error('[Offline] Failed to set offline mode:', error);
  }
}

export async function isOfflineMode(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(KEYS.OFFLINE_MODE);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error('[Offline] Failed to check offline mode:', error);
    return false;
  }
}

export async function setLastSync(timestamp: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LAST_SYNC, timestamp);
  } catch (error) {
    console.error('[Offline] Failed to set last sync:', error);
  }
}

export async function getLastSync(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.LAST_SYNC);
  } catch (error) {
    console.error('[Offline] Failed to get last sync:', error);
    return null;
  }
}
