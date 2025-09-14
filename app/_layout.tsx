import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <ThemedStatusBar />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
