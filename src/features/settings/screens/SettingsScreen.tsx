import { ScrollView } from 'react-native';

import { ScreenHeader } from '@/shared/components';
import { useNow } from '@/shared/hooks/useNow';
import { useScreenPadding } from '@/shared/hooks/useScreenPadding';

import { AccountSection } from '../components/AccountSection';
import { AppFooter } from '../components/AppFooter';
import { GoogleSection } from '../components/GoogleSection';
import { RemindersSection } from '../components/RemindersSection';
import { VisibleTypesSection } from '../components/VisibleTypesSection';

export function SettingsScreen() {
  const padding = useScreenPadding();
  const now = useNow();
  return (
    <ScrollView contentContainerStyle={padding}>
      <ScreenHeader title="Ajustes" />
      <AccountSection />
      <GoogleSection now={now} />
      <RemindersSection />
      <VisibleTypesSection />
      <AppFooter />
    </ScrollView>
  );
}
