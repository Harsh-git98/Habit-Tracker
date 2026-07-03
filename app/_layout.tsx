import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { appTheme } from '../src/theme/appTheme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: appTheme.colors.background }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: appTheme.colors.surface,
            },
            headerTitleStyle: {
              color: appTheme.colors.textPrimary,
              fontWeight: '700',
            },
            headerTintColor: appTheme.colors.textPrimary,
            contentStyle: {
              backgroundColor: appTheme.colors.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}