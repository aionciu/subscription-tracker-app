import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Polyfill for window object in React Native
if (typeof global.window === 'undefined') {
  (global as any).window = global;
}

// Ensure AsyncStorage is properly initialized
let AsyncStorageInstance: typeof AsyncStorage | null = null;
try {
  AsyncStorageInstance = AsyncStorage;
  console.log('AsyncStorage imported successfully');
} catch (error) {
  console.warn('AsyncStorage import failed:', error);
  AsyncStorageInstance = null;
}

// Create a platform-aware storage adapter
const createStorageAdapter = () => {
  // Check if we're in a web environment
  const isWeb = () => {
    try {
      return typeof window !== 'undefined' && typeof document !== 'undefined';
    } catch {
      return false;
    }
  };

  // Check if we're in a React Native environment
  const isReactNative = () => {
    try {
      return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
    } catch {
      return false;
    }
  };

  const isAsyncStorageAvailable = () => {
    try {
      return AsyncStorageInstance && 
             typeof AsyncStorageInstance.getItem === 'function' &&
             typeof AsyncStorageInstance.setItem === 'function' &&
             typeof AsyncStorageInstance.removeItem === 'function';
    } catch {
      return false;
    }
  };

  const web = isWeb();
  const reactNative = isReactNative();
  const asyncStorageAvailable = isAsyncStorageAvailable();
  
  console.log('Web environment:', web);
  console.log('React Native environment:', reactNative);
  console.log('AsyncStorage available:', asyncStorageAvailable);

  // Create appropriate storage based on platform
  if (web) {
    // Web environment - use localStorage
    console.log('Using localStorage for web environment');
    return {
      getItem: async (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.warn('localStorage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('localStorage setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('localStorage removeItem error:', error);
        }
      },
    };
  } else if (reactNative && asyncStorageAvailable) {
    // React Native environment with AsyncStorage
    console.log('Using AsyncStorage for React Native environment');
    return {
      getItem: async (key: string) => {
        try {
          return await AsyncStorageInstance!.getItem(key);
        } catch (error) {
          console.warn('AsyncStorage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await AsyncStorageInstance!.setItem(key, value);
        } catch (error) {
          console.warn('AsyncStorage setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await AsyncStorageInstance!.removeItem(key);
        } catch (error) {
          console.warn('AsyncStorage removeItem error:', error);
        }
      },
    };
  } else {
    // Fallback to memory storage
    console.log('Using memory storage as fallback');
    const memoryStorage = new Map<string, string>();
    
    return {
      getItem: async (key: string) => {
        return memoryStorage.get(key) || null;
      },
      setItem: async (key: string, value: string) => {
        memoryStorage.set(key, value);
      },
      removeItem: async (key: string) => {
        memoryStorage.delete(key);
      },
    };
  }
};

import { getSecurityHeaders, validateEnvironment } from '@/config/security';

// Validate environment variables securely
const { supabaseUrl, supabaseKey } = validateEnvironment();

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true, // Re-enable session persistence
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'react-native',
      ...getSecurityHeaders(),
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
