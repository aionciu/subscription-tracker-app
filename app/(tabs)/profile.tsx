import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const switchTrackColor = useThemeColor({}, 'switchTrack');
  const switchThumbColor = useThemeColor({}, 'switchThumb');
  
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme, themeMode } = useTheme();

  console.log('ProfileScreen: Rendering profile for user:', user?.id || 'No user');
  console.log('ProfileScreen: Current theme mode:', themeMode, 'isDark:', isDark);

  const handleLogout = async () => {
    console.log('Profile screen: Sign out button pressed');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            console.log('Profile screen: Sign out cancelled');
          },
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Profile screen: Starting sign out...');
              await signOut();
              console.log('Profile screen: Sign out completed, redirecting to login...');
              
              // Manual redirect to ensure user gets to login page
              setTimeout(() => {
                console.log('Profile screen: Redirecting to login page...');
                router.replace('/(auth)/login');
              }, 100);
            } catch (error) {
              console.error('Profile screen: Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
        
        {user && (
          <View style={[styles.userInfo, { backgroundColor: cardBackgroundColor, borderColor }]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                <ThemedText style={styles.avatarText}>
                  {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="defaultSemiBold" style={[styles.userName, { color: primaryColor }]}>
              {user.user_metadata?.full_name || 'User'}
            </ThemedText>
            <ThemedText style={styles.userEmail}>
              {user.email}
            </ThemedText>
          </View>
        )}
        
        <ThemedText style={styles.subtitle}>
          Manage your account settings and preferences
        </ThemedText>

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.settingsTitle}>
            Settings
          </ThemedText>
          <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: cardBackgroundColor, borderColor }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <View style={styles.leftContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
                <Ionicons 
                  name={isDark ? 'moon' : 'sunny'} 
                  size={20} 
                  color={primaryColor} 
                />
              </View>
              <View style={styles.textContainer}>
                <ThemedText type="defaultSemiBold" style={styles.toggleTitle}>
                  Dark Mode
                </ThemedText>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: switchTrackColor, true: primaryColor }}
              thumbColor={switchThumbColor}
              ios_backgroundColor={switchTrackColor}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            size="large"
            fullWidth
            style={styles.button}
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  userName: {
    fontSize: 22,
    marginBottom: 8,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
  },
  settingsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  settingsTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 8,
  },
});
