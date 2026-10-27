import { useState } from 'react';

import { createAuthApi } from '@/core/api';
import { DEFAULT_SERVER } from '@/core/config';
import { useConnection } from '@/core/session';
import { haptics } from '@/shared/lib/haptics';

import { CUSTOM_INSTANCE, DEFAULT_INSTANCE, MOODLE_INSTANCES, type LoginMode, type MoodleInstanceId } from '../constants';
import { loginErrorMessage } from '../messages';

const isFilled = (s: string) => s.trim() !== '';

/** Estado e envio do formulário de login (usuário/senha ou URL do calendário). */
export function useLoginForm() {
  const { connect } = useConnection();
  const [mode, setMode] = useState<LoginMode>('login');
  const [instance, setInstance] = useState<MoodleInstanceId>(DEFAULT_INSTANCE);
  const [customUrl, setCustomUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [icalUrl, setIcalUrl] = useState('');
  const [server, setServer] = useState(DEFAULT_SERVER);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = instance === CUSTOM_INSTANCE ? customUrl : (MOODLE_INSTANCES.find((i) => i.id === instance)?.url ?? '');
  const canSubmit = mode === 'login' ? isFilled(baseUrl) && isFilled(username) && password !== '' : isFilled(icalUrl);

  const toggleMode = () => {
    setError(null);
    setMode((m) => (m === 'login' ? 'ical' : 'login'));
  };

  const submit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    try {
      const serverUrl = server.trim();
      const auth = createAuthApi(serverUrl);
      const res = mode === 'login' ? await auth.login({ baseUrl, username, password }) : await auth.loginICal(icalUrl.trim());
      setPassword('');
      haptics.success();
      await connect({ mode: 'server', baseUrl: serverUrl, token: res.token });
    } catch (e) {
      haptics.error();
      setError(loginErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const enterDemo = () => connect({ mode: 'demo' });

  return {
    mode,
    toggleMode,
    instance,
    setInstance,
    customUrl,
    setCustomUrl,
    username,
    setUsername,
    password,
    setPassword,
    icalUrl,
    setIcalUrl,
    server,
    setServer,
    error,
    loading,
    canSubmit,
    submit,
    enterDemo,
  };
}

export type LoginForm = ReturnType<typeof useLoginForm>;
