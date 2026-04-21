// Automatically Generated 13/06/24 15:57:56
import React from 'react';
import { StyleProp, Image, ImageStyle } from 'react-native';

interface Props {
  readonly height: number;
  readonly width: number;
}

const Flag: React.FC<Props> = React.memo(
  function Flag({ width, height }: Props): React.ReactElement {
    const style = React.useMemo((): StyleProp<ImageStyle> => ({ height, width }), [height, width]);

    return (
      <Image
        source={require('./pk.png')}
        style={style}
      />
    );
  },
  (previous: Props, current: Props): boolean =>
    previous.width !== current.width || previous.height !== current.height,
);

export default Flag;
