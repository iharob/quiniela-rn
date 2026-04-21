import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export const ListItemSeparator: React.FC = (): React.ReactElement => {
  const theme = useTheme();

  const separatorStyle = React.useMemo(
    (): ViewStyle => ({ ...styles.itemSeparator, backgroundColor: theme.borderColor }),
    [theme.borderColor],
  );

  return <View style={separatorStyle} />;
};

const styles = StyleSheet.create({
  itemSeparator: {
    height: 1,
    width: '100%',
    opacity: 0.5,
  },
});
