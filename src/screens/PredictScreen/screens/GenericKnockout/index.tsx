import { KnockoutRoundView } from '@app/components/knockoutRound';
import { PredictionStackParamsList } from '@app/screens/PredictScreen';
import { RouteProp } from '@react-navigation/native';
import React from 'react';

interface Props {
  readonly route: RouteProp<PredictionStackParamsList, 'Knockout'>;
}

export const GenericKnockout: React.FC<Props> = (props: Props): React.ReactElement => {
  const { route } = props;
  const { games, round } = route.params;

  return <KnockoutRoundView games={games} round={round} />;
};
