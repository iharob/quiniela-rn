import { Api } from '@app/context/api';
import {
  GameWithResult,
  GroupWithResults,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import {
  ClassificationGroup,
  computeClassificationTable,
} from '@app/types/classifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { action, computed, makeObservable, observable } from 'mobx';
import React from 'react';

const LEGACY_SAVE_KEY = '@groupsStore';

export class GroupsScreenStore {
  private readonly api: Api;
  private readonly saveKeyPrefix: string;

  public static readonly SAVE_KEY_PREFIX = '@groupsStore_';

  public fetching = false;
  public groups: readonly GroupWithResults[] = [];
  public fetchError: Error | null = null;

  constructor(api: Api, userId: number) {
    makeObservable<GroupsScreenStore, 'setFetching' | 'setFetchError'>(this, {
      groups: observable,
      fetching: observable,
      fetchError: observable,
      positions: computed,
      completed: computed,
      setGroups: action.bound,
      updateGameScore: action.bound,
      setFetching: action.bound,
      setFetchError: action.bound,
    });

    this.api = api;
    this.saveKeyPrefix = `@groupsStore_${userId}_`;
  }

  private keyFor(groupName: string): string {
    return `${this.saveKeyPrefix}${groupName}`;
  }

  private setFetchError(error: Error): void {
    this.fetchError = error;
  }

  private setFetching(value: boolean): void {
    this.fetching = value;
  }

  public setGroups(groups: readonly GroupWithResults[]): void {
    this.groups = groups;
  }

  public updateGameScore(
    groupName: string,
    gameId: number,
    teamKey: 'team1' | 'team2',
    value: number | null,
  ): void {
    this.groups = this.groups.map(
      (group: GroupWithResults): GroupWithResults => {
        if (group.name !== groupName) {
          return group;
        }

        return {
          name: group.name,
          games: group.games.map((game: GameWithResult): GameWithResult => {
            if (game.gameId !== gameId) {
              return game;
            } else if (teamKey === 'team1') {
              return { ...game, team1Score: value };
            } else {
              return { ...game, team2Score: value };
            }
          }),
        };
      },
    );

    this.saveGroup(groupName).catch((error: Error): void => {
      console.warn(error);
    });
  }

  private async saveGroup(groupName: string): Promise<void> {
    const group = this.groups.find(
      (g: GroupWithResults): boolean => g.name === groupName,
    );
    if (!group) {
      return;
    }
    await AsyncStorage.setItem(this.keyFor(groupName), JSON.stringify(group));
  }

  private mergePersistedScores(
    fresh: readonly GroupWithResults[],
    persisted: readonly GroupWithResults[],
  ): readonly GroupWithResults[] {
    if (persisted.length === 0) {
      return fresh;
    }

    const persistedByName = new Map<string, GroupWithResults>(
      persisted.map((group: GroupWithResults): [string, GroupWithResults] => [
        group.name,
        group,
      ]),
    );

    return fresh.map((group: GroupWithResults): GroupWithResults => {
      const saved = persistedByName.get(group.name);
      if (!saved) {
        return group;
      }

      // Discard persisted scores if the games don't match exactly
      if (saved.games.length !== group.games.length) {
        return group;
      }

      const savedByGameId = new Map<number, GameWithResult>(
        saved.games.map((game: GameWithResult): [number, GameWithResult] => [
          game.gameId,
          game,
        ]),
      );

      const merged: GameWithResult[] = [];
      for (const game of group.games) {
        const savedGame = savedByGameId.get(game.gameId);
        if (!savedGame) {
          return group;
        }
        merged.push({
          ...game,
          team1Score: savedGame.team1Score,
          team2Score: savedGame.team2Score,
        });
      }

      return {
        name: group.name,
        games: merged,
      };
    });
  }

  private fetchGroups(persisted: readonly GroupWithResults[]): void {
    const { api } = this;

    this.setFetching(true);

    api
      .fetchGroups()
      .then((groups: readonly GroupWithResults[]): void => {
        this.setGroups(this.mergePersistedScores(groups, persisted));
        this.removeStalePersistedGroups(groups).catch((error: Error): void => {
          console.warn(error);
        });
      })
      .catch((error: Error): void => {
        console.warn(error);
        this.setFetchError(error);
      })
      .finally((): void => {
        this.setFetching(false);
      });
  }

  private async removeStalePersistedGroups(
    fresh: readonly GroupWithResults[],
  ): Promise<void> {
    const freshNames = new Set(
      fresh.map((group: GroupWithResults): string => group.name),
    );
    const allKeys = await AsyncStorage.getAllKeys();
    const staleKeys = allKeys.filter(
      (key: string): boolean =>
        key.startsWith(this.saveKeyPrefix) &&
        !freshNames.has(key.slice(this.saveKeyPrefix.length)),
    );
    if (staleKeys.length > 0) {
      await AsyncStorage.multiRemove(staleKeys);
    }
  }

  public get completed(): number {
    const { groups } = this;

    return groups.reduce(
      (completed: number, group: GroupWithResults): number => {
        const { games } = group;

        return (
          games.reduce((accumulator: number, game: GameWithResult): number => {
            return (
              accumulator +
              (game.team1Score !== null && game.team2Score !== null ? 1 : 0)
            );
          }, 0) + completed
        );
      },
      0,
    );
  }

  public get positions(): readonly ClassificationGroup[] {
    return computeClassificationTable(this.groups);
  }

  public load = async (): Promise<void> => {
    const persisted = await this.loadPersistedGroups();
    this.fetchGroups(persisted);
  };

  private async loadPersistedGroups(): Promise<readonly GroupWithResults[]> {
    await this.migrateLegacyStore();

    const allKeys = await AsyncStorage.getAllKeys();
    const groupKeys = allKeys.filter((key: string): boolean =>
      key.startsWith(this.saveKeyPrefix),
    );

    if (groupKeys.length === 0) {
      return [];
    }

    const entries = await AsyncStorage.multiGet(groupKeys);
    const groups: GroupWithResults[] = [];

    for (const [, value] of entries) {
      if (value === null) {
        continue;
      }
      try {
        groups.push(JSON.parse(value) as GroupWithResults);
      } catch (error) {
        console.warn(error);
      }
    }

    groups.sort((a: GroupWithResults, b: GroupWithResults): number =>
      a.name.localeCompare(b.name),
    );
    return groups;
  }

  private async migrateLegacyStore(): Promise<void> {
    const allKeys = await AsyncStorage.getAllKeys();

    // Migrate the oldest format: single @groupsStore key with all groups in one array
    const legacy = await AsyncStorage.getItem(LEGACY_SAVE_KEY);
    if (legacy !== null) {
      try {
        const parsed = JSON.parse(legacy) as readonly GroupWithResults[];
        if (Array.isArray(parsed)) {
          await AsyncStorage.multiSet(
            parsed.map((group: GroupWithResults): [string, string] => [
              this.keyFor(group.name),
              JSON.stringify(group),
            ]),
          );
        }
      } catch (error) {
        console.warn(error);
      }
      await AsyncStorage.removeItem(LEGACY_SAVE_KEY);
    }

    // Migrate per-group keys without userId (e.g. @groupsStore_GroupA -> @groupsStore_42_GroupA)
    const oldPrefix = GroupsScreenStore.SAVE_KEY_PREFIX;
    const oldKeys = allKeys.filter(
      (key: string): boolean =>
        key.startsWith(oldPrefix) && !key.startsWith(this.saveKeyPrefix),
    );
    if (oldKeys.length > 0) {
      const entries = await AsyncStorage.multiGet(oldKeys);
      const newEntries: Array<[string, string]> = [];
      for (const [oldKey, value] of entries) {
        if (value === null) {
          continue;
        }
        const groupName = oldKey.slice(oldPrefix.length);
        const newKey = this.keyFor(groupName);
        // Only migrate if there is no user-specific key already
        const existing = await AsyncStorage.getItem(newKey);
        if (existing === null) {
          newEntries.push([newKey, value]);
        }
      }
      if (newEntries.length > 0) {
        await AsyncStorage.multiSet(newEntries);
      }
      await AsyncStorage.multiRemove(oldKeys);
    }
  }
}

export const useGroupsScreenStore = (): GroupsScreenStore => {
  const context = React.useContext<GroupsScreenStore | null>(
    GroupsScreenStoreContext,
  );
  if (context === null) {
    throw new Error('no groups screen store was defined in current context');
  }

  return context;
};

export const GroupsScreenStoreContext =
  React.createContext<GroupsScreenStore | null>(null);
