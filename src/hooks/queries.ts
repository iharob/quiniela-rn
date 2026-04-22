import { useApi } from '@app/context/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TournamentConfig } from '@app/types/tournamentConfig';
import { RankingsEntry } from '@app/types/rankingsEntry';
import { PublicUserProfile, UserProfile } from '@app/mobx/sessionStore';
import {
  GroupWithResults,
  PointsDetails,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';

export const useTournamentConfigQuery = (): UseQueryResult<TournamentConfig, Error> => {
  const api = useApi();
  return useQuery({
    queryKey: ['tournamentConfig'],
    queryFn: (): Promise<TournamentConfig> => api.fetchTournamentConfig(),
  });
};

export const useRankings = (): UseQueryResult<readonly RankingsEntry[], Error> => {
  const api = useApi();
  return useQuery({
    queryKey: ['rankings'],
    queryFn: ({ signal }): Promise<readonly RankingsEntry[]> => api.fetchRankings(signal),
  });
};

export const useOngoing = (): UseQueryResult<any, Error> => {
  const api = useApi();
  return useQuery({
    queryKey: ['ongoing'],
    queryFn: (): Promise<any> => api.fetchOngoing(),
  });
};

export const useProfile = (): UseQueryResult<UserProfile, Error> => {
  const api = useApi();
  return useQuery({
    queryKey: ['profile'],
    queryFn: (): Promise<UserProfile> => api.fetchProfile(),
  });
};

export const useUserProfile = (
  userId: number,
): UseQueryResult<PublicUserProfile, Error> => {
  const api = useApi();
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: (): Promise<PublicUserProfile> => api.getUserProfile(userId),
  });
};

export const useUserScoreDetails = (
  userId: number,
): UseQueryResult<PointsDetails, Error> => {
  const api = useApi();
  return useQuery({
    queryKey: ['userScoreDetails', userId],
    queryFn: ({ signal }): Promise<PointsDetails> => api.getUserScoreDetails(userId, signal),
  });
};

export const useGroups = (): UseQueryResult<readonly GroupWithResults[], Error> => {
  const api = useApi();
  return useQuery({
    queryKey: ['groups'],
    queryFn: (): Promise<readonly GroupWithResults[]> => api.fetchGroups(),
  });
};
