import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, type ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { useStatus } from '@/api/hooks';
import { useConnection } from '@/state/connection';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type IconName = ComponentProps<typeof Ionicons>['name'];

function icon(active: IconName, inactive: IconName) {
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={23} color={color as string} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const { onboarding, finishOnboarding } = useConnection();
  const status = useStatus();

  // Logo depois do login, o passo do Google (só se ainda não estiver conectado).
  useEffect(() => {
    if (!onboarding || !status.data) return;
    finishOnboarding();
    if (!status.data.google.authorized) router.push('/google');
  }, [onboarding, status.data, finishOnboarding, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Prazos', tabBarIcon: icon('time', 'time-outline') }} />
      <Tabs.Screen name="courses" options={{ title: 'Disciplinas', tabBarIcon: icon('layers', 'layers-outline') }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarIcon: icon('settings', 'settings-outline') }} />
    </Tabs>
  );
}
