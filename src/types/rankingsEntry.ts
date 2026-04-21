export interface RankingsEntry {
  readonly userName: string;
  readonly userID: number;
  readonly totalScore: number;
  readonly totalScoreDifference: number;
  readonly gamesScore: number;
  readonly gamesScoreDifference: number;
  readonly classifiersScore: number;
  readonly classifiersScoreDifference: number;
  readonly rankDifference: number;
  readonly currentRank: number;
  readonly bio?: string;
  readonly photoUrl?: string;
}
