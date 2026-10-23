import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { ConnectionProvider, useConnection } from '@/state/connection';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function RootLayout() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }),
  );
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider>{fontsLoaded ? <Navigator /> : <Splash />}</ConnectionProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function Splash() {
  const { colors } = useTheme();
  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}

function Navigator() {
  const { colors, scheme } = useTheme();
  const { ready, connection, disconnect } = useConnection();
  const queryClient = useQueryClient();

  // Sessão expirada ou senha do Moodle trocada: volta para o login com o
  // motivo, em vez de mostrar um erro genérico.
  // Só o primeiro erro conta: ao sair, as consultas que ainda estavam no ar
  // voltam 401 e trocariam o motivo por "sessão expirada".
  const leaving = useRef(false);
  useEffect(() => {
    if (connection) leaving.current = false;
  }, [connection]);
  useEffect(
    () =>
      queryClient.getQueryCache().subscribe((event) => {
        const error = event.query.state.error;
        if (event.type !== 'updated' || !(error instanceof ApiError) || leaving.current) return;
        if (error.code === 'unauthorized' || error.code === 'moodle_reauth') {
          leaving.current = true;
          queryClient.clear();
          disconnect(error.code === 'unauthorized' ? 'session_expired' : 'moodle_reauth');
        }
      }),
    [queryClient, disconnect],
  );

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  if (!ready) return <Splash />;

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
        <Stack.Protected guard={connection !== null}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="deadline/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="google" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack.Protected>
        <Stack.Protected guard={connection === null}>
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
