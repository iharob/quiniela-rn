import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Props {
  readonly name: string;
  readonly size?: number;
  readonly uri?: string | null;
}

const avatarColors = [
  '#e57373',
  '#f06292',
  '#ba68c8',
  '#9575cd',
  '#7986cb',
  '#64b5f6',
  '#4fc3f7',
  '#4dd0e1',
  '#4db6ac',
  '#81c784',
  '#aed581',
  '#ff8a65',
  '#a1887f',
  '#90a4ae',
] as const;

const getColorForName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    // Claude s a bitch I think
    // eslint-disable-next-line no-bitwise
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar: React.FC<Props> = ({
  name,
  size = 36,
  uri,
}: Props): React.ReactElement => {
  const backgroundColor = React.useMemo(() => getColorForName(name), [name]);
  const initials = React.useMemo(() => getInitials(name), [name]);

  const containerStyle = React.useMemo(
    () => ({
      ...styles.container,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
    }),
    [size, backgroundColor],
  );

  const textStyle = React.useMemo(
    () => ({
      ...styles.initials,
      fontSize: size * 0.4,
    }),
    [size],
  );

  const imageStyle = React.useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: size / 2,
    }),
    [size],
  );

  if (uri) {
    return <Image source={{ uri }} style={imageStyle} />;
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});
