import { defaultRules } from '@app/rules';
import { useTheme } from '@app/theme/ThemeContext';
import { faTimes, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RulesModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }): React.ReactElement => {
  const theme = useTheme();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: theme.cardColor }]}>
          <Text style={[styles.title, { color: theme.contrastTextColor }]}>
            Reglas de puntuación
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={hitSlop} style={styles.closeButton}>
            <FontAwesomeIcon icon={faTimes} size={20} color={theme.contrastTextColor} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          {defaultRules.map(
            (rule, index): React.ReactElement => (
              <View key={index} style={[styles.ruleRow, { borderBottomColor: theme.borderColor }]}>
                <View style={styles.ruleContent}>
                  <Text style={[styles.descriptionText, { color: theme.textColor }]}>
                    {rule.description}
                  </Text>
                </View>
                <View style={[styles.valueBadge, { backgroundColor: theme.cardColor }]}>
                  <Text style={[styles.valueText, { color: theme.contrastTextColor }]}>
                    +{rule.value}
                  </Text>
                </View>
              </View>
            ),
          )}
          <View style={styles.footer}>
            <FontAwesomeIcon
              icon={faTrophy}
              size={18}
              color={theme.primaryColor}
              style={styles.footerIcon}
            />
            <Text style={[styles.footerText, { color: theme.textColor }]}>
              El participante con más puntos al finalizar el torneo gana la quiniela. Lógicamente.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingVertical: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  ruleContent: {
    flex: 1,
    paddingRight: 16,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 21,
  },
  valueBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 48,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  footerIcon: {
    marginRight: 10,
    opacity: 0.6,
  },
  footerText: {
    fontSize: 13,
    opacity: 0.55,
    flex: 1,
    lineHeight: 18,
  },
});
