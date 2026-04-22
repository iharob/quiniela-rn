import { GameGroup } from '@app/components/gameGroup';
import { ListDivider } from '@app/components/listDivider';
import { NextButton } from '@app/components/nextButton';
import { SIMULATE } from '@app/config';
import { barStyleLightContent } from '@app/constants';
import { useKnockoutPhaseStore } from '@app/mobx/konckoutStore';
import { PredictionStackParamsList } from '@app/screens/PredictScreen';
import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { useTheme } from '@app/theme/ThemeContext';
import { Team } from '@app/types/game';
import { getWinner } from '@app/utils';
import { buildNextRoundGames, findRound, pairGamesByFeeders } from '@app/utils/brackets';
import { simulatePair } from '@app/utils/simulate';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, ListRenderItemInfo, StatusBar, StyleSheet, View } from 'react-native';

interface Props {
  readonly games: ReadonlyArray<[GameWithResult, GameWithResult]>;
  readonly round: number;
}

export const KnockoutRoundView: React.FC<Props> = observer((props: Props): React.ReactElement => {
  const { games, round } = props;

  const navigation = useNavigation<NativeStackNavigationProp<PredictionStackParamsList>>();
  const theme = useTheme();
  const knockoutStore = useKnockoutPhaseStore();

  const [pairs, setPairs] = React.useState<ReadonlyArray<[GameWithResult, GameWithResult]>>(
    (): ReadonlyArray<[GameWithResult, GameWithResult]> => {
      const saved = knockoutStore.rounds[round];
      const local = saved && saved.length > 0 ? saved : games;

      if (SIMULATE) {
        return local.map(simulatePair);
      }

      return local;
    },
  );

  const onScoreChange = React.useCallback(
    (team: Team, value: number | null): void => {
      const updatedGroups = pairs.map(
        (currentGroup: [GameWithResult, GameWithResult]): [GameWithResult, GameWithResult] => {
          const [game1, game2] = currentGroup;

          if (game1.team1.country === team.country) {
            return [{ ...game1, team1Score: value, winner: undefined }, game2];
          } else if (game1.team2.country === team.country) {
            return [{ ...game1, team2Score: value, winner: undefined }, game2];
          } else if (game2.team1.country === team.country) {
            return [game1, { ...game2, team1Score: value, winner: undefined }];
          } else if (game2.team2.country === team.country) {
            return [game1, { ...game2, team2Score: value, winner: undefined }];
          } else {
            return currentGroup;
          }
        },
      );

      setPairs(updatedGroups);
    },
    [pairs],
  );

  const onWinnerSelected = React.useCallback(
    (winner: Team): void => {
      const updatedGroups = pairs.map(
        (currentGroup: [GameWithResult, GameWithResult]): [GameWithResult, GameWithResult] => {
          const [game1, game2] = currentGroup;

          if (game1.team1.country === winner.country) {
            return [{ ...game1, winner: winner }, game2];
          } else if (game1.team2.country === winner.country) {
            return [{ ...game1, winner: winner }, game2];
          } else if (game2.team1.country === winner.country) {
            return [game1, { ...game2, winner: winner }];
          } else if (game2.team2.country === winner.country) {
            return [game1, { ...game2, winner: winner }];
          } else {
            return currentGroup;
          }
        },
      );

      setPairs(updatedGroups);
    },
    [pairs],
  );

  const renderItem = React.useCallback(
    ({ item: group }: ListRenderItemInfo<[GameWithResult, GameWithResult]>): React.ReactElement => {
      const key = groupKey(group);

      return (
        <GameGroup
          key={key}
          group={group}
          onWinnerSelected={onWinnerSelected}
          onChange={onScoreChange}
        />
      );
    },
    [onScoreChange, onWinnerSelected],
  );

  const total = games.reduce(
    (total: number, _: [GameWithResult, GameWithResult]): number => total + 2,
    0,
  );

  const completed = pairs.reduce(
    (total: number, pair: [GameWithResult, GameWithResult]): number => {
      const [game1, game2] = pair;

      const winner1 = getWinner(game1);
      const winner2 = getWinner(game2);

      return total + (winner1.country === 'NA' ? 0 : 1) + (winner2.country === 'NA' ? 0 : 1);
    },
    0,
  );

  const handleNext = React.useCallback((): void => {
    knockoutStore.update(round, pairs);

    const nextApiRound = round - 1;
    const nextRound = findRound(knockoutStore.bracketFixtures, nextApiRound);
    if (!nextRound) {
      console.error(`No bracket fixtures found for round ${nextApiRound}`);
      return;
    }

    const nextGames = buildNextRoundGames(pairs, nextRound.matches);

    if (nextGames.length === 1) {
      navigation.navigate('Final', nextGames[0]);
      return;
    }

    const roundAfterNext = findRound(knockoutStore.bracketFixtures, nextApiRound - 1);
    if (!roundAfterNext) {
      console.error(`No bracket fixtures found for round ${nextApiRound - 1}`);
      return;
    }

    const nextRoundPairs = pairGamesByFeeders(nextGames, roundAfterNext.matches);
    const simulatedPairs = SIMULATE ? nextRoundPairs.map(simulatePair) : nextRoundPairs;

    navigation.push('Knockout', {
      round: nextApiRound,
      games: simulatedPairs,
    });
  }, [knockoutStore, pairs, navigation, round]);

  React.useEffect((): void => {
    const round = rounds[total] ?? { name: '-' };

    navigation.setOptions({
      title: `${round.name} ${completed}/${total}`,
    });
  }, [completed, navigation, total]);

  return (
    <View style={styles.container}>
      <FlatList renderItem={renderItem} ItemSeparatorComponent={ListDivider} data={pairs} />
      <View style={styles.footer}>
        <NextButton disabled={total !== completed} onNext={handleNext} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});

const rounds: Record<number, { readonly name: string }> = {
  16: { name: 'Dieciseisavos' },
  8: { name: 'Octavos' },
  4: { name: 'Cuartos' },
  2: { name: 'Semi-Final' },
  1: { name: 'Final' },
};

const groupKey = (group: [GameWithResult, GameWithResult]): string => {
  const [game1, game2] = group;
  const {
    team1: { country: country1 },
    team2: { country: country2 },
  } = game1;
  const {
    team1: { country: country3 },
    team2: { country: country4 },
  } = game2;

  return [country1, country2, country3, country4].join('');
};
