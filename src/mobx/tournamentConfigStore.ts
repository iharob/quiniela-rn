import { defaultConfig, TournamentConfig } from '@app/types/tournamentConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { action, makeObservable, observable } from 'mobx';
import React from 'react';

export class TournamentConfigStore {
  public static readonly SAVE_KEY = '@tournamentConfig';

  public config: TournamentConfig = defaultConfig;
  public loading = true;
  public error: Error | null = null;

  constructor() {
    makeObservable(this, {
      config: observable.ref,
      loading: observable,
      error: observable,
      setConfig: action.bound,
      setLoading: action.bound,
      setError: action.bound,
    });
  }

  public setConfig(config: TournamentConfig): void {
    this.config = config;
  }

  public setLoading(value: boolean): void {
    this.loading = value;
  }

  public setError(error: Error | null): void {
    this.error = error;
  }

  public loadCached = async (): Promise<TournamentConfig | null> => {
    const data = await AsyncStorage.getItem(TournamentConfigStore.SAVE_KEY);
    if (data !== null) {
      return JSON.parse(data);
    }
    return null;
  };

  public saveConfig = async (config: TournamentConfig): Promise<void> => {
    await AsyncStorage.setItem(TournamentConfigStore.SAVE_KEY, JSON.stringify(config));
  };
}

export const TournamentConfigStoreContext = React.createContext<TournamentConfigStore | null>(null);

export const useTournamentConfig = (): TournamentConfigStore => {
  const context = React.useContext<TournamentConfigStore | null>(TournamentConfigStoreContext);
  if (context === null) {
    throw new Error('no tournament config store was defined in current context');
  }

  return context;
};
