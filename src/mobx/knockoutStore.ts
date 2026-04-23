import { Api } from '@app/context/api';
import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { BracketRound } from '@app/types/game';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { action, makeObservable, observable } from 'mobx';
import React from 'react';

export type RoundId = number;

export type Rounds = Record<RoundId, ReadonlyArray<[GameWithResult, GameWithResult]>>;

export class KnockoutStore {
  private readonly api: Api;
  private readonly saveKey: string;

  public rounds: Rounds = {};
  public bracketFixtures: readonly BracketRound[] = [];

  constructor(api: Api, userId: number) {
    makeObservable<KnockoutStore, 'setRounds'>(this, {
      rounds: observable.ref,
      bracketFixtures: observable.ref,
      update: action.bound,
      setRounds: action.bound,
      setBracketFixtures: action.bound,
    });

    this.api = api;
    this.saveKey = `@knockout_v2_${userId}_default`;
  }

  public setRounds(rounds: Rounds): void {
    this.rounds = rounds;
  }

  public setBracketFixtures(fixtures: readonly BracketRound[]): void {
    this.bracketFixtures = fixtures;
  }

  public update(round: RoundId, games: ReadonlyArray<[GameWithResult, GameWithResult]>): void {
    this.rounds = { ...this.rounds, [round]: games };
    this.save().catch((error: Error): void => {
      console.warn(error);
    });
  }

  public load = async (): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem(this.saveKey);
      if (data !== null) {
        this.setRounds(JSON.parse(data));
      }
    } catch (error) {
      console.warn(error);
    }
  };

  public save = async (): Promise<void> => {
    await AsyncStorage.setItem(this.saveKey, JSON.stringify(this.rounds));
  };
}

export const useKnockoutPhaseStore = (): KnockoutStore => {
  const context = React.useContext<KnockoutStore | null>(KnockoutStoreContext);
  if (context === null) {
    throw new Error('no knockout store was defined in current context');
  }

  return context;
};

export const KnockoutStoreContext = React.createContext<KnockoutStore | null>(null);
