import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');

  React.useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('Index: User authenticated, redirecting to dashboard');
        router.replace('/(tabs)');
      } else {
        console.log('Index: User not authenticated, redirecting to login');
        router.replace('/(auth)/login');
      }
    }
  }, [user, loading]);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size="large" color="#6366F1" />
      <ThemedText style={styles.loadingText}>
        {loading ? 'Loading...' : 'Redirecting...'}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
