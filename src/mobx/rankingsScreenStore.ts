import { Api } from '@app/context/api';
import { RankingsEntry } from '@app/types/rankingsEntry';
import { GameResultGroup } from '@app/types/userResults';
import { action, makeObservable, observable } from 'mobx';
import React from 'react';

export class RankingsScreenStore {
  private readonly api: Api;

  public rankings: readonly RankingsEntry[] = [];
  public currentGameResults: readonly GameResultGroup[] = [];
  public fetching = false;

  constructor(api: Api) {
    makeObservable<RankingsScreenStore, 'setFetching' | 'setCurrentGameResults'>(this, {
      rankings: observable.ref,
      fetching: observable,
      currentGameResults: observable.ref,
      setFetching: action.bound,
      setRankings: action.bound,
      setCurrentGameResults: action.bound,
    });

    this.api = api;
  }

  public setCurrentGameResults(results: readonly GameResultGroup[]): void {
    this.currentGameResults = results;
  }

  public setRankings(rankings: readonly RankingsEntry[] | null): void {
    this.rankings = rankings ?? [];
  }

  private setFetching(fetching: boolean): void {
    this.fetching = fetching;
  }

  public fetchOngoing(): void {
    const { api } = this;

    this.setFetching(true);

    api
      .fetchOngoing()
      .then(this.setCurrentGameResults)
      .catch(console.warn)
      .finally((): void => {
        this.setFetching(false);
      });
  }

  public fetchRankings(signal: AbortSignal): void {
    const { api } = this;

    this.setFetching(true);

    api
      .fetchRankings(signal)
      .then(this.setRankings)
      .catch(console.warn)
      .finally((): void => {
        this.setFetching(false);
      });
  }
}

export const RankingsScreenStoreContext = React.createContext<RankingsScreenStore | null>(null);

export const useRankingsScreenStoreContext = (): RankingsScreenStore => {
  const context = React.useContext<RankingsScreenStore | null>(RankingsScreenStoreContext);
  if (context === null) {
    throw new Error('cannot find the rankings screen store');
  }

  return context;
};
