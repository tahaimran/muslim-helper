import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { appStorage } from '@/lib/storage';
import { useTheme } from '@/lib/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!pin || pin.length < 4) { setError('PIN must be at least 4 digits'); return; }
    if (pin !== confirmPin) { setError('PINs do not match'); return; }
    setIsLoading(true);
    try {
      await appStorage.setAuth({ pin, createdAt: new Date().toISOString() });
      await appStorage.setState({
        isOnboarded: false, isAuthenticated: true, userProfile: null,
        currentDay: 1, dayProgress: {}, totalPoints: 0, streakDays: 0,
        lastActiveDate: new Date().toDateString(),
      });
      router.replace('/(onboarding)');
    } catch { setError('Registration failed'); } finally { setIsLoading(false); }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primaryGreen }]}>Nafs</Text>
          <Text style={[styles.subtitle, { color: colors.mediumText }]}>Begin Your Journey</Text>
          <Text style={[styles.arabicSubtitle, { color: colors.gold }]}>ابدأ رحلتك</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.darkText }]}>Create Account</Text>
          <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>Set a secure PIN to protect your data</Text>
          <Text style={[styles.label, { color: colors.darkText }]}>PIN (4+ digits)</Text>
          <TextInput style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }, error && { borderColor: colors.error, backgroundColor: '#FEE8E8' }]} placeholder="Enter PIN" placeholderTextColor={colors.mutedText} secureTextEntry keyboardType="numeric" value={pin} onChangeText={(t) => { setPin(t); setError(''); }} maxLength={6} editable={!isLoading} accessibilityLabel="Create PIN" accessibilityHint="Enter a 4 to 6 digit PIN" />
          <Text style={[styles.label, { color: colors.darkText }]}>Confirm PIN</Text>
          <TextInput style={[styles.input, { borderColor: colors.border, color: colors.darkText, backgroundColor: colors.inputBackground }, error && { borderColor: colors.error, backgroundColor: '#FEE8E8' }]} placeholder="Confirm PIN" placeholderTextColor={colors.mutedText} secureTextEntry keyboardType="numeric" value={confirmPin} onChangeText={(t) => { setConfirmPin(t); setError(''); }} maxLength={6} editable={!isLoading} accessibilityLabel="Confirm PIN" />
          {error && <Text style={[styles.errorText, { color: colors.error }]} accessibilityRole="alert">{error}</Text>}
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.mediumGreen }, isLoading && styles.buttonDisabled]} onPress={handleRegister} disabled={isLoading} accessibilityLabel="Create account" accessibilityRole="button">
            <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Create Account'}</Text>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go to login">
            <Text style={[styles.linkText, { color: colors.mediumText }]}>Already have an account? <Text style={[styles.linkBold, { color: colors.mediumGreen }]}>Login</Text></Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.footerText, { color: colors.mutedText }]}>Your PIN is stored locally only</Text>
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
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 16 },
  errorText: { fontSize: 13, marginBottom: 16 },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  divider: { height: 1, marginVertical: 16 },
  linkText: { textAlign: 'center', fontSize: 14 },
  linkBold: { fontWeight: '600' },
  footerText: { textAlign: 'center', fontSize: 12 },
});
