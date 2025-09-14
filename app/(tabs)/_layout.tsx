import { AuthGuard } from '@/components/auth/AuthGuard';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

function AnimatedTabIcon({ name, focusedName, color, focused }: { name: string; focusedName: string; color: string; focused: boolean }) {
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.8)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: focused ? 1 : 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
      }}
    >
      <Ionicons 
        size={24} 
        name={(focused ? focusedName : name) as any} 
        color={color} 
      />
    </Animated.View>
  );
}

export default function TabLayout() {
  const { themeMode } = useTheme();
  const colors = Colors[themeMode];

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.icon,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 8,
            paddingBottom: 8,
            height: 80,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon 
                name="home-outline"
                focusedName="home"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon 
                name="person-outline"
                focusedName="person"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
