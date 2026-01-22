import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QUEUE_KEY = '@aura_offline_queue';

export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retries: number;
}

export const offlineStorage = {
  async addAction(type: string, payload: any): Promise<void> {
    console.log('📦 Adding offline action:', type);
    
    const action: OfflineAction = {
      id: `${Date.now()}_${Math.random()}`,
      type,
      payload,
      timestamp: Date.now(),
      retries: 0,
    };

    const queue = await this.getQueue();
    queue.push(action);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  },

  async getQueue(): Promise<OfflineAction[]> {
    const data = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async removeAction(actionId: string): Promise<void> {
    console.log('✅ Removing completed offline action:', actionId);
    const queue = await this.getQueue();
    const filtered = queue.filter((action) => action.id !== actionId);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
  },

  async incrementRetry(actionId: string): Promise<void> {
    const queue = await this.getQueue();
    const action = queue.find((a) => a.id === actionId);
    if (action) {
      action.retries += 1;
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    }
  },

  async clearQueue(): Promise<void> {
    console.log('🗑️ Clearing offline queue');
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
  },

  async syncQueue(processFn: (action: OfflineAction) => Promise<boolean>): Promise<void> {
    console.log('🔄 Syncing offline queue...');
    const queue = await this.getQueue();

    for (const action of queue) {
      try {
        const success = await processFn(action);
        if (success) {
          await this.removeAction(action.id);
        } else {
          await this.incrementRetry(action.id);
        }
      } catch (error) {
        console.error('❌ Failed to process offline action:', error);
        await this.incrementRetry(action.id);
      }
    }

    console.log('✅ Offline queue sync complete');
  },
};
