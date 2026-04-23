import { defaultRules } from '@app/rules';
import { useTheme } from '@app/theme/ThemeContext';
import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const RulesModal: React.FC = (): React.ReactElement => {
  const navigation = useNavigation();
  const theme = useTheme();
  const themedStyles = useThemedStyles(themedStylesFactory);

  React.useEffect((): void => {
    navigation.setOptions({
      title: 'Reglas',
      headerRight: () => null,
    });
  }, [navigation]);

  return (
    <View style={themedStyles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={themedStyles.sectionLabel}>Puntuación</Text>
        <View style={themedStyles.card}>
          {defaultRules.map(
            (rule, index): React.ReactElement => (
              <View key={index}>
                {index > 0 && <View style={themedStyles.divider} />}
                <View style={styles.ruleRow}>
                  <Text style={themedStyles.descriptionText}>
                    {rule.description}
                  </Text>
                  <View style={themedStyles.valueBadge}>
                    <Text style={themedStyles.valueText}>+{rule.value}</Text>
                  </View>
                </View>
              </View>
            ),
          )}
        </View>
        <View style={styles.footer}>
          <FontAwesomeIcon
            icon={faTrophy}
            size={15}
            color={theme.primaryColor}
            style={styles.footerIcon}
          />
          <Text style={themedStyles.footerText}>
            El participante con más puntos al finalizar el torneo gana la
            quiniela. Lógicamente.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: theme.textColor,
      opacity: 0.45,
      marginHorizontal: 22,
      marginBottom: 10,
    },
    card: {
      backgroundColor: theme.dimmedCardColor,
      borderRadius: 14,
      marginHorizontal: 16,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderColor,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.borderColor,
      marginLeft: 18,
    },
    descriptionText: {
      flex: 1,
      paddingRight: 14,
      fontSize: 14.5,
      lineHeight: 20,
      color: theme.textColor,
      opacity: 0.82,
    },
    valueBadge: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      minWidth: 38,
      alignItems: 'center',
      backgroundColor: theme.borderColor,
    },
    valueText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.primaryColor,
      opacity: 0.85,
    },
    footerText: {
      fontSize: 13,
      flex: 1,
      lineHeight: 18,
      color: theme.textColor,
      opacity: 0.5,
    },
  });

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingBottom: 28,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 4,
  },
  footerIcon: {
    marginRight: 10,
    opacity: 0.5,
  },
});
