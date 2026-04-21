import React from 'react';
import { View } from 'react-native';

interface Props {
  readonly trailing?: boolean;
}

export const ListDivider: React.FC<Props> = (props: Props): React.ReactElement | null => {
  if (props.trailing) {
    return null;
  }

  return <View style={style} />;
};

const style = { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' };
