import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';
import { searchCities, type City } from '../../lib/cities';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../AppText';
import { ListRow } from '../ListRow';
import { PressableScale } from '../PressableScale';

export type CityPickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: City) => void;
};

/** Offline city search: a search box over the bundled city list. */
export function CityPicker({ visible, onClose, onSelect }: CityPickerProps) {
  const { t } = useTranslation();
  const { colors, font } = useTheme();
  const [query, setQuery] = useState('');
  const results = searchCities(query);

  const close = () => {
    setQuery('');
    onClose();
  };
  const pick = (city: City) => {
    setQuery('');
    onSelect(city);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close} presentationStyle="pageSheet">
      <View style={[styles.fill, { backgroundColor: colors.bg }]}>
        <View style={styles.header}>
          <AppText variant="heading" accessibilityRole="header" style={styles.title}>{t('location.chooseCity')}</AppText>
          <PressableScale onPress={close} accessibilityRole="button" accessibilityLabel={t('common.close')} haptic={false} style={styles.close}>
            <X size={24} color={colors.text} />
          </PressableScale>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('location.searchPlaceholder')}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={t('location.searchPlaceholder')}
          autoFocus
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.input, { color: colors.text, borderColor: colors.line, backgroundColor: colors.surface, fontFamily: font('ui') }]}
        />
        <FlatList
          data={results}
          keyExtractor={(c) => `${c.name}|${c.country}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ListRow title={item.name} value={item.country} onPress={() => pick(item)} />}
          ListEmptyComponent={
            <AppText variant="small" muted center style={styles.empty}>
              {query.trim() ? t('location.noResults') : t('location.searchHint')}
            </AppText>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52 },
  title: { flex: 1 },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: { minHeight: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontSize: 17, marginBottom: 8 },
  list: { paddingBottom: 40 },
  empty: { marginTop: 24 },
});
