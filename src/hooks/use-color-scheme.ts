import { useColorScheme as _useColorScheme } from 'react-native';

export function useColorScheme() {
  // For now, just use the system color scheme
  // The theme context integration will be handled at the component level
  return _useColorScheme();
}
