import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '@/lib/theme';
import { DUA_CATEGORIES } from '@/constants/duas';
import { DuaItem } from '@/lib/types';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react-native';

export default function DuasScreen() {
  const { colors } = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('morning');
  const [expandedDua, setExpandedDua] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const toggleDua = (title: string) => {
    setExpandedDua(expandedDua === title ? null : title);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Duas Library', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.intro, { color: colors.mediumText }]}>Authentic duas from the Quran and Sunnah for every occasion</Text>

          {DUA_CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
              <TouchableOpacity
                style={[styles.categoryHeader, { backgroundColor: colors.cardBackground }]}
                onPress={() => toggleCategory(category.id)}
                accessibilityLabel={`${category.title} - ${expandedCategory === category.id ? 'collapse' : 'expand'}`}
                accessibilityRole="button"
              >
                <View style={styles.categoryInfo}>
                  <BookOpen size={18} color={colors.mediumGreen} />
                  <View>
                    <Text style={[styles.categoryTitle, { color: colors.darkText }]}>{category.title}</Text>
                    <Text style={[styles.categoryArabic, { color: colors.gold }]}>{category.titleArabic}</Text>
                  </View>
                </View>
                <Text style={[styles.categoryCount, { color: colors.mutedText }]}>{category.duas.length} duas</Text>
                {expandedCategory === category.id
                  ? <ChevronUp size={18} color={colors.mutedText} />
                  : <ChevronDown size={18} color={colors.mutedText} />}
              </TouchableOpacity>

              {expandedCategory === category.id && (
                <View style={[styles.duasContainer, { backgroundColor: colors.cardBackground }]}>
                  {category.duas.map((dua) => (
                    <DuaCard key={dua.title} dua={dua} isExpanded={expandedDua === dua.title} onToggle={() => toggleDua(dua.title)} colors={colors} />
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function DuaCard({ dua, isExpanded, onToggle, colors }: { dua: DuaItem; isExpanded: boolean; onToggle: () => void; colors: any }) {
  return (
    <TouchableOpacity style={[styles.duaCard, { borderBottomColor: colors.border }]} onPress={onToggle} accessibilityLabel={`${dua.title} - tap to ${isExpanded ? 'collapse' : 'expand'}`} accessibilityRole="button">
      <View style={styles.duaHeader}>
        <View>
          <Text style={[styles.duaTitle, { color: colors.darkText }]}>{dua.title}</Text>
          <Text style={[styles.duaTitleArabic, { color: colors.gold }]}>{dua.titleArabic}</Text>
        </View>
        {isExpanded ? <ChevronUp size={16} color={colors.mutedText} /> : <ChevronDown size={16} color={colors.mutedText} />}
      </View>
      {isExpanded && (
        <View style={styles.duaContent}>
          <Text style={[styles.duaArabic, { color: colors.primaryGreen }]}>{dua.arabic}</Text>
          <Text style={[styles.duaTransliteration, { color: colors.mediumText }]}>{dua.transliteration}</Text>
          <Text style={[styles.duaTranslation, { color: colors.darkText }]}>{dua.translation}</Text>
          {dua.source && <Text style={[styles.duaSource, { color: colors.gold }]}>Source: {dua.source}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16 },
  intro: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  categoryContainer: { marginBottom: 12 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: 14 },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  categoryTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  categoryArabic: { fontSize: 13 },
  categoryCount: { fontSize: 12, marginRight: 8 },
  duasContainer: { borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  duaCard: { padding: 14, borderBottomWidth: 1 },
  duaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  duaTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  duaTitleArabic: { fontSize: 13 },
  duaContent: { marginTop: 12 },
  duaArabic: { fontSize: 20, fontWeight: '600', textAlign: 'center', lineHeight: 32, marginBottom: 10 },
  duaTransliteration: { fontSize: 13, fontStyle: 'italic', textAlign: 'center', marginBottom: 8, lineHeight: 20 },
  duaTranslation: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  duaSource: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
});
