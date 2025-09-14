import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthForm } from './AuthForm';

interface AuthScreenProps {
  mode: 'login' | 'register';
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const backgroundColor = useThemeColor({}, 'background');

  const handleSuccess = () => {
    console.log('AuthScreen: Authentication successful, waiting for auth state change...');
    // AuthContext will update user state, which triggers redirect in app/index.tsx
  };

  const handleSwitchMode = () => {
    if (mode === 'login') {
      router.push('/(auth)/register');
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#2563EB', '#3B82F6', '#059669', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Floating Orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      {/* Content */}
      <View style={styles.content}>
        <AuthForm mode={mode} onSuccess={handleSuccess} />
        
        {/* Switch Mode */}
        <View style={styles.switchContainer}>
          <AuthModeSwitch mode={mode} onSwitch={handleSwitchMode} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function AuthModeSwitch({ mode, onSwitch }: { mode: 'login' | 'register'; onSwitch: () => void }) {
  const textColor = useThemeColor({}, 'text');
  
  return (
    <View style={styles.switchWrapper}>
      <Text style={[styles.switchText, { color: textColor }]}>
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
      </Text>
      <Text 
        style={[styles.switchLink, { color: '#2563EB' }]}
        onPress={onSwitch}
      >
        {mode === 'login' ? 'Sign Up' : 'Sign In'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
  },
  orb1: {
    position: 'absolute',
    top: 100,
    right: 50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    opacity: 0.6,
  },
  orb2: {
    position: 'absolute',
    bottom: 200,
    left: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    opacity: 0.4,
  },
  orb3: {
    position: 'absolute',
    top: 300,
    left: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  switchContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    opacity: 0.7,
  },
  switchLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
