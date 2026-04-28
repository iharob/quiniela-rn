import { Avatar } from '@app/components/Avatar';
import { TeamItem } from '@app/components/teamItem';
import { ListItemSeparator } from '@app/elements/listItemSeparator';
import { useOngoing } from '@app/hooks/queries';
import { useSessionStore } from '@app/mobx/sessionStore';
import { ListEmptyMessage } from '@app/screens/ParticipantsScreen/screens/components/listEmptyMessage';
import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';
import {
  GameResultGroup,
  LiveScore,
  SelfResult,
  UserResult,
} from '@app/types/userResults';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Row =
  | { readonly kind: 'live'; readonly live: LiveScore }
  | { readonly kind: 'user'; readonly result: UserResult };

type SectionMeta = Omit<GameResultGroup & SelfResult, 'groupResults'>;
type Section = SectionListData<Row, SectionMeta>;

const isExactMatch = (
  result: UserResult,
  live: LiveScore | undefined,
): boolean =>
  live !== undefined &&
  result.team1Score === live.team1Score &&
  result.team2Score === live.team2Score;

export const Ongoing: React.FC = (): React.ReactElement => {
  const sessionStore = useSessionStore();
  const { data: results = [], isFetching, refetch } = useOngoing();
  const currentUserId = sessionStore.session?.userId ?? -1;
  const themedStyles = useThemedStyles(themedStylesFactory);

  const handleRefresh = React.useCallback((): void => {
    refetch();
  }, [refetch]);

  const sections = React.useMemo(
    (): ReadonlyArray<Section> =>
      results.map((group: GameResultGroup): Section => {
        const { groupResults, liveScore } = group;
        const userRows: ReadonlyArray<Row> = groupResults
          .filter(({ user }: UserResult): boolean => user.id !== currentUserId)
          .map((result: UserResult): Row => ({ kind: 'user', result }));
        const data: ReadonlyArray<Row> =
          liveScore !== undefined
            ? [{ kind: 'live', live: liveScore }, ...userRows]
            : userRows;

        return {
          self: groupResults.find(
            ({ user }: UserResult): boolean => user.id === currentUserId,
          ),
          team1: group.team1,
          team2: group.team2,
          liveScore,
          data,
        };
      }),
    [currentUserId, results],
  );

  const renderSectionHeader = React.useCallback(
    ({ section }: { section: Section }): React.ReactElement => {
      const { team1, team2, self, liveScore } = section;
      if (self) {
        const { user } = self;
        const exact = isExactMatch(self, liveScore);

        return (
          <View style={themedStyles.headerRow}>
            <View style={themedStyles.row}>
              <TeamItem team={team1} orientation="vertical" variant="light" />
              <Text
                style={[
                  themedStyles.rowText,
                  styles.userCell,
                  themedStyles.header,
                ]}
              >
                Usuario
              </Text>
              <TeamItem team={team2} orientation="vertical" variant="light" />
            </View>
            <View style={themedStyles.row}>
              <Text
                style={[
                  themedStyles.rowText,
                  styles.teamCell,
                  themedStyles.self,
                ]}
              >
                {self.team1Score}
              </Text>
              <View style={styles.userCell}>
                <Avatar name={user.name} uri={user.photoUrl} size={28} />
                <Text
                  style={[
                    themedStyles.rowText,
                    styles.userName,
                    themedStyles.self,
                  ]}
                >
                  {user.name}
                </Text>
                {exact ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    color={themedStyles.exactIcon.color}
                    size={14}
                  />
                ) : null}
              </View>
              <Text
                style={[
                  themedStyles.rowText,
                  styles.teamCell,
                  themedStyles.self,
                ]}
              >
                {self.team2Score}
              </Text>
            </View>
          </View>
        );
      } else {
        return (
          <View style={themedStyles.headerRow}>
            <View style={themedStyles.row}>
              <TeamItem team={team1} orientation="vertical" variant="light" />
              <Text
                style={[
                  themedStyles.rowText,
                  styles.userCell,
                  themedStyles.header,
                ]}
              >
                Usuario
              </Text>
              <TeamItem team={team2} orientation="vertical" variant="light" />
            </View>
          </View>
        );
      }
    },
    [themedStyles],
  );

  const renderItem = React.useCallback(
    (
      itemInfo: SectionListRenderItemInfo<Row, SectionMeta>,
    ): React.ReactElement => {
      const { item, section } = itemInfo;

      if (item.kind === 'live') {
        const { live } = item;
        return (
          <View style={[themedStyles.row, themedStyles.liveRow]}>
            <Text
              style={[
                themedStyles.rowText,
                styles.teamCell,
                themedStyles.liveScore,
              ]}
            >
              {live.team1Score}
            </Text>
            <View style={styles.userCell}>
              <Text style={[themedStyles.rowText, themedStyles.liveStatus]}>
                {live.status || 'EN VIVO'}
              </Text>
            </View>
            <Text
              style={[
                themedStyles.rowText,
                styles.teamCell,
                themedStyles.liveScore,
              ]}
            >
              {live.team2Score}
            </Text>
          </View>
        );
      }

      const { result } = item;
      const { user } = result;
      const exact = isExactMatch(result, section.liveScore);

      return (
        <View style={themedStyles.row}>
          <Text style={[themedStyles.rowText, styles.teamCell]}>
            {result.team1Score}
          </Text>
          <View style={styles.userCell}>
            <Avatar name={user.name} uri={user.photoUrl} size={28} />
            <Text style={[themedStyles.rowText, styles.userName]}>
              {user.name}
            </Text>
            {exact ? (
              <FontAwesomeIcon
                icon={faCheck}
                color={themedStyles.exactIcon.color}
                size={14}
              />
            ) : null}
          </View>
          <Text style={[themedStyles.rowText, styles.teamCell]}>
            {result.team2Score}
          </Text>
        </View>
      );
    },
    [themedStyles],
  );

  return (
    <SectionList
      sections={sections}
      contentContainerStyle={styles.contentContainer}
      stickySectionHeadersEnabled={true}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      ItemSeparatorComponent={ListItemSeparator}
      ListEmptyComponent={
        <ListEmptyMessage message="No hay partidos en este momento" />
      }
      refreshing={isFetching}
      onRefresh={handleRefresh}
    />
  );
};

const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    rowText: {
      color: theme.textColor,
    },
    headerRow: {
      elevation: 4,
      backgroundColor: theme.cardColor,
    },
    header: {
      textTransform: 'uppercase',
      fontWeight: '600',
      opacity: 0.75,
      color: theme.contrastTextColor,
    },
    self: {
      color: theme.contrastTextColor,
    },
    liveRow: {
      backgroundColor: theme.dimmedCardColor,
    },
    liveScore: {
      color: theme.primaryColorBright,
      fontSize: 20,
    },
    liveStatus: {
      textTransform: 'uppercase',
      fontWeight: '700',
      letterSpacing: 0.5,
      color: theme.primaryColor,
    },
    exactIcon: {
      color: theme.primaryColorBright,
    },
  });

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  userCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  userName: {
    marginLeft: 8,
    flexShrink: 1,
    textAlign: 'center',
  },
  teamCell: {
    width: 100,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
