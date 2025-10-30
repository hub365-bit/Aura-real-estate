import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = '@aura_device_id';
const USER_DEVICE_MAPPING_KEY = '@aura_user_device_mapping';

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: string;
  osVersion: string;
  appVersion: string;
  registeredAt: string;
}

export async function getDeviceId(): Promise<string> {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      if (Platform.OS === 'web') {
        deviceId = generateWebDeviceId();
      } else if (Platform.OS === 'android') {
        const androidId = await Application.getAndroidId();
        deviceId = androidId || Device.modelId || generateUniqueId();
      } else {
        deviceId = Device.modelId || generateUniqueId();
      }
      if (deviceId) {
        await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
      }
    }
    
    return deviceId || generateUniqueId();
  } catch (error) {
    console.error('Error getting device ID:', error);
    return generateUniqueId();
  }
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const deviceId = await getDeviceId();
  
  return {
    deviceId,
    deviceName: Device.deviceName || 'Unknown Device',
    platform: Platform.OS,
    osVersion: Platform.Version.toString(),
    appVersion: Application.nativeApplicationVersion || '1.0.0',
    registeredAt: new Date().toISOString(),
  };
}

export async function checkDeviceRestriction(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  existingDevice?: DeviceInfo;
}> {
  try {
    const currentDeviceId = await getDeviceId();
    const mapping = await AsyncStorage.getItem(USER_DEVICE_MAPPING_KEY);
    const userDeviceMap: Record<string, DeviceInfo> = mapping ? JSON.parse(mapping) : {};
    
    if (!userDeviceMap[userId]) {
      return { allowed: true };
    }
    
    const registeredDevice = userDeviceMap[userId];
    
    if (registeredDevice.deviceId === currentDeviceId) {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      reason: 'This account is already registered on another device',
      existingDevice: registeredDevice,
    };
  } catch (error) {
    console.error('Error checking device restriction:', error);
    return { allowed: true };
  }
}

export async function registerUserDevice(userId: string): Promise<void> {
  try {
    const deviceInfo = await getDeviceInfo();
    const mapping = await AsyncStorage.getItem(USER_DEVICE_MAPPING_KEY);
    const userDeviceMap: Record<string, DeviceInfo> = mapping ? JSON.parse(mapping) : {};
    
    userDeviceMap[userId] = deviceInfo;
    
    await AsyncStorage.setItem(USER_DEVICE_MAPPING_KEY, JSON.stringify(userDeviceMap));
    
    console.log('Device registered for user:', userId, deviceInfo);
  } catch (error) {
    console.error('Error registering device:', error);
  }
}

export async function unregisterUserDevice(userId: string): Promise<void> {
  try {
    const mapping = await AsyncStorage.getItem(USER_DEVICE_MAPPING_KEY);
    const userDeviceMap: Record<string, DeviceInfo> = mapping ? JSON.parse(mapping) : {};
    
    delete userDeviceMap[userId];
    
    await AsyncStorage.setItem(USER_DEVICE_MAPPING_KEY, JSON.stringify(userDeviceMap));
    
    console.log('Device unregistered for user:', userId);
  } catch (error) {
    console.error('Error unregistering device:', error);
  }
}

function generateWebDeviceId(): string {
  const nav = window.navigator;
  const screen = window.screen;
  let uid = nav.userAgent.replace(/\D+/g, '');
  uid += screen.height || '';
  uid += screen.width || '';
  uid += screen.pixelDepth || '';
  return `web_${uid}`;
}

function generateUniqueId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
