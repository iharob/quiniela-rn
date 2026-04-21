import { deleteUserSession } from '@app/sessionUtils';
import { action, makeObservable, observable } from 'mobx';
import React from 'react';

export interface UserSession {
  readonly userId: number;
  readonly token: string;
  readonly predicted: boolean;
  readonly payed: boolean;
}

export interface UserProfile {
  readonly userId: number;
  readonly name: string;
  readonly email: string;
  readonly bio: string | null;
  readonly photoUrl: string | null;
}

export interface PublicUserProfile {
  readonly userId: number;
  readonly name: string;
  readonly bio: string | null;
  readonly photoUrl: string | null;
}

export class SessionStore {
  public session: UserSession | null = null;
  public profile: UserProfile | null = null;

  constructor() {
    makeObservable(this, {
      session: observable,
      profile: observable,
      setSession: action.bound,
      setProfile: action.bound,
      logout: action.bound,
    });
  }

  public setSession(session: UserSession | null): void {
    this.session = session;
  }

  public setProfile(profile: UserProfile): void {
    this.profile = profile;
  }

  public async logout(): Promise<void> {
    await deleteUserSession();
    this.setSession(null);
  }

  public setPredicted(): void {
    if (this.session) {
      this.setSession({ ...this.session, predicted: true });
    } else {
      throw new Error('cannot set predicted without a session');
    }
  }

  public setPayed(): void {
    if (this.session) {
      this.setSession({ ...this.session, payed: true });
    } else {
      throw new Error('cannot set predicted without a session');
    }
  }
}

export const SessionStoreContext = React.createContext<SessionStore | null>(null);

export const useSessionStore = (): SessionStore => {
  const context = React.useContext<SessionStore | null>(SessionStoreContext);
  if (context === null) {
    throw new Error('cannot read the session context');
  }

  return context;
};
