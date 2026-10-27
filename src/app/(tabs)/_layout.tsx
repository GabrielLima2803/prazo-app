import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useGoogleOnboarding } from '@/features/google';
import type { IconName } from '@/shared/types/icons';
import { fonts, fontSize, iconSize, useTheme } from '@/theme';

function tabIcon(active: IconName, inactive: IconName) {
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={iconSize.tab} color={color as string} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  useGoogleOnboarding();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: fontSize.xs },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Prazos', tabBarIcon: tabIcon('time', 'time-outline') }} />
      <Tabs.Screen name="courses" options={{ title: 'Disciplinas', tabBarIcon: tabIcon('layers', 'layers-outline') }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarIcon: tabIcon('settings', 'settings-outline') }} />
    </Tabs>
  );
}
