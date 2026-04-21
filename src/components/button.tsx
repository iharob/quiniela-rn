import { buttonHeight } from '@app/constants';
import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  readonly title: string;
  onPress?(): void;
}

export const Button: React.FC<Props> = (props: Props): React.ReactElement => {
  const { title, onPress } = props;
  const theme = useTheme();

  const disabled = React.useMemo((): boolean => !onPress, [onPress]);

  const containerStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.container,
      backgroundColor: theme.primaryColor,
    }),
    [theme.primaryColor],
  );

  return (
    <TouchableOpacity
      style={[containerStyle, disabled ? styles.disabled : undefined]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.userNameText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    height: buttonHeight,
    marginBottom: 8,
    minWidth: 160,
    maxWidth: Dimensions.get('window').width - 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  userNameText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    color: 'white',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.2,
    backgroundColor: 'black',
    elevation: 0,
  },
});
