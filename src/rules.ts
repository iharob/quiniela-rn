import { ScoringRule } from '@app/types/tournamentConfig';

export const defaultRules: readonly ScoringRule[] = [
  {
    description: 'Al acertar resultado y marcador de un juego en cualquiera de las fases',
    value: 3,
  },
  { description: 'Al acertar sólo el resultado en algun juego', value: 1 },
  { description: 'Por cada clasificado en cualquiera de la fases de grupo', value: 1 },
  { description: 'Por cada llave acertada en los grupos se le asignan', value: 2 },
  { description: 'Acertar campeón', value: 5 },
];
