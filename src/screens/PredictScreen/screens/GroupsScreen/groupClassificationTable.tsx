import { TeamItem } from '@app/components/teamItem';
import { useTheme } from '@app/theme/ThemeContext';
import { ClassificationEntry, ClassificationGroup } from '@app/types/classifications';
import { computePoints } from '@app/types/points.ts/points';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Props {
  readonly group: ClassificationGroup;
  readonly rowHeight?: number;
}

export const GroupClassificationTable: React.FC<Props> = (props: Props): React.ReactElement => {
  const { group, rowHeight } = props;
  const theme = useTheme();

  const rowStyle = React.useMemo((): ViewStyle => {
    return rowHeight !== undefined ? { ...styles.row, height: rowHeight } : styles.row;
  }, [rowHeight]);

  const valueStyle = React.useMemo(
    (): TextStyle => ({ ...styles.value, color: theme.textColor }),
    [theme.textColor],
  );

  const headerValueStyle = React.useMemo(
    (): TextStyle => ({ ...valueStyle, ...styles.headerText }),
    [valueStyle],
  );

  const renderRow = React.useCallback(
    (
      entry: ClassificationEntry,
      index: number,
      entries: readonly ClassificationEntry[],
    ): React.ReactElement => (
      <>
        <View key={entry.team.country} style={rowStyle}>
          <View style={styles.team}>
            <TeamItem team={entry.team} />
          </View>
          <View style={styles.data}>
            <Text style={valueStyle}>{computePoints(entry)}</Text>
            <Text style={[valueStyle, styles.secondary]}>{entry.played}</Text>
            <Text style={[valueStyle, styles.secondary]}>{entry.won}</Text>
            <Text style={[valueStyle, styles.secondary]}>{entry.drawn}</Text>
            <Text style={[valueStyle, styles.secondary]}>{entry.lost}</Text>
            <Text style={[valueStyle, styles.secondary]}>{entry.goalsScored}</Text>
            <Text style={[valueStyle, styles.secondary]}>{entry.goalsReceived}</Text>
            <Text style={[valueStyle, styles.secondary]}>
              {entry.goalsScored - entry.goalsReceived}
            </Text>
          </View>
        </View>
        {index < entries.length - 1 ? <View style={styles.separator} /> : null}
      </>
    ),
    [rowStyle, valueStyle],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.team}>
          <Text style={[headerValueStyle, styles.leftAligned]}>EQUIPO</Text>
        </View>
        <View style={styles.data}>
          <Text style={headerValueStyle}>PTS</Text>
          <Text style={headerValueStyle}>J</Text>
          <Text style={headerValueStyle}>G</Text>
          <Text style={headerValueStyle}>E</Text>
          <Text style={headerValueStyle}>P</Text>
          <Text style={headerValueStyle}>GA</Text>
          <Text style={headerValueStyle}>GR</Text>
          <Text style={headerValueStyle}>+/-</Text>
        </View>
      </View>
      {group.entries.map(renderRow)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    height: 30,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  team: {
    width: 140,
  },
  leftAligned: {
    textAlign: 'left',
  },
  data: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  value: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
  },
  headerText: {
    fontWeight: '800',
    opacity: 0.75,
    fontSize: 11,
  },
  secondary: {
    opacity: 0.65,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
});
