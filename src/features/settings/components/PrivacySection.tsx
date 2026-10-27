import { StyleSheet } from 'react-native';

import { Button, Card, Notice, SectionTitle, Text } from '@/shared/components';
import { spacing } from '@/theme';

import { usePrivacyActions } from '../hooks/usePrivacyActions';

export function PrivacySection() {
  const { openPolicy, shareExport, confirmDelete, exportAccount, deleteAccount } = usePrivacyActions();
  const error = exportAccount.error ?? deleteAccount.error;

  return (
    <>
      <SectionTitle title="Privacidade" />
      <Card style={styles.card}>
        <Text variant="caption" tone="muted">
          A senha do Moodle não fica guardada. As credenciais ficam cifradas no servidor e os prazos não são armazenados.
        </Text>
        {error && <Notice tone="danger" message={error.message} />}
        <Button label="Política de privacidade e termos" variant="ghost" icon="document-text-outline" onPress={openPolicy} />
        <Button
          label="Baixar meus dados"
          variant="secondary"
          icon="download-outline"
          loading={exportAccount.isPending}
          onPress={shareExport}
        />
        <Button
          label="Excluir conta e dados"
          variant="secondary"
          icon="trash-outline"
          loading={deleteAccount.isPending}
          onPress={confirmDelete}
        />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
