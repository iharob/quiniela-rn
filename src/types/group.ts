import { Game } from '@app/types/game';

export interface Group {
  readonly name: string;
  readonly games: readonly Game[];
}
