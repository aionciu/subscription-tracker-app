import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Switch, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface ThemeToggleProps {
  style?: any;
}

export function ThemeToggle({ style }: ThemeToggleProps) {
  const { themeMode, setThemeMode } = useTheme();
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const isDarkMode = themeMode === 'dark';

  const handleToggle = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container, { borderColor }, style]}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isDarkMode ? 'moon' : 'sunny'} 
            size={20} 
            color={primaryColor} 
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            Dark Mode
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {isDarkMode ? 'Enabled' : 'Disabled'}
          </ThemedText>
        </View>
      </View>
      <Switch
        value={isDarkMode}
        onValueChange={handleToggle}
        trackColor={{ false: '#E5E7EB', true: primaryColor }}
        thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});
