import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  readonly added: number;
  readonly total: number;
}

export const ListItemBase: React.FC<React.PropsWithChildren<Props>> = (
  props: React.PropsWithChildren<Props>,
): React.ReactElement => {
  const { added, total } = props;
  const { children } = props;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>{children}</View>

      <View style={styles.pointsContainer}>
        {added === 0 ? (
          <Text style={styles.dimmedText}>&mdash;</Text>
        ) : (
          <Text style={styles.textRight}>+{added}</Text>
        )}
      </View>
      <View style={styles.pointsContainer}>
        {added === 0 ? (
          <Text style={styles.dimmedText}>{total}</Text>
        ) : (
          <Text style={styles.textRight}>{total}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderStyle: 'solid',
    borderTopColor: '#d0d0d0',
    borderTopWidth: 1,
    marginTop: -1,
  },
  leftContainer: {
    overflow: 'hidden',
    paddingRight: 12,
    flex: 1,
  },
  pointsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    width: 40,
  },
  textRight: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  dimmedText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    opacity: 0.25,
  },
});
