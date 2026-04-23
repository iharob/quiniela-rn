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
  SelfResult,
  UserResult,
} from '@app/types/userResults';
import React from 'react';
import {
  ListRenderItemInfo,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const Ongoing: React.FC = (): React.ReactElement => {
  const sessionStore = useSessionStore();
  const { data: results = [], isFetching, refetch } = useOngoing();
  const currentUserId = sessionStore.session?.userId ?? -1;
  const themedStyles = useThemedStyles(themedStylesFactory);

  const handleRefresh = React.useCallback((): void => {
    refetch();
  }, [refetch]);

  const sections = React.useMemo(
    (): ReadonlyArray<
      SectionListData<
        UserResult,
        Omit<GameResultGroup & SelfResult, 'groupResults'>
      >
    > =>
      results.map(
        (
          group: GameResultGroup,
        ): SectionListData<
          UserResult,
          Omit<GameResultGroup & SelfResult, 'groupResults'>
        > => {
          const { results: groupResults } = group;

          return {
            self: groupResults.find(
              ({ user }: UserResult): boolean => user.id === currentUserId,
            ),
            team1: group.team1,
            team2: group.team2,
            data: groupResults.filter(
              ({ user }: UserResult): boolean => user.id !== currentUserId,
            ),
          };
        },
      ),
    [currentUserId, results],
  );

  const renderSectionHeader = React.useCallback(
    ({
      section,
    }: {
      section: SectionListData<
        UserResult,
        Omit<GameResultGroup & SelfResult, 'groupResults'>
      >;
    }): React.ReactElement => {
      const { team1, team2, self } = section;
      if (self) {
        const { user } = self;

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
    (itemInfo: ListRenderItemInfo<UserResult>): React.ReactElement => {
      const { item } = itemInfo;
      const { user } = item;

      return (
        <View style={themedStyles.row}>
          <Text style={[themedStyles.rowText, styles.teamCell]}>
            {item.team1Score}
          </Text>
          <View style={styles.userCell}>
            <Avatar name={user.name} uri={user.photoUrl} size={28} />
            <Text style={[themedStyles.rowText, styles.userName]}>
              {user.name}
            </Text>
          </View>
          <Text style={[themedStyles.rowText, styles.teamCell]}>
            {item.team2Score}
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
