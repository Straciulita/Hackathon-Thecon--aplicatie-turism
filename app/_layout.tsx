import { Stack } from 'expo-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocationProvider } from './contexts/LocationContext'; // Import nou

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="details" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </LocationProvider>
    </ThemeProvider>
  );
}