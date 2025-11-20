
export enum UserRole {
  JUDGE = 'JUDGE',
  DIRECTOR = 'DIRECTOR',
  HOME = 'HOME'
}

export interface Maneuver {
  id: number;
  name: string;
  kFactor: number; // Difficulty coefficient
  icon: string; // Icon name reference
}

export interface Score {
  maneuverId: number;
  score: number;
  timestamp: number;
  originalScore?: number; // Track the original value if edited
}

export interface RoundScore {
  roundId: number;
  judgeName: string;
  scores: Score[];
  totalScore: number;
  isEdited?: boolean; // Flag to indicate director intervention
}

export interface Competitor {
  id: string;
  name: string;
  flightOrder: number; // Position in the round
  roundScores: RoundScore[];
}

export interface CompetitionDetails {
  directorName: string;
  date: string;
  pin: string;
}

export interface JudgeProfile {
  name: string;
  pin: string | null;
}

export interface AppState {
  competitors: Competitor[];
  judges: JudgeProfile[]; // List of authorized judges with PINs
  currentRound: number;
  activeCompetitorId: string | null;
  competitionDetails: CompetitionDetails | null;
}

export interface LeaderboardEntry {
    competitor: Competitor;
    finalScore: number;
    details: {
        usedJudges: string[]; // Names of judges counted
        droppedJudges: string[]; // Names of judges dropped
        toughestJudge: string | null;
        generousJudge: string | null;
    }
}

export interface AppContextType {
  state: AppState;
  registerCompetitor: (name: string, flightOrder: number) => void;
  removeCompetitor: (id: string) => void;
  addScore: (competitorId: string, roundId: number, judgeName: string, scores: Score[], isEdited?: boolean) => void;
  setCompetitionDetails: (details: CompetitionDetails) => void;
  manageJudges: (action: 'add' | 'remove', name: string) => void;
  setJudgePin: (name: string, pin: string) => void;
  resetCompetition: () => void;
  getLeaderboard: (roundId?: number) => LeaderboardEntry[];
  godModeActions: {
    factoryReset: () => void;
    clearCompetitors: () => void;
    clearJudges: () => void;
    resetDirector: () => void;
  };
}
