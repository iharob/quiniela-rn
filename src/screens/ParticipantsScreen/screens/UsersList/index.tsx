import { ListItemSeparator } from '@app/elements/listItemSeparator';
import { useRankingsScreenStoreContext } from '@app/mobx/rankingsScreenStore';
import { StackParamsList } from '@app/screens/ParticipantsScreen';
import { ListEmptyMessage } from '@app/screens/ParticipantsScreen/screens/components/listEmptyMessage';
import { ListHeader } from '@app/screens/ParticipantsScreen/screens/UsersList/listHeader';
import { ListItem } from '@app/screens/ParticipantsScreen/screens/UsersList/listItem';
import { RankingsEntry } from '@app/types/rankingsEntry';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native';
import { VoidFunction } from '@app/types';

export const UsersList: React.FC = observer((): React.ReactElement => {
  const navigation = useNavigation<NavigationProp<StackParamsList>>();

  const store = useRankingsScreenStoreContext();
  const { rankings } = store;

  const handleRefresh = React.useCallback((): void | VoidFunction => {
    const abortController = new AbortController();

    store.fetchRankings(abortController.signal);
    return (): void => {
      abortController.abort();
    };
  }, [store]);

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
        rankings.length === 0 ? (
          <ListEmptyMessage message="Parece que aún no empezamos." />
        ) : (
          <ListEmptyMessage message="Probablemente hay un problema de conexión." error={true} />
        )
      }
      refreshing={store.fetching}
      onRefresh={handleRefresh}
    />
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
});
