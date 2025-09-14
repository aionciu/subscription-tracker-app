import { useTheme } from '@/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export function ThemedStatusBar() {
  const { isDark } = useTheme();
  const statusBarStyle = isDark ? 'light' : 'dark';
  
  console.log('ThemedStatusBar: isDark =', isDark, 'style =', statusBarStyle);
  
  return (
    <StatusBar style={statusBarStyle} />
  );
}
