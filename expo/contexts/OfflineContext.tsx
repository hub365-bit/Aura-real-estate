import { useState, useEffect, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from '@tanstack/react-query';

interface QueuedAction {
  id: string;
  type: 'booking' | 'message' | 'favorite' | 'search';
  payload: Record<string, unknown>;
  timestamp: string;
  retries: number;
}

const OFFLINE_STATE_KEY = '@aura_offline_state';
const SAVED_LISTINGS_KEY = '@aura_saved_listings';

function getIsOnline(): boolean {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true;
}

export const [OfflineProvider, useOffline] = createContextHook(() => {
  const [isOnline, setIsOnline] = useState(true);
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);
  const [savedListings, setSavedListings] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const offlineQuery = useQuery({
    queryKey: ['offline-state'],
    queryFn: async () => {
      const [stateJson, listingsJson] = await Promise.all([
        AsyncStorage.getItem(OFFLINE_STATE_KEY),
        AsyncStorage.getItem(SAVED_LISTINGS_KEY),
      ]);
      return {
        actions: stateJson ? JSON.parse(stateJson) : [],
        listings: listingsJson ? JSON.parse(listingsJson) : [],
      };
    },
  });

  useEffect(() => {
    if (offlineQuery.data) {
      setQueuedActions(offlineQuery.data.actions);
      setSavedListings(offlineQuery.data.listings);
    }
  }, [offlineQuery.data]);

  useEffect(() => {
    setIsOnline(getIsOnline());
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveState = useCallback(async (actions: QueuedAction[], listings: string[]) => {
    await AsyncStorage.setItem(OFFLINE_STATE_KEY, JSON.stringify(actions));
    await AsyncStorage.setItem(SAVED_LISTINGS_KEY, JSON.stringify(listings));
  }, []);

  const syncMutation = useMutation({
    mutationFn: async () => {
      setIsSyncing(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return [];
    },
    onSuccess: () => {
      setQueuedActions([]);
      setIsSyncing(false);
      saveState([], savedListings);
    },
    onError: () => {
      setIsSyncing(false);
    },
  });

  const syncQueuedActions = useCallback(() => {
    if (queuedActions.length === 0 || !isOnline) return;
    syncMutation.mutate();
  }, [queuedActions.length, isOnline, syncMutation]);

  const queueAction = useCallback((action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => {
    const newAction: QueuedAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retries: 0,
    };
    setQueuedActions((prev) => {
      const updated = [...prev, newAction];
      saveState(updated, savedListings);
      return updated;
    });
  }, [savedListings, saveState]);

  const saveListing = useCallback((listingId: string) => {
    setSavedListings((prev) => {
      const updated = prev.includes(listingId) ? prev : [...prev, listingId];
      saveState(queuedActions, updated);
      return updated;
    });
  }, [queuedActions, saveState]);

  const removeSavedListing = useCallback((listingId: string) => {
    setSavedListings((prev) => {
      const updated = prev.filter((id) => id !== listingId);
      saveState(queuedActions, updated);
      return updated;
    });
  }, [queuedActions, saveState]);

  const isListingSaved = useCallback((listingId: string) => {
    return savedListings.includes(listingId);
  }, [savedListings]);

  return {
    isOnline,
    isSyncing,
    queuedActions,
    savedListings,
    queueAction,
    syncQueuedActions,
    saveListing,
    removeSavedListing,
    isListingSaved,
  };
});
