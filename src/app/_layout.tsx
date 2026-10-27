import { useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppProviders } from '@/core/providers/AppProviders';
import { useAuthErrorLogout, useConnection } from '@/core/session';
import { fontAssets, fonts, useTheme } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);
  return <AppProviders>{fontsLoaded ? <RootNavigator /> : <Splash />}</AppProviders>;
}

function Splash() {
  const { colors } = useTheme();
  return <View style={[styles.splash, { backgroundColor: colors.background }]} />;
}

function RootNavigator() {
  const { colors, scheme } = useTheme();
  const { ready, connection } = useConnection();
  useAuthErrorLogout();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  if (!ready) return <Splash />;

  const signedIn = connection !== null;

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: fonts.semibold },
        }}
      >
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="deadline/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="google" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1 },
});
