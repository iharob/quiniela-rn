import { flags } from '@app/flags';
import { useTheme } from '@app/theme/ThemeContext';
import { Team } from '@app/types/game';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface Props {
  readonly team: Team;
  readonly orientation?: 'vertical' | 'horizontal';
  readonly direction?: 'normal' | 'reverse';
  readonly variant?: 'light' | 'dark';
  readonly strikethrough?: boolean;
}

function EmptyFlag(): React.ReactElement {
  return <></>;
}

export const TeamItem: React.FC<Props> = (props: Props): React.ReactElement => {
  const {
    team,
    direction = 'normal',
    orientation = 'horizontal',
    variant = 'dark',
    strikethrough = false,
  } = props;
  const { country, name } = team;
  const theme = useTheme();

  const Flag = React.useMemo((): React.FunctionComponent<{
    readonly width: number;
    readonly height: number;
  }> => {
    if (flags[country] === undefined) {
      console.error(`cannot find the flag for: ${country}`);

      return EmptyFlag;
    }
    return flags[country];
  }, [country]);

  const layoutStyle = React.useMemo((): ViewStyle => {
    switch (orientation) {
      case 'vertical':
        return direction === 'normal' ? styles.vertical : styles.verticalReverse;
      default:
        return direction === 'normal' ? styles.normal : styles.reverse;
    }
  }, [direction, orientation]);

  const dynamicStyle = React.useMemo((): StyleProp<TextStyle> => {
    const orientationStyle = (): TextStyle => {
      switch (orientation) {
        case 'vertical':
          return styles.alignCenter;
        case 'horizontal':
          return direction === 'normal' ? styles.alignLeft : styles.alignRight;
      }
    };

    const variantStyle = (): TextStyle => {
      switch (variant) {
        case 'light':
          return { color: theme.contrastTextColor };
        case 'dark':
        default:
          return { color: theme.textColor };
      }
    };

    return [orientationStyle(), variantStyle()];
  }, [direction, orientation, theme.contrastTextColor, theme.textColor, variant]);

  const teamNameStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.teamName,
      color: theme.textColor,
      textDecorationLine: strikethrough ? 'line-through' : 'none',
    }),
    [strikethrough, theme.textColor],
  );

  if (country === 'NA') {
    return (
      <View style={[styles.team, layoutStyle]}>
        <View style={styles.flagContainer}>
          <View style={[styles.flag, styles.emptyFlag]}>
            <Text style={styles.flagQuestionMark}>?</Text>
          </View>
        </View>
        <Text style={[teamNameStyle, styles.teamNameUnknown, dynamicStyle]} numberOfLines={1}>
          {name}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.team, layoutStyle]}>
        <View style={styles.flagContainer}>
          <Flag width={24} height={18} />
        </View>
        <Text style={[teamNameStyle, dynamicStyle]} numberOfLines={1}>
          {name}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  vertical: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalReverse: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normal: {
    flexDirection: 'row',
    height: 24,
  },
  reverse: {
    flexDirection: 'row-reverse',
    height: 24,
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignLeft: {
    textAlign: 'left',
  },
  alignRight: {
    textAlign: 'right',
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    marginHorizontal: 5,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  teamNameUnknown: {
    opacity: 0.25,
  },
  flagContainer: {
    height: 18,
    width: 24,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flag: {
    height: 18,
    width: 24,
  },
  emptyFlag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagQuestionMark: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
