import { Game } from '@app/components/game';
import { TeamItem } from '@app/components/teamItem';
import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { useTheme } from '@app/theme/ThemeContext';
import { Team } from '@app/types/game';
import { getWinner } from '@app/utils';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  readonly group: readonly [GameWithResult, GameWithResult];

  onWinnerSelected(team: Team): void;
  onChange(team: Team, value: number | null): void;
}

export const GameGroup: React.FC<Props> = (
  props: Props,
): React.ReactElement => {
  const { group, onChange, onWinnerSelected } = props;
  const theme = useTheme();

  const [game1, game2] = group;
  const [winner1, winner2] = React.useMemo((): [Team, Team] => {
    return [getWinner(group[0]), getWinner(group[1])];
  }, [group]);

  const linkStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.link,
      borderRightColor: theme.borderColor,
      borderLeftColor: theme.backgroundColor,
    }),
    [theme.borderColor, theme.backgroundColor],
  );

  const topLinkStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.topLink,
      borderTopColor: theme.borderColor,
      borderBottomColor: theme.backgroundColor,
    }),
    [theme.borderColor, theme.backgroundColor],
  );

  const bottomLinkStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.bottomLink,
      borderBottomColor: theme.borderColor,
      borderTopColor: theme.backgroundColor,
    }),
    [theme.borderColor, theme.backgroundColor],
  );

  return (
    <View style={styles.group}>
      <View style={styles.pair}>
        <Game
          game={game1}
          winner={winner1}
          onWinnerSelected={onWinnerSelected}
          onChange={onChange}
        />
        <Game
          game={game2}
          winner={winner2}
          onWinnerSelected={onWinnerSelected}
          onChange={onChange}
        />
      </View>
      <View style={[styles.game, styles.result]}>
        <View style={[linkStyle, topLinkStyle]} />
        <View style={styles.teamContainer}>
          <TeamItem team={winner1} />
        </View>
        <View style={styles.teamContainer}>
          <TeamItem team={winner2} />
        </View>
        <View style={[linkStyle, bottomLinkStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  result: {
    flex: 0.5,
    marginLeft: -10,
  },
  link: {
    position: 'absolute',
    width: '40%',
    height: 12,
    borderWidth: 3,
    borderStyle: 'solid',
  },
  topLink: {
    top: -8,
    borderStyle: 'solid',
    borderTopRightRadius: 4,
  },
  bottomLink: {
    bottom: -8,
    borderStyle: 'solid',
    borderBottomRightRadius: 4,
  },
  group: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pair: {
    flex: 1,
    paddingVertical: 13,
  },
  game: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    alignItems: 'center',
  },
});
