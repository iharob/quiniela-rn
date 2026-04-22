import { HamburgerMenu } from '@app/components/hamburgerMenu';
import { NextButton } from '@app/components/nextButton';
import { Spinner } from '@app/components/spinner';
import { useApi } from '@app/context/api';
import { useLogout } from '@app/hooks/useLogout';
import { useGroupsScreenStore } from '@app/mobx/groupsScreenStore';
import { useKnockoutPhaseStore } from '@app/mobx/konckoutStore';
import { PredictionStackParamsList } from '@app/screens/PredictScreen';
import { GroupWithResults } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { GroupAccordionRow } from '@app/screens/PredictScreen/screens/GroupsScreen/groupAccordionRow';
import { useTheme } from '@app/theme/ThemeContext';
import { ClassificationGroup } from '@app/types/classifications';
import { findRound, pairMatchesByFeeders } from '@app/utils/brackets';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { noop } from 'mobx/src/utils/utils';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

export const Groups: React.FC = observer((): React.ReactElement => {
  const store = useGroupsScreenStore();
  const knockoutStore = useKnockoutPhaseStore();
  const { completed, positions, groups } = store;
  const theme = useTheme();
  const api = useApi();
  const [computingDraw, setComputingDraw] = React.useState(false);

  const navigation = useNavigation<NavigationProp<PredictionStackParamsList>>();
  const total = React.useMemo(
    (): number =>
      groups.reduce(
        (accumulator: number, { games }: GroupWithResults): number =>
          accumulator + games.length,
        0,
      ),
    [groups],
  );

  const loading = useLogout(
    '¿Desea salir? Su progreso se guardará automáticamente.',
    undefined,
    store.load,
  );

  const didInitExpanded = React.useRef(false);
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);

  React.useEffect((): void => {
    if (didInitExpanded.current || groups.length === 0) {
      return;
    }
    didInitExpanded.current = true;
    setExpandedGroup(groups[0].name);
  }, [groups]);

  const positionsByName = React.useMemo(
    (): ReadonlyMap<string, ClassificationGroup> =>
      new Map(
        positions.map(
          (p: ClassificationGroup): [string, ClassificationGroup] => [
            p.name,
            p,
          ],
        ),
      ),
    [positions],
  );

  const handleToggle = React.useCallback((name: string): void => {
    setExpandedGroup((current: string | null): string | null =>
      current === name ? null : name,
    );
  }, []);

  const doHandleNext = React.useCallback(async (): Promise<void> => {
    setComputingDraw(true);
    try {
      const bracketRounds = await api.computeBrackets({
        results: store.groups,
      });

      const roundOf32 = findRound(bracketRounds, 5);
      const roundOf16 = findRound(bracketRounds, 4);
      if (!roundOf32 || !roundOf16) {
        console.warn(
          'La respuesta del sorteo no contiene las rondas esperadas',
        );
        return;
      }

      const pairs = pairMatchesByFeeders(roundOf32.matches, roundOf16.matches);

      knockoutStore.setBracketFixtures(bracketRounds);
      navigation.navigate('Knockout', {
        round: 5,
        games: pairs,
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo calcular los partidos. Intente de nuevo.',
      );
      console.error(error);
    } finally {
      setComputingDraw(false);
    }
  }, [api, knockoutStore, navigation, store.groups]);

  const handleNext = React.useMemo(
    (): (() => void) | undefined =>
      total === completed ? doHandleNext : undefined,
    [completed, doHandleNext, total],
  );

  React.useEffect((): void => {
    navigation.setOptions({
      title: `Completado ${completed}/${total}`,
      headerLeft: null,
      headerRight: (): React.ReactNode => <HamburgerMenu />,
      headerTintColor: theme.contrastTextColor,
      headerStyle: headerStyle,
    });
  }, [total, completed, navigation, handleNext, theme.contrastTextColor]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<GroupWithResults>): React.ReactElement => {
      const isExpanded = expandedGroup === item.name;
      const dimmed = expandedGroup !== null && !isExpanded;
      return (
        <GroupAccordionRow
          group={item}
          classificationGroup={positionsByName.get(item.name)}
          expanded={isExpanded}
          dimmed={dimmed}
          onScoreChange={noop}
          onToggle={handleToggle}
        />
      );
    },
    [expandedGroup, handleToggle, positionsByName],
  );

  const keyExtractor = React.useCallback(
    (group: GroupWithResults): string => group.name,
    [],
  );

  const containerStyle = React.useMemo(
    () => ({ ...styles.container, backgroundColor: theme.backgroundColor }),
    [theme.backgroundColor],
  );

  return (
    <View style={containerStyle}>
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        extraData={expandedGroup}
      />
      <View style={styles.footer}>
        <NextButton disabled={completed < total} onNext={handleNext} />
      </View>
      <Spinner
        visible={loading || computingDraw}
        size={Dimensions.get('window').width / 3}
      />
    </View>
  );
});

const headerStyle = {
  elevation: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  listContent: {
    paddingVertical: 0,
  },
  headerRightContainer: {
    display: 'flex',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
