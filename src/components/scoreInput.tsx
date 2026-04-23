import { useTheme } from '@app/theme/ThemeContext';
import { Team } from '@app/types/game';
import React from 'react';
import { TextInput, TextStyle } from 'react-native';

interface Props {
  readonly value: number | null;
  readonly team: Team;

  onChange(team: Team, value: number | null): void;
}

export const ScoreInput: React.FC<Props> = (
  props: Props,
): React.ReactElement => {
  const [hasFocus, setHasFocus] = React.useState<boolean>(false);
  const { value, team, onChange } = props;
  const theme = useTheme();

  const handleTextChange = React.useCallback(
    (previousValue: string): void => {
      if (previousValue.trim() === '') {
        onChange(team, null);
        return;
      }

      const numeric = Number(previousValue);
      if (!isNaN(numeric)) {
        onChange(team, numeric);
      }
    },
    [onChange, team],
  );

  const stringValue = React.useMemo(
    (): string => value?.toString() ?? '',
    [value],
  );

  const handleFocus = React.useCallback((): void => setHasFocus(true), []);
  const handleBlur = React.useCallback((): void => setHasFocus(false), []);

  const baseStyle = React.useMemo(
    (): TextStyle => ({
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderColor: theme.textColor,
      borderWidth: 1,
      borderStyle: 'solid',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      marginHorizontal: 4,
      padding: 0,
      width: 30,
      height: 30,
      borderRadius: 5,
      color: theme.textColor,
    }),
    [theme.textColor],
  );

  const computedStyle = React.useMemo((): TextStyle => {
    if (!hasFocus) {
      return baseStyle;
    } else {
      return {
        ...baseStyle,
        borderWidth: 2,
        borderColor: theme.primaryColor,
      };
    }
  }, [baseStyle, hasFocus, theme.primaryColor]);

  return (
    <TextInput
      value={stringValue}
      placeholderTextColor={theme.placeholderTextColor}
      placeholder="0"
      style={computedStyle}
      keyboardType="numeric"
      // returnKeyType={returnKeyType}
      // blurOnSubmit={returnKeyType === 'done'}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChangeText={handleTextChange}
      // onSubmitEditing={onSubmitEditing}
    />
  );
};

ScoreInput.displayName = 'ScoreInput';
