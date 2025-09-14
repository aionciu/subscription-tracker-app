import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { getSecureErrorMessage, sanitizeInput } from '@/config/security';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { validateLoginForm, validateRegisterForm } from '@/lib/validation';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

function AnimatedInput({ 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  keyboardType = 'default',
  autoCapitalize = 'none',
  showPasswordToggle = false,
  onTogglePassword,
  style 
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  style?: any;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  const animatedBorderColor = isFocused ? primaryColor : borderColor;

  return (
    <View
      style={[
        style,
        {
          borderColor: animatedBorderColor,
        },
      ]}
    >
      <View style={[styles.inputWrapper, { backgroundColor: surfaceColor }]}>
        <Ionicons name={icon as any} size={20} color={primaryColor} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={textColor + '80'}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          accessibilityLabel={placeholder}
          accessibilityHint={`Enter your ${placeholder.toLowerCase()}`}
          importantForAccessibility="yes"
        />
        {showPasswordToggle && (
          <Ionicons
            name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={primaryColor}
            style={styles.inputIcon}
            onPress={onTogglePassword}
          />
        )}
      </View>
    </View>
  );
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signIn, signUp } = useAuth();
  // const backgroundColor = useThemeColor({}, 'background'); // Unused for now
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const validateForm = useCallback(() => {
    const formData = {
      email,
      password,
      ...(mode === 'register' && { fullName }),
    };

    const validation = mode === 'login' 
      ? validateLoginForm(formData as { email: string; password: string })
      : validateRegisterForm(formData as { email: string; password: string; fullName: string });

    setErrors(validation.errors);
    return validation.isValid;
  }, [email, password, fullName, mode]);

  const handleEmailAuth = useCallback(async () => {
    // Clear previous errors
    setErrors({});

    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);
      const sanitizedFullName = mode === 'register' ? sanitizeInput(fullName) : undefined;

      const { error } = mode === 'login' 
        ? await signIn(sanitizedEmail, sanitizedPassword)
        : await signUp(sanitizedEmail, sanitizedPassword, sanitizedFullName);

      if (error) {
        console.log('AuthForm: Authentication failed:', error.message);
        const secureMessage = getSecureErrorMessage(error);
        Alert.alert('Error', secureMessage);
      } else {
        console.log('AuthForm: Authentication successful, calling onSuccess...');
        onSuccess?.();
        console.log('AuthForm: onSuccess called, auth state should update soon...');
        
        // Fallback redirect after a short delay to ensure auth state has updated
        setTimeout(() => {
          console.log('AuthForm: Fallback redirect to dashboard...');
          router.replace('/(tabs)');
        }, 1000);
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [email, password, fullName, mode, validateForm, signIn, signUp, onSuccess]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView lightColor="transparent" darkColor="transparent" style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="wallet-outline" size={32} color="#2563EB" />
              </View>
            </View>
            <ThemedText type="hero" style={styles.title}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {mode === 'login' 
                ? 'Sign in to continue managing your subscriptions'
                : 'Join thousands managing their subscriptions smarter'
              }
            </ThemedText>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'register' && (
              <>
                <AnimatedInput
                  icon="person-outline"
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  style={styles.inputContainer}
                />
                {errors.fullName && (
                  <ThemedText style={styles.errorText}>{errors.fullName}</ThemedText>
                )}
              </>
            )}

            <AnimatedInput
              icon="mail-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.inputContainer}
            />
            {errors.email && (
              <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
            )}

            <AnimatedInput
              icon="lock-closed-outline"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
              style={styles.inputContainer}
            />
            {errors.password && (
              <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
            )}

            {/* Primary Action Button */}
            <Button
              title={mode === 'login' ? 'Sign In' : 'Create Account'}
              onPress={handleEmailAuth}
              loading={loading}
              size="large"
              fullWidth
              style={styles.primaryButton}
            />
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 18,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});
