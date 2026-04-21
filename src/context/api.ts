import { API_URL, SIMULATE } from '@app/config';
import { Rounds } from '@app/mobx/konckoutStore';
import { PublicUserProfile, UserProfile, UserSession } from '@app/mobx/sessionStore';
import {
  GameWithResult,
  GroupWithResults,
  PointsDetails,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { deleteUserSession, saveUserSession } from '@app/sessionUtils';
import { BracketRound, Game } from '@app/types/game';
import { Group } from '@app/types/group';
import { RankingsEntry } from '@app/types/rankingsEntry';
import { TournamentConfig } from '@app/types/tournamentConfig';
import { simulateGroupScore } from '@app/utils/simulate';
import axios, { AxiosResponse } from 'axios';
import React from 'react';

interface PredictionPayload {
  readonly groups: readonly GroupWithResults[];
  readonly playoffs: ReadonlyArray<ReadonlyArray<[GameWithResult, GameWithResult]>>;
  readonly final: GameWithResult;
}

interface ComputeBracketsPayload {
  readonly results: readonly GroupWithResults[];
}

export class Api {
  public static BEARER_TOKEN_KEY = 'bearerToken';
  private bearerToken = '';
  private baseUrl = API_URL;

  public setBearerToken = (bearerToken: string): void => {
    this.bearerToken = bearerToken;
  };

  public setBaseUrl = (url: string): void => {
    this.baseUrl = url;
  };

  private get url(): string {
    return this.baseUrl;
  }

  public fetchTournamentConfig = async (): Promise<TournamentConfig> => {
    const response = await axios.get(`${this.url}/tournament/config`);
    if (response.status !== 200) {
      throw new Error('No se pudo obtener la configuración del torneo');
    }
    return response.data;
  };

  public computeBrackets = async (
    predictions: ComputeBracketsPayload,
  ): Promise<readonly BracketRound[]> => {
    const response = await axios.post(`${this.url}/brackets`, predictions, {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });

    if (response.status !== 200) {
      throw new Error('No se pudo obtener el sorteo');
    }

    return response.data;
  };

  public googleAuth = async (credential: string): Promise<UserSession> => {
    const response = await axios.post(this.url + '/auth/google', { credential });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Ocurrió un error, no pudimos identificarlo con Google');
    }

    const session: UserSession = await response.data;
    await saveUserSession(session);
    return session;
  };

  public emailRegister = async (
    email: string,
    name: string,
    password: string,
  ): Promise<UserSession> => {
    const response = await axios.post(this.url + '/auth/register', { email, name, password });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('No pudimos completar el registro');
    }

    const session: UserSession = response.data;
    await saveUserSession(session);
    return session;
  };

  public emailLogin = async (email: string, password: string): Promise<UserSession> => {
    const response = await axios.post(this.url + '/auth/login', { email, password });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('No pudimos iniciar sesión');
    }

    const session: UserSession = response.data;
    await saveUserSession(session);
    return session;
  };

  public loadSession = async (): Promise<Omit<UserSession, 'token'> | null> => {
    try {
      const response = await axios.get(this.url + '/auth/session', {
        headers: {
          Authorization: 'Bearer ' + this.bearerToken,
        },
      });
      const session: UserSession = response.data;
      await saveUserSession(session);
      return session;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        // No existing / expired session — caller should just show the login screen.
        if (status === 401 || status === 403 || status === 404) {
          await deleteUserSession();
          return null;
        }
      }
      throw error;
    }
  };

  public getUserScoreDetails = async (
    userID: number,
    signal?: AbortSignal,
  ): Promise<PointsDetails> => {
    const response = await axios.get(`${this.url}/prediction/${userID}/score`, {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error('bad response');
    }

    return response.data;
  };

  public sendPrediction = async (
    groups: readonly GroupWithResults[],
    knockout: Rounds,
    final: GameWithResult,
  ): Promise<void> => {
    const stripWinner = (game: GameWithResult): GameWithResult => {
      const { winner: _, ...rest } = game;
      return rest as GameWithResult;
    };

    const sanitizeKnockoutGame = (game: GameWithResult): GameWithResult => {
      if (game.team1Score === game.team2Score && game.team1Score !== null) {
        return game;
      }
      return stripWinner(game);
    };

    const sanitizedGroups: readonly GroupWithResults[] = groups.map(
      (group: GroupWithResults): GroupWithResults => ({
        ...group,
        games: group.games.map(stripWinner),
      }),
    );

    // Rounds are keyed by API round number (5 = R32, 4 = R16, ..., 1 = Final).
    // Emit them in R32-first order so the payload reads naturally from earliest to latest round.
    const playoffs: ReadonlyArray<ReadonlyArray<[GameWithResult, GameWithResult]>> = Object.keys(
      knockout,
    )
      .map((key: string): number => Number(key))
      .sort((a: number, b: number): number => b - a)
      .map(
        (key: number): ReadonlyArray<[GameWithResult, GameWithResult]> =>
          knockout[key].map(
            ([game1, game2]: [GameWithResult, GameWithResult]): [
              GameWithResult,
              GameWithResult,
            ] => [sanitizeKnockoutGame(game1), sanitizeKnockoutGame(game2)],
          ),
      );

    const payload: PredictionPayload = {
      groups: sanitizedGroups,
      playoffs: playoffs,
      final: sanitizeKnockoutGame(final),
    };

    const response: AxiosResponse = await axios.post(this.url + '/prediction', payload, {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });

    if (response.status !== 201) {
      throw new Error('No pudimos crear su quiniela, vuelva a intentar luego');
    }
  };

  public fetchOngoing = async (): Promise<any> => {
    const response = await axios.get(this.url + '/ongoing', {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });
    if (response.status !== 200) {
      throw new Error('bad response');
    }

    return response.data;
  };

  public fetchRankings = async (signal: AbortSignal): Promise<readonly RankingsEntry[]> => {
    const response = await axios.get(this.url + '/rankings', {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
      signal: signal,
    });
    if (response.status !== 200) {
      throw new Error('bad response');
    }

    return response.data;
  };

  public fetchProfile = async (): Promise<UserProfile> => {
    const response = await axios.get(`${this.url}/profile`, {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });
    if (response.status !== 200) {
      throw new Error('No se pudo obtener el perfil');
    }
    return response.data;
  };

  public getUserProfile = async (userId: number): Promise<PublicUserProfile> => {
    const response = await axios.get(`${this.url}/profile/${userId}`, {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });
    if (response.status !== 200) {
      throw new Error('No se pudo obtener el perfil del usuario');
    }
    return response.data;
  };

  public updateProfile = async (data: FormData): Promise<UserProfile> => {
    const response = await axios.put(`${this.url}/profile`, data, {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 204) {
      throw new Error('No se pudo actualizar el perfil');
    }
    return this.fetchProfile();
  };

  public fetchGroups = async (): Promise<readonly GroupWithResults[]> => {
    const response = await axios.get(this.url + '/groups', {
      headers: {
        Authorization: 'Bearer ' + this.bearerToken,
      },
    });

    if (response.status !== 200) {
      throw new Error('bad response');
    }

    const groups: readonly Group[] = response.data;

    return groups.map((group: Group): GroupWithResults => {
      const { games } = group;

      return {
        name: group.name,
        games: games.map((game: Game): GameWithResult => {
          const { team1, team2 } = game;

          const simulated = simulateGroupScore(team1, team2);

          return {
            gameId: game.gameId,
            team1: game.team1,
            team2: game.team2,
            date: game.date,
            team1Score: SIMULATE ? simulated.team1Score : null,
            team2Score: SIMULATE ? simulated.team2Score : null,
          };
        }),
      };
    });
  };
}

export const ApiContext = React.createContext<Api | null>(null);

export const useApi = (): Api => {
  const context = React.useContext<Api | null>(ApiContext);
  if (context === null) {
    throw new Error('no api provided');
  }

  return context;
};
