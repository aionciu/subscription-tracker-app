import { ThemedStatusBar } from "@/components/ui/ThemedStatusBar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <ThemedStatusBar />
      </AuthProvider>
    </ThemeProvider>
  );
}
