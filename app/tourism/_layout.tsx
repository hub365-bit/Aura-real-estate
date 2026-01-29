import { Stack } from 'expo-router';

export default function TourismLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="guides" />
      <Stack.Screen name="guide/[id]" />
      <Stack.Screen name="experiences" />
      <Stack.Screen name="experience/[id]" />
      <Stack.Screen name="transport" />
      <Stack.Screen name="itinerary" />
      <Stack.Screen name="cultural-guide" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
