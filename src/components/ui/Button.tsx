import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');
  // const backgroundColor = useThemeColor({}, 'background'); // Unused for now
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacityAnim.setValue(disabled || loading ? 0.6 : 1);
  }, [disabled, loading]);

  const getButtonStyle = () => {
    const baseStyle = [
      styles.base,
      size === 'small' && styles.small,
      size === 'medium' && styles.medium,
      size === 'large' && styles.large,
      fullWidth && styles.fullWidth,
    ];

    if (variant === 'primary') {
      return [...baseStyle, styles.primary];
    } else {
      return [...baseStyle, styles.outline, { borderColor }];
    }
  };

  const getTextColor = () => {
    if (variant === 'primary') {
      return '#FFFFFF';
    }
    return textColor;
  };

  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    Animated.timing(opacityAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(opacityAnim, {
      toValue: isDisabled ? 0.6 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (isDisabled) return;
    console.log('Button pressed:', title);
    onPress();
  };

  if (variant === 'primary') {
    return (
      <Animated.View
        style={[
          getButtonStyle(),
          style,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          activeOpacity={1}
        >
          <LinearGradient
            colors={[primaryColor, '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={[styles.text, { color: getTextColor() }]}>
                {title}
              </ThemedText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        getButtonStyle(),
        style,
        {
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color={primaryColor} size="small" />
        ) : (
          <ThemedText style={[styles.text, { color: getTextColor() }]}>
            {title}
          </ThemedText>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  primary: {
    // Primary button styles
  },
  outline: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});
