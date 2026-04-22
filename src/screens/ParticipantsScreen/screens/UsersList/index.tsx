import { ListItemSeparator } from '@app/elements/listItemSeparator';
import { useRankings } from '@app/hooks/queries';
import { StackParamsList } from '@app/screens/ParticipantsScreen';
import { ListEmptyMessage } from '@app/screens/ParticipantsScreen/screens/components/listEmptyMessage';
import { ListHeader } from '@app/screens/ParticipantsScreen/screens/UsersList/listHeader';
import { ListItem } from '@app/screens/ParticipantsScreen/screens/UsersList/listItem';
import { RankingsEntry } from '@app/types/rankingsEntry';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native';
import { VoidFunction } from '@app/types';

export const UsersList: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<NavigationProp<StackParamsList>>();

  const { data: rankings = [], isFetching, refetch } = useRankings();

  const handleRefresh = React.useCallback((): void => {
    refetch();
  }, [refetch]);

  const itemClickHandler = React.useCallback(
    (item: RankingsEntry): VoidFunction =>
      (): void => {
        navigation.navigate('UserScoreDetails', {
          userId: item.userID,
          userName: item.userName,
          photoUrl: item.photoUrl,
          bio: item.bio,
        });
      },
    [navigation],
  );

  const renderHeader = React.useCallback((): React.ReactElement => <ListHeader />, []);
  const renderItem = React.useCallback(
    (itemInfo: ListRenderItemInfo<RankingsEntry>): React.ReactElement => {
      const { item } = itemInfo;

      return (
        <TouchableOpacity onPress={itemClickHandler(item)}>
          <ListItem item={item} />
        </TouchableOpacity>
      );
    },
    [itemClickHandler],
  );

  return (
    <FlatList
      data={rankings}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={renderHeader}
      ItemSeparatorComponent={ListItemSeparator}
      renderItem={renderItem}
      ListEmptyComponent={
        rankings.length === 0 && !isFetching ? (
          <ListEmptyMessage message="Parece que aún no empezamos." />
        ) : rankings.length === 0 && isFetching ? (
          <ListEmptyMessage message="Cargando..." />
        ) : (
          <ListEmptyMessage message="Probablemente hay un problema de conexión." error={true} />
        )
      }
      refreshing={isFetching}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
});
