import ResultAndPrediction from '@app/screens/ParticipantsScreen/screens/ScoreDetails/resultAndPrediction';
import {
  PointsDetails,
  PredictedResult,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { TournamentTheme } from '@app/types/tournamentConfig';
import { FontAwesomeIconStyle } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { SectionListData, SectionListRenderItemInfo, TextStyle } from 'react-native';

export interface SectionType extends SectionListData<PredictedResult> {
  readonly sortKey: string;
  readonly title: string;
  readonly data: readonly PredictedResult[];
  readonly round: number;
}
const sortSections = (a: SectionType, b: SectionType): number => {
  return a.sortKey.localeCompare(b.sortKey);
};

export const computeSections = (pointsDetails: PointsDetails): readonly SectionType[] => {
  const { groups, knockout } = pointsDetails;
  const rounds: Record<string, string> = {
    2: 'Dieciseisavos de final',
    3: 'Octavos de final',
    4: 'Cuartos de final',
    5: 'Semi-final',
    6: 'Final',
  };

  const groupsSections = Object.entries(
    groups.reduce(
      (
        grouped: Record<string, readonly PredictedResult[]>,
        result: PredictedResult,
      ): Record<string, readonly PredictedResult[]> => {
        const group = result.classificationGroup;

        if (grouped[group]) {
          return { ...grouped, [group]: [...grouped[group], result] };
        } else {
          return { ...grouped, [group]: [result] };
        }
      },
      {} as Record<string, readonly PredictedResult[]>,
    ),
  )
    .map(
      ([groupName, results]: [string, readonly PredictedResult[]]): SectionType => ({
        sortKey: groupName,
        title: `Grupo ${groupName}`,
        round: 1,
        data: results,
      }),
    )
    .sort(sortSections);

  const knockoutSections = Object.entries(
    knockout.reduce(
      (
        byRound: Record<number, readonly PredictedResult[]>,
        result: PredictedResult,
      ): Record<number, readonly PredictedResult[]> => {
        if (byRound[result.round]) {
          return {
            ...byRound,
            [result.round]: [...(byRound[result.round] || []), result],
          };
        } else {
          return {
            ...byRound,
            [result.round]: [result],
          };
        }
      },
      {},
    ),
  ).map(
    ([round, results]: [string, readonly PredictedResult[]]): SectionType => ({
      sortKey: `${round}`,
      title: rounds[round],
      round: Number(round),
      data: results,
    }),
  );

  const finalSection: readonly SectionType[] =
    pointsDetails.final != null
      ? [
          {
            sortKey: '6',
            title: rounds['6'],
            round: 6,
            data: [pointsDetails.final],
          },
        ]
      : [];

  return [...groupsSections, ...knockoutSections, ...finalSection];
};

export const renderItem = ({
  item,
}: SectionListRenderItemInfo<PredictedResult, SectionType>): React.ReactElement => {
  return <ResultAndPrediction item={item} />;
};

export const themedHeaderIcon = (theme: TournamentTheme): FontAwesomeIconStyle => ({
  color: theme.textColor,
});

export const themedHeaderText = (theme: TournamentTheme): TextStyle => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: undefined,
  backgroundColor: 'transparent',
  color: theme.textColor,
});

export const keyExtractor = (item: PredictedResult): string => {
  return `${item.round}-${item.predictedTeam1.country}-${item.predictedTeam2.country}`;
};
