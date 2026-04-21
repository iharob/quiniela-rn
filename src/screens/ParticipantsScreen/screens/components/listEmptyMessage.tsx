import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

interface Props {
  readonly message: string;
  readonly error?: boolean;
}

export const ListEmptyMessage: React.FC<Props> = (props: Props): React.ReactElement => {
  const { message, error = false } = props;
  const theme = useTheme();

  const emptyViewStyle = React.useMemo(
    (): TextStyle => ({ ...styles.emptyView, color: theme.borderColor }),
    [theme.borderColor],
  );

  return (
    <View style={styles.emptyViewContainer}>
      <Text style={emptyViewStyle}>{message}</Text>
      {error ? <Text style={emptyViewStyle}>Desliza hacia abajo para refrescar</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyViewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyView: {
    fontStyle: 'italic',
  },
});
