import { StyleSheet, View } from 'react-native';

import { isDemo, useConnection } from '@/core/session';
import { accountSubtitle, accountTitle, useMoodle } from '@/features/account';
import { Button, Card, IconBox, SectionTitle, Text } from '@/shared/components';
import { alpha, fixedColors, spacing, tint } from '@/theme';

import { useConfirmLogout } from '../hooks/useConfirmLogout';

const DEMO_TITLE = 'Modo demonstração';
const DEMO_SUBTITLE = 'Dados de exemplo, nada vai para o Google';

export function AccountSection() {
  const { connection } = useConnection();
  const moodle = useMoodle();
  const confirmLogout = useConfirmLogout();
  const demo = isDemo(connection);

  return (
    <>
      <SectionTitle title="Conta" />
      <Card style={styles.card}>
        <View style={styles.row}>
          <IconBox icon="school" size="md" color={fixedColors.moodle} background={tint(fixedColors.moodle, alpha.medium)} />
          <View style={styles.text}>
            <Text variant="headline" numberOfLines={1}>
              {demo ? DEMO_TITLE : accountTitle(moodle.data)}
            </Text>
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {demo ? DEMO_SUBTITLE : accountSubtitle(moodle.data)}
            </Text>
          </View>
        </View>
        <Button label={demo ? 'Sair da demonstração' : 'Sair'} variant="secondary" icon="log-out-outline" onPress={confirmLogout} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1 },
});
