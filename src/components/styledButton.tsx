import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  readonly label: string;
  readonly disabled?: boolean;

  onPress?(): void;
}

export const StyledButton: React.FC<Props> = (props: Props): React.ReactElement => {
  const { disabled = false, onPress } = props;
  const theme = useTheme();

  const buttonTextStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.actionButtonText,
      backgroundColor: theme.primaryColorBright,
      color: theme.contrastTextColor,
    }),
    [theme.primaryColorBright, theme.contrastTextColor],
  );

  const buttonStyle = React.useMemo(
    (): StyleProp<ViewStyle> => [
      styles.actionButton,
      disabled ? styles.actionButtonDisabled : undefined,
    ],
    [disabled],
  );

  return (
    <TouchableOpacity style={buttonStyle} disabled={disabled} onPress={onPress}>
      <Text style={buttonTextStyle}>Aceptar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  actionButtonDisabled: {
    opacity: 0.25,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 16,
    elevation: 0,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});
