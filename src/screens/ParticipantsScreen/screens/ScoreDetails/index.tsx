import { useApi } from '@app/context/api';
import { StackParamsList } from '@app/screens/ParticipantsScreen';
import { HeaderTitle } from '@app/screens/ParticipantsScreen/screens/ScoreDetails/headerTitle';
import {
  computeSections,
  keyExtractor,
  renderItem,
  SectionType,
  themedHeaderIcon,
  themedHeaderText,
} from '@app/screens/ParticipantsScreen/screens/ScoreDetails/logic';
import {
  PointsDetails,
  PredictedResult,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { useTheme } from '@app/theme/ThemeContext';
import { faCalculator, faEquals } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React from 'react';
import {
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { VoidFunction } from '@app/types';
import { BackButton } from '@app/components/BackButton.tsx';

interface Props {
  readonly route: RouteProp<StackParamsList, 'UserScoreDetails'>;
}

export const ScoreDetails: React.FC<Props> = (
  props: Props,
): React.ReactElement => {
  const navigation = useNavigation<NavigationProp<StackParamsList>>();
  const theme = useTheme();

  const [pointsDetails, setPointsDetails] = React.useState<PointsDetails>(
    PointsDetails.empty(),
  );
  const [fetching, setFetching] = React.useState<boolean>(true);

  const { route } = props;
  const { userId } = route.params;

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const api = useApi();

  const refetch = React.useCallback((): void => {
    const abortController = abortControllerRef.current;
    if (abortController) {
      abortController.abort();
    }

    abortControllerRef.current = new AbortController();

    api
      .getUserScoreDetails(userId, abortControllerRef.current.signal)
      .then((response: PointsDetails): void => {
        setPointsDetails(response);
      })
      .finally((): void => {
        setTimeout((): void => {
          setFetching(false);
        }, 0);
      });
  }, [api, userId]);

  React.useEffect((): VoidFunction => {
    refetch();

    return (): void => {
      const abortController = abortControllerRef.current;
      if (abortController) {
        abortController.abort();
        abortControllerRef.current = null;
      }
    };
  }, [refetch]);

  React.useEffect((): void | VoidFunction => {
    navigation.setOptions({
      headerTitle: HeaderTitle,
      headerTintColor: '#fff',
      headerLeft: BackButton,
      headerLeftContainerStyle: {
        paddingRight: 10,
        paddingLeft: 10,
      },
      headerShown: true,
    });

    return (): void => {
      navigation.setOptions({
        headerShown: false,
      });
    };
  }, [navigation, theme.contrastTextColor]);

  const sections = React.useMemo(
    (): readonly SectionType[] => computeSections(pointsDetails),
    [pointsDetails],
  );

  const renderSectionHeader = React.useCallback(
    ({
      section,
    }: {
      section: SectionListData<PredictedResult, SectionType>;
    }): React.ReactElement => {
      return (
        <View style={styles.headerContainer}>
          <View style={styles.firstHeader}>
            <Text style={themedHeaderText(theme)}>{section.title}</Text>
          </View>
          <View style={styles.headerItem}>
            <FontAwesomeIcon
              style={themedHeaderIcon(theme)}
              icon={faCalculator}
            />
          </View>
          <View style={styles.headerItem}>
            <FontAwesomeIcon style={themedHeaderIcon(theme)} icon={faEquals} />
          </View>
        </View>
      );
    },
    [theme],
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={fetching}
        initialNumToRender={104}
        maxToRenderPerBatch={104}
        windowSize={21}
        scrollEnabled={!fetching}
        onRefresh={refetch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerItem: {
    width: 40,
    alignItems: 'center',
  },
  firstHeader: {
    flex: 1,
    textAlign: 'left',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
