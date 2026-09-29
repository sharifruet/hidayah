import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Share, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { fmt, tr } from '../../../data/translations';
import { userErrorMessage } from '../../../lib/errors';
import { formatRelative } from '../../../lib/format';
import {
  deleteBackup, disableSync, enableSync, getLastSyncAt, getSyncCode, restoreWithCode, rotateSyncCode, syncNow,
} from '../../../lib/sync';

type Busy = null | 'enable' | 'restore' | 'sync' | 'rotate' | 'delete';

function Button({
  label, onPress, busy, variant = 'primary', icon,
}: { label: string; onPress: () => void; busy?: boolean; variant?: 'primary' | 'secondary' | 'danger'; icon?: keyof typeof Ionicons.glyphMap }) {
  const cls = {
    primary: 'bg-primary-600',
    secondary: 'bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700',
    danger: 'bg-white dark:bg-ink-900 border border-rose-200 dark:border-rose-900',
  }[variant];
  const text = { primary: 'text-white', secondary: 'text-ink-800 dark:text-ink-100', danger: 'text-rose-600' }[variant];
  const color = { primary: '#fff', secondary: '#5b6579', danger: '#e11d48' }[variant];
  return (
    <TouchableOpacity onPress={onPress} disabled={busy} className={`flex-row items-center justify-center rounded-xl py-3 mb-2 ${cls}`}>
      {busy ? <ActivityIndicator size="small" color={color} /> : icon ? <Ionicons name={icon} size={16} color={color} /> : null}
      <Text className={`font-body-semibold text-sm ml-2 ${text}`}>{label}</Text>
    </TouchableOpacity>
  );
}

/** Optional backup with a sync code — no account details, just a code to restore with. */
export default function SyncScreen() {
  const { language } = useApp();
  const [code, setCode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [entering, setEntering] = useState(false);
  const [input, setInput] = useState('');
  const [lastSync, setLastSync] = useState<number | null>(getLastSyncAt);

  useEffect(() => {
    getSyncCode().then((c) => {
      setCode(c);
      setLoaded(true);
    });
  }, []);

  const run = useCallback(
    async (kind: Exclude<Busy, null>, fn: () => Promise<void>) => {
      setBusy(kind);
      setError('');
      setNotice('');
      try {
        await fn();
        setLastSync(getLastSyncAt());
      } catch (e) {
        setError(kind === 'restore' && (e as { status?: number }).status === 404 ? tr('sync_invalid_code', language) : userErrorMessage(e, language));
      } finally {
        setBusy(null);
      }
    },
    [language]
  );

  const confirm = (message: string, onOk: () => void) =>
    Alert.alert(tr('sync_title', language), message, [
      { text: tr('cancel', language), style: 'cancel' },
      { text: tr('sync_continue', language), style: 'destructive', onPress: onOk },
    ]);

  async function copy() {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const validInput = /^[0-9A-HJ-NP-Za-hj-np-z]{16}$/.test(input.replace(/[\s-]/g, '').replace(/[oO]/g, '0').replace(/[iIlL]/g, '1'));

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1" accessibilityLabel={tr('close', language)}>
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('sync_title', language)}</Text>
      </View>

      <Card className="p-4 mb-4">
        <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{tr('sync_intro', language)}</Text>
        <Text className="font-body text-xs text-ink-400 mt-2 leading-relaxed">{tr('sync_whats_synced', language)}</Text>
      </Card>

      {error ? (
        <View className="bg-rose-50 dark:bg-rose-900/20 rounded-xl px-3 py-2.5 mb-3">
          <Text className="font-body text-xs text-rose-700 dark:text-rose-300">{error}</Text>
        </View>
      ) : null}
      {notice ? (
        <View className="bg-primary-50 dark:bg-primary-900/30 rounded-xl px-3 py-2.5 mb-3">
          <Text className="font-body-medium text-xs text-primary-700 dark:text-primary-300">{notice}</Text>
        </View>
      ) : null}

      {!loaded ? (
        <ActivityIndicator />
      ) : code ? (
        <>
          <Card className="p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="cloud-done" size={16} color="#15805a" />
              <Text className="font-body-semibold text-sm text-primary-700 dark:text-primary-300 ml-2">{tr('sync_on', language)}</Text>
            </View>
            <Text className="font-body text-xs text-ink-400">{tr('sync_code_label', language)}</Text>
            <Text selectable className="font-body-bold text-xl tracking-widest text-ink-900 dark:text-white my-1.5">
              {revealed ? code : code.replace(/[0-9A-Z]/g, '•')}
            </Text>
            <View className="flex-row gap-2 mb-3">
              <TouchableOpacity onPress={() => setRevealed((r) => !r)} className="px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-800">
                <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-200">{tr(revealed ? 'sync_hide' : 'sync_show', language)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={copy} className="px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-800">
                <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-200">{tr(copied ? 'sync_copied' : 'sync_copy', language)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Share.share({ message: fmt('sync_share_text', language, { code }) })}
                className="px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-800"
              >
                <Text className="font-body-medium text-xs text-ink-700 dark:text-ink-200">{tr('sync_share', language)}</Text>
              </TouchableOpacity>
            </View>
            <Text className="font-body text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">{tr('sync_code_warning', language)}</Text>
            <Text className="font-body text-xs text-ink-400 mt-3">
              {lastSync ? fmt('sync_last', language, { time: formatRelative(lastSync, language) }) : tr('sync_never', language)}
            </Text>
          </Card>

          <Button
            label={busy === 'sync' ? tr('sync_syncing', language) : tr('sync_now', language)}
            icon="sync"
            busy={busy === 'sync'}
            onPress={() => run('sync', async () => void (await syncNow()))}
          />
          <Button
            label={tr('sync_rotate', language)}
            variant="secondary"
            icon="key-outline"
            busy={busy === 'rotate'}
            onPress={() =>
              confirm(tr('sync_rotate_confirm', language), () =>
                run('rotate', async () => {
                  setCode(await rotateSyncCode());
                  setRevealed(true);
                })
              )
            }
          />
          <Button
            label={tr('sync_turn_off', language)}
            variant="secondary"
            icon="cloud-offline-outline"
            onPress={() =>
              confirm(tr('sync_turn_off_note', language), async () => {
                await disableSync();
                setCode(null);
                setLastSync(null);
              })
            }
          />
          <Button
            label={tr('sync_delete', language)}
            variant="danger"
            icon="trash-outline"
            busy={busy === 'delete'}
            onPress={() =>
              confirm(tr('sync_delete_confirm', language), () =>
                run('delete', async () => {
                  await deleteBackup();
                  setCode(null);
                })
              )
            }
          />
        </>
      ) : (
        <>
          <Button
            label={tr('sync_enable', language)}
            icon="cloud-upload-outline"
            busy={busy === 'enable'}
            onPress={() =>
              run('enable', async () => {
                setCode(await enableSync());
                setRevealed(true);
              })
            }
          />
          {entering ? (
            <Card className="p-4 mt-2">
              <Text className="font-body-medium text-sm text-ink-900 dark:text-white mb-2">{tr('sync_enter_code', language)}</Text>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                placeholderTextColor="#adb5c2"
                autoCapitalize="characters"
                autoCorrect={false}
                className="bg-ink-50 dark:bg-ink-800 rounded-xl px-3 py-2.5 font-body-semibold text-base tracking-widest text-ink-900 dark:text-white mb-1.5"
              />
              <Text className="font-body text-[11px] text-ink-400 mb-3">{tr('sync_code_format', language)}</Text>
              <Button
                label={tr('sync_restore', language)}
                icon="cloud-download-outline"
                busy={busy === 'restore'}
                onPress={() => {
                  if (!validInput) {
                    setError(tr('sync_code_format', language));
                    return;
                  }
                  run('restore', async () => {
                    await restoreWithCode(input);
                    setCode(await getSyncCode());
                    setNotice(tr('sync_restored', language));
                    setEntering(false);
                  });
                }}
              />
            </Card>
          ) : (
            <Button label={tr('sync_have_code', language)} variant="secondary" icon="key-outline" onPress={() => setEntering(true)} />
          )}
        </>
      )}
    </Screen>
  );
}
