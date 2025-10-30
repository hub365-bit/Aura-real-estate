import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { trpc, trpcClient } from "@/lib/trpc";
import ErrorBoundary from "@/components/ErrorBoundary";
import { logger } from "@/lib/logger";
import { validateConfig } from "@/lib/config";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="auth/verify-otp" options={{ headerShown: false }} />
      <Stack.Screen name="tickets/index" options={{ headerShown: false }} />
      <Stack.Screen name="tickets/create" options={{ headerShown: false }} />
      <Stack.Screen name="booking/details/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard/analytics" options={{ headerShown: false }} />
      <Stack.Screen name="rewards/index" options={{ headerShown: false }} />
      <Stack.Screen name="listings/create" options={{ headerShown: false }} />
      <Stack.Screen name="verification/documents" options={{ headerShown: false }} />
      <Stack.Screen name="subscription/plans" options={{ headerShown: false }} />
      <Stack.Screen name="subscription/checkout" options={{ headerShown: false }} />
      <Stack.Screen name="property/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="service/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="booking/property/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="booking/service/[providerId]/[serviceId]" options={{ headerShown: false }} />
      <Stack.Screen name="modals/filters" options={{ presentation: "modal" }} />
      <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
      <Stack.Screen name="settings/language" options={{ headerShown: false }} />
      <Stack.Screen name="business/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="reels/index" options={{ headerShown: false }} />
      <Stack.Screen name="payments/index" options={{ headerShown: false }} />
      <Stack.Screen name="messages/index" options={{ headerShown: false }} />
      <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="auth/enable-2fa" options={{ headerShown: false }} />
      <Stack.Screen name="property/virtual-tour/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="listings/ai-generator" options={{ headerShown: false }} />
      <Stack.Screen name="support/chatbot" options={{ headerShown: false }} />
      <Stack.Screen name="referrals/index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    
    try {
      validateConfig();
      logger.info("App initialized successfully");
    } catch (error) {
      logger.error("Configuration validation failed", error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={styles.container}>
            <AppProvider>
              <RootLayoutNav />
            </AppProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
