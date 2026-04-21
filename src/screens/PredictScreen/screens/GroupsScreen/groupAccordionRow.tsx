import { ScoreInput } from '@app/components/scoreInput';
import { TeamItem } from '@app/components/teamItem';
import {
  GameWithResult,
  GroupWithResults,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { GroupClassificationTable } from '@app/screens/PredictScreen/screens/GroupsScreen/groupClassificationTable';
import { useTheme } from '@app/theme/ThemeContext';
import { ClassificationGroup } from '@app/types/classifications';
import { Team } from '@app/types/game';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

const GAME_ROW_HEIGHT = 50;

type Tab = 'games' | 'standings';

interface Props {
  readonly group: GroupWithResults;
  readonly classificationGroup: ClassificationGroup | undefined;
  readonly expanded: boolean;
  readonly dimmed: boolean;
  onToggle(name: string): void;
  onScoreChange(team: Team, value: number | null): void;
}

export const GroupAccordionRow: React.FC<Props> = (props: Props): React.ReactElement => {
  const { group, classificationGroup, expanded, dimmed, onToggle, onScoreChange } = props;
  const theme = useTheme();

  const [activeTab, setActiveTab] = React.useState<Tab>('games');

  const teamCount = classificationGroup?.entries.length ?? 0;
  const matchCount = group.games.length;
  const standingsRowHeight = React.useMemo((): number | undefined => {
    if (teamCount === 0) {
      return undefined;
    }
    /**
     * Calculate the height of the standings' rowhibased on match count and team count.
     * Subtract 30 for header and (teamCount - 1) for dividers
     */
    return (GAME_ROW_HEIGHT * matchCount - 30 - (teamCount - 1)) / teamCount;
  }, [matchCount, teamCount]);

  const completed = React.useMemo(
    (): number =>
      group.games.reduce(
        (acc: number, game: GameWithResult): number =>
          acc + (game.team1Score !== null && game.team2Score !== null ? 1 : 0),
        0,
      ),
    [group.games],
  );
  const total = group.games.length;
  const isComplete = total > 0 && completed === total;
  const percentage = total === 0 ? 0 : (completed / total) * 100;

  const handlePress = React.useCallback((): void => {
    onToggle(group.name);
  }, [group.name, onToggle]);

  const showGames = React.useCallback((): void => setActiveTab('games'), []);
  const showStandings = React.useCallback((): void => setActiveTab('standings'), []);

  const containerStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.container,
      borderBottomColor: theme.borderColor,
      opacity: dimmed ? 0.45 : 1,
    }),
    [dimmed, theme.borderColor],
  );

  const headerStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.header,
      backgroundColor: theme.backgroundColor,
    }),
    [theme.backgroundColor],
  );

  const titleStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.title,
      color: theme.textColor,
    }),
    [theme.textColor],
  );

  const countStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.count,
      color: theme.textColor,
    }),
    [theme.textColor],
  );

  const progressFillStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.progressFill,
      width: `${percentage}%`,
      backgroundColor: isComplete ? theme.primaryColorBright : theme.primaryColor,
    }),
    [isComplete, percentage, theme.primaryColor, theme.primaryColorBright],
  );

  const gamesTabTextStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.tabText,
      color: theme.textColor,
      opacity: activeTab === 'games' ? 1 : 0.55,
    }),
    [activeTab, theme.textColor],
  );

  const standingsTabTextStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.tabText,
      color: theme.textColor,
      opacity: activeTab === 'standings' ? 1 : 0.55,
    }),
    [activeTab, theme.textColor],
  );

  const gamesTabStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.tabButton,
      borderBottomColor: activeTab === 'games' ? theme.primaryColor : 'transparent',
    }),
    [activeTab, theme.primaryColor],
  );

  const standingsTabStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.tabButton,
      borderBottomColor: activeTab === 'standings' ? theme.primaryColor : 'transparent',
    }),
    [activeTab, theme.primaryColor],
  );

  const tabBarStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.tabBar,
      borderBottomColor: theme.borderColor,
    }),
    [theme.borderColor],
  );

  return (
    <View style={containerStyle}>
      <TouchableOpacity style={headerStyle} onPress={handlePress} activeOpacity={0.7}>
        <Text style={titleStyle}>Grupo {group.name}</Text>
        <View style={styles.progressArea}>
          <View style={styles.progressTrack}>
            <View style={progressFillStyle} />
          </View>
          <Text style={countStyle}>
            {completed}/{total}
          </Text>
          {isComplete ? (
            <FontAwesomeIcon icon={faCheck} color={theme.primaryColorBright} size={18} />
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.body}>
          <View style={tabBarStyle}>
            <TouchableOpacity style={gamesTabStyle} onPress={showGames} activeOpacity={0.7}>
              <Text style={gamesTabTextStyle}>Partidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={standingsTabStyle} onPress={showStandings} activeOpacity={0.7}>
              <Text style={standingsTabTextStyle}>Posiciones</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'games' ? (
            <View style={styles.games}>
              {group.games.map((game: GameWithResult): React.ReactElement => {
                return (
                  <View key={game.gameId} style={styles.game}>
                    <TeamItem team={game.team1} />
                    <View style={styles.inputsContainer}>
                      <ScoreInput
                        value={game.team1Score}
                        team={game.team1}
                        onChange={onScoreChange}
                      />
                      <ScoreInput
                        value={game.team2Score}
                        team={game.team2}
                        onChange={onScoreChange}
                      />
                    </View>
                    <TeamItem team={game.team2} direction="reverse" />
                  </View>
                );
              })}
            </View>
          ) : classificationGroup ? (
            <GroupClassificationTable group={classificationGroup} rowHeight={standingsRowHeight} />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    minWidth: 90,
  },
  progressArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
    marginRight: 8,
  },
  iconPlaceholder: {
    width: 18,
    height: 18,
  },
  body: {},
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  games: {
    paddingVertical: 6,
  },
  game: {
    paddingHorizontal: 20,
    height: GAME_ROW_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputsContainer: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
