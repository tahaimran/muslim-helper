import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { appStorage } from '@/lib/storage';
import { useTheme } from '@/lib/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  useEffect(() => {
    (async () => {
      const { lockedUntil } = await appStorage.getLoginAttempts();
      if (lockedUntil) {
        const remaining = Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 1000);
        if (remaining > 0) setLockoutRemaining(remaining);
        else await appStorage.clearLoginAttempts();
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (lockoutRemaining > 0) return;
    if (!pin || pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    setIsLoading(true);
    try {
      const auth = await appStorage.getAuth();
      if (auth && auth.pin === pin) {
        await appStorage.clearLoginAttempts();
        await appStorage.updateState({ isAuthenticated: true });
        router.replace('/(tabs)');
      } else {
        const { count, lockedUntil } = await appStorage.recordLoginAttempt();
        if (lockedUntil) {
          const remaining = Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 1000);
          setLockoutRemaining(remaining);
          setError('Too many attempts. Please wait.');
        } else {
          setError(`Invalid PIN. ${5 - count} attempts remaining.`);
        }
      }
    } catch {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Nafs</Text>
          <Text style={[styles.subtitle, { color: colors.mediumText }]}>30-Day Islamic Transformation</Text>
          <Text style={[styles.arabicSubtitle, { color: colors.gold }]}>النفس - تحويل إسلامي</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.darkText }]}>Welcome Back</Text>
          <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>Enter your PIN to continue</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }, error && { borderColor: colors.error, backgroundColor: '#FEE8E8' }]}
            placeholder="Enter PIN"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            keyboardType="numeric"
            value={pin}
            onChangeText={(text) => { setPin(text); setError(''); }}
            maxLength={6}
            editable={!isLoading && lockoutRemaining === 0}
            accessibilityLabel="PIN input"
            accessibilityHint="Enter your 4 to 6 digit PIN"
          />
          {error && <Text style={[styles.errorText, { color: colors.error }]} accessibilityRole="alert">{error}</Text>}
          {lockoutRemaining > 0 && (
            <Text style={[styles.lockoutText, { color: colors.gold }]}>Try again in {formatTime(lockoutRemaining)}</Text>
          )}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.mediumGreen }, (isLoading || lockoutRemaining > 0) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading || lockoutRemaining > 0}
            accessibilityLabel="Login button"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Login'}</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} accessibilityLabel="Create new account">
            <Text style={[styles.linkText, { color: colors.mediumText }]}>First time? <Text style={[styles.linkBold, { color: colors.mediumGreen }]}>Create Account</Text></Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.footerText, { color: colors.mutedText }]}>Local storage only - No cloud sync</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 48, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 4 },
  arabicSubtitle: { fontSize: 14 },
  card: { borderRadius: 16, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, marginBottom: 24 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 12 },
  errorText: { fontSize: 13, marginBottom: 16 },
  lockoutText: { fontSize: 13, marginBottom: 16, textAlign: 'center', fontWeight: '500' },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  divider: { height: 1, marginVertical: 16 },
  linkText: { textAlign: 'center', fontSize: 14 },
  linkBold: { fontWeight: '600' },
  footerText: { textAlign: 'center', fontSize: 12 },
});
