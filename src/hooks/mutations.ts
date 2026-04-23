import { useApi } from '@app/context/api';
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { Rounds } from '@app/mobx/knockoutStore.ts';
import {
  GameWithResult,
  GroupWithResults,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '@app/context/api';
import {
  useSessionStore,
  UserSession,
  UserProfile,
} from '@app/mobx/sessionStore';
import { BracketRound } from '@app/types/game';

interface ComputeBracketsPayload {
  readonly results: readonly GroupWithResults[];
}

interface EmailRegisterPayload {
  readonly email: string;
  readonly name: string;
  readonly password: string;
}

interface EmailLoginPayload {
  readonly email: string;
  readonly password: string;
}

interface SendPredictionPayload {
  readonly groups: readonly GroupWithResults[];
  readonly knockout: Rounds;
  readonly final: GameWithResult;
}

export const useGoogleAuthMutation = (): UseMutationResult<
  UserSession,
  Error,
  string
> => {
  const api = useApi();
  const queryClient = useQueryClient();
  const sessionStore = useSessionStore();

  return useMutation({
    mutationFn: (credential: string): Promise<UserSession> =>
      api.googleAuth(credential),
    onSuccess: async (session: UserSession): Promise<void> => {
      api.setBearerToken(session.token);
      await AsyncStorage.setItem(Api.BEARER_TOKEN_KEY, session.token);
      sessionStore.setSession(session);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useEmailRegisterMutation = (): UseMutationResult<
  UserSession,
  Error,
  EmailRegisterPayload
> => {
  const api = useApi();
  const queryClient = useQueryClient();
  const sessionStore = useSessionStore();

  return useMutation({
    mutationFn: ({
      email,
      name,
      password,
    }: EmailRegisterPayload): Promise<UserSession> =>
      api.emailRegister(email, name, password),
    onSuccess: async (session: UserSession): Promise<void> => {
      api.setBearerToken(session.token);
      await AsyncStorage.setItem(Api.BEARER_TOKEN_KEY, session.token);
      sessionStore.setSession(session);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useEmailLoginMutation = (): UseMutationResult<
  UserSession,
  Error,
  EmailLoginPayload
> => {
  const api = useApi();
  const queryClient = useQueryClient();
  const sessionStore = useSessionStore();

  return useMutation({
    mutationFn: ({
      email,
      password,
    }: EmailLoginPayload): Promise<UserSession> =>
      api.emailLogin(email, password),
    onSuccess: async (session: UserSession): Promise<void> => {
      api.setBearerToken(session.token);
      await AsyncStorage.setItem(Api.BEARER_TOKEN_KEY, session.token);
      sessionStore.setSession(session);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useSendPredictionMutation = (): UseMutationResult<
  void,
  Error,
  SendPredictionPayload
> => {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groups,
      knockout,
      final,
    }: SendPredictionPayload): Promise<void> =>
      api.sendPrediction(groups, knockout, final),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ['rankings'] });
      await queryClient.invalidateQueries({ queryKey: ['ongoing'] });
    },
  });
};

export const useUpdateProfileMutation = (): UseMutationResult<
  UserProfile,
  Error,
  FormData
> => {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData): Promise<UserProfile> =>
      api.updateProfile(data),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      await queryClient.invalidateQueries({ queryKey: ['rankings'] });
    },
  });
};

export const useComputeBracketsMutation = (): UseMutationResult<
  readonly BracketRound[],
  Error,
  ComputeBracketsPayload
> => {
  const api = useApi();
  return useMutation({
    mutationFn: (
      predictions: ComputeBracketsPayload,
    ): Promise<readonly BracketRound[]> => api.computeBrackets(predictions),
  });
};
