/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

interface Props {
  readonly score: number | null;
  readonly difference: number;
}

export const ScoreCell: React.FC<Props> = (props: Props): React.ReactElement => {
  const { score, difference } = props;
  const theme = useTheme();

  const changeStyle = React.useMemo((): TextStyle => {
    if (difference > 0) {
      return { color: '#11af30' };
    } else if (difference < 0) {
      return { color: '#cf013e' };
    } else {
      return { display: 'none' };
    }
  }, [difference]);

  const valueStyle = React.useMemo((): TextStyle | undefined => {
    if (score === 0) {
      return { opacity: 0.3 };
    } else {
      return undefined;
    }
  }, [score]);

  const scoreTextStyle = React.useMemo(
    (): TextStyle => ({ ...styles.scoreText, color: theme.textColor }),
    [theme.textColor],
  );

  return (
    <View style={styles.container}>
      <Text style={[scoreTextStyle, valueStyle]}>{score}</Text>
      <Text style={[styles.changeText, changeStyle]}>{differenceFormatter.format(difference)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: 50,
  },
  changeText: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 12,
    lineHeight: 12,
    width: 16,
    textAlign: 'center',
    height: 12,
    fontSize: 11,
    zIndex: 0,
  },
  scoreText: {
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
  },
});

const differenceFormatter = Intl.NumberFormat(undefined, {
  // @ts-ignore
  signDisplay: 'always',
  maximumFractionDigits: 0,
});
