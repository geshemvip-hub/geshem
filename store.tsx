
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppContextType, Competitor, Score, RoundScore, CompetitionDetails, JudgeProfile, LeaderboardEntry } from './types';
import { F2B_MANEUVERS } from './constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_STATE: AppState = {
  competitors: [],
  judges: [],
  currentRound: 1,
  activeCompetitorId: null,
  competitionDetails: null,
};

const STORAGE_KEY = 'f2b_app_state_v5';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or use initial
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Migration check: if judges are strings (old version), convert them
            if (parsed.judges && parsed.judges.length > 0 && typeof parsed.judges[0] === 'string') {
                parsed.judges = parsed.judges.map((name: string) => ({ name, pin: null }));
            }
            return parsed;
        } catch (e) {
            return INITIAL_STATE;
        }
    }
    return INITIAL_STATE;
  });

  // Persist changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const registerCompetitor = (name: string, flightOrder: number) => {
    const newCompetitor: Competitor = {
      id: Date.now().toString(), // Simple ID generation
      name,
      flightOrder,
      roundScores: []
    };
    
    setState(prev => ({
      ...prev,
      competitors: [...prev.competitors, newCompetitor]
    }));
  };

  const removeCompetitor = (id: string) => {
      setState(prev => ({
          ...prev,
          competitors: prev.competitors.filter(c => c.id !== id)
      }));
  };

  const manageJudges = (action: 'add' | 'remove', name: string) => {
    setState(prev => {
      if (action === 'add') {
        if (prev.judges.some(j => j.name === name)) return prev;
        return { ...prev, judges: [...prev.judges, { name, pin: null }] };
      } else {
        return { ...prev, judges: prev.judges.filter(j => j.name !== name) };
      }
    });
  };

  const setJudgePin = (name: string, pin: string) => {
      setState(prev => ({
          ...prev,
          judges: prev.judges.map(j => 
            j.name === name ? { ...j, pin } : j
          )
      }));
  };

  const addScore = (competitorId: string, roundId: number, judgeName: string, newScores: Score[], isEdited: boolean = false) => {
    setState(prev => {
      const updatedCompetitors = prev.competitors.map(comp => {
        if (comp.id !== competitorId) return comp;
        
        // Find existing score to preserve original values if editing
        const existingRoundIndex = comp.roundScores.findIndex(
            rs => rs.roundId === roundId && rs.judgeName === judgeName
        );

        let processedScores = newScores;
        
        if (isEdited && existingRoundIndex >= 0) {
            const existingScores = comp.roundScores[existingRoundIndex].scores;
            processedScores = newScores.map(ns => {
                const oldScore = existingScores.find(os => os.maneuverId === ns.maneuverId);
                // If score changed and no original score saved yet, save the old value
                // If original score already exists, keep it (don't overwrite with intermediate edits)
                if (oldScore && oldScore.score !== ns.score) {
                     return {
                         ...ns,
                         originalScore: oldScore.originalScore !== undefined ? oldScore.originalScore : oldScore.score
                     };
                }
                // Preserve existing originalScore if value matches current but metadata exists
                if (oldScore && oldScore.originalScore !== undefined) {
                    return { ...ns, originalScore: oldScore.originalScore };
                }
                return ns;
            });
        }

        // Calculate total considering K-Factor
        const totalScore = processedScores.reduce((acc, s) => {
            const maneuver = F2B_MANEUVERS.find(m => m.id === s.maneuverId);
            const k = maneuver ? maneuver.kFactor : 1;
            return acc + (s.score * k);
        }, 0);

        const newRoundScore: RoundScore = {
            roundId,
            judgeName,
            scores: processedScores,
            totalScore,
            isEdited: isEdited || (existingRoundIndex >= 0 && !!comp.roundScores[existingRoundIndex].isEdited)
        };

        let updatedRoundScores;
        if (existingRoundIndex >= 0) {
            updatedRoundScores = [...comp.roundScores];
            updatedRoundScores[existingRoundIndex] = newRoundScore;
        } else {
            updatedRoundScores = [...comp.roundScores, newRoundScore];
        }

        return {
          ...comp,
          roundScores: updatedRoundScores
        };
      });

      return { ...prev, competitors: updatedCompetitors };
    });
  };

  const setCompetitionDetails = (details: CompetitionDetails) => {
    setState(prev => ({
      ...prev,
      competitionDetails: details
    }));
  };

  const resetCompetition = () => {
    if(confirm("האם אתה בטוח שברצונך לאפס את כל נתוני התחרות? פעולה זו תמחק את כל התוצאות, המתחרים והשופטים.")) {
        setState(INITIAL_STATE);
    }
  };

  // God Mode Actions
  const godModeActions = {
    factoryReset: () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(INITIAL_STATE);
        window.location.reload();
    },
    clearCompetitors: () => {
        setState(prev => ({ ...prev, competitors: [] }));
    },
    clearJudges: () => {
        setState(prev => ({ ...prev, judges: [] }));
    },
    resetDirector: () => {
        setState(prev => ({ ...prev, competitionDetails: null }));
    }
  };

  // Helper: Process aggregation for a single set of judge scores
  const processJudgeAggregation = (scores: { judgeName: string, score: number }[]) => {
      const n = scores.length;
      let finalValue = 0;
      let used: string[] = [];
      let dropped: string[] = [];
      let toughest: string | null = null;
      let generous: string | null = null;

      if (n === 0) return { finalValue: 0, used: [], dropped: [], toughest: null, generous: null };
      
      // Sort by score ascending (Low to High)
      const sorted = [...scores].sort((a, b) => a.score - b.score);

      if (n === 1) {
          finalValue = sorted[0].score;
          used = [sorted[0].judgeName];
      } else if (n === 2) {
          finalValue = (sorted[0].score + sorted[1].score) / 2;
          used = [sorted[0].judgeName, sorted[1].judgeName];
      } else if (n === 3) {
          // Drop lowest (sorted[0]), average next 2
          finalValue = (sorted[1].score + sorted[2].score) / 2;
          used = [sorted[1].judgeName, sorted[2].judgeName];
          dropped = [sorted[0].judgeName]; // The lowest
          toughest = sorted[0].judgeName;
      } else {
          // n >= 4: Drop lowest and highest
          const lowest = sorted[0];
          const highest = sorted[n - 1];
          
          const activeScores = sorted.slice(1, n - 1);
          const sum = activeScores.reduce((a, b) => a + b.score, 0);
          finalValue = sum / activeScores.length;

          used = activeScores.map(s => s.judgeName);
          dropped = [lowest.judgeName, highest.judgeName];
          toughest = lowest.judgeName;
          generous = highest.judgeName;
      }

      // If not 3 or 4+, determine tough/generous from the whole set just for stats
      if (!toughest && n > 1) toughest = sorted[0].judgeName;
      if (!generous && n > 1) generous = sorted[n-1].judgeName;

      return { finalValue, used, dropped, toughest, generous };
  };

  // Calculates the final leaderboard based on F2B Algorithm:
  // 1. For each judge: Average of Best 2 Rounds
  // 2. Aggregate Judges: 1(Score), 2(Avg), 3(Drop Low), 4+(Drop Low & High)
  const getLeaderboard = (roundId?: number): LeaderboardEntry[] => {
    return state.competitors.map(comp => {
        let scoresToProcess: { judgeName: string, score: number }[] = [];

        if (roundId !== undefined) {
            // --- SPECIFIC ROUND VIEW ---
            // Process scores only for this round, aggregating judges normally
            scoresToProcess = comp.roundScores
                .filter(r => r.roundId === roundId)
                .map(r => ({ judgeName: r.judgeName, score: r.totalScore }));
        } else {
            // --- FINAL SCORE VIEW ---
            // Step 1: Calculate "Judge Score" = Avg of Best 2 Rounds for each judge
            const uniqueJudges = Array.from(new Set(comp.roundScores.map(r => r.judgeName)));
            
            uniqueJudges.forEach(jName => {
                const jScores = comp.roundScores
                    .filter(r => r.judgeName === jName)
                    .map(r => r.totalScore)
                    .sort((a, b) => b - a); // Descending (High to Low)
                
                // Need at least one score
                if (jScores.length > 0) {
                    // Take best 2 (or 1 if only 1 exists)
                    const bestScores = jScores.slice(0, 2);
                    const avg = bestScores.reduce((a, b) => a + b, 0) / bestScores.length;
                    scoresToProcess.push({ judgeName: jName, score: avg });
                }
            });
        }

        // Step 2: Aggregate the processed scores (either Round Scores or Judge Final Scores)
        // using the Judge Count Rules (Drop Low/High)
        const result = processJudgeAggregation(scoresToProcess);

        return {
            competitor: comp,
            finalScore: result.finalValue,
            details: {
                usedJudges: result.used,
                droppedJudges: result.dropped,
                toughestJudge: result.toughest,
                generousJudge: result.generous
            }
        };
    }).sort((a, b) => b.finalScore - a.finalScore); // Descending order
  };

  return (
    <AppContext.Provider value={{ state, registerCompetitor, removeCompetitor, addScore, setCompetitionDetails, manageJudges, setJudgePin, resetCompetition, getLeaderboard, godModeActions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
