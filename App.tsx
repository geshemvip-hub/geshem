
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  User, 
  ClipboardCheck, 
  Users, 
  ChevronLeft, 
  Play, 
  CheckCircle, 
  Plane,
  LogOut,
  Info,
  Clock,
  PlaneTakeoff,
  RefreshCcw,
  Circle,
  Repeat,
  CircleDashed,
  Square,
  BoxSelect,
  Triangle,
  Infinity,
  LayoutGrid,
  GitCommitVertical,
  Hourglass,
  MoveVertical,
  Clover,
  PlaneLanding,
  Lock,
  BarChart as BarChartIcon,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  KeyRound,
  FileSpreadsheet,
  ShieldAlert,
  Fingerprint,
  Skull,
  Eraser,
  Power,
  UserPlus,
  Pencil,
  Save,
  X,
  Edit3,
  TrendingUp,
  TrendingDown,
  Layers,
  Eye,
  FileText
} from 'lucide-react';
import { useAppStore } from './store';
import { F2B_MANEUVERS } from './constants';
import { Timer } from './components/Timer';
import { JudgeKeypad } from './components/JudgeKeypad';
import { Competitor, Score, RoundScore } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

// Icon Mapping
const ICON_MAP: Record<string, React.ElementType> = {
  Clock,
  PlaneTakeoff,
  RefreshCcw,
  Circle,
  Repeat,
  CircleDashed,
  Square,
  BoxSelect,
  Triangle,
  Infinity,
  LayoutGrid,
  GitCommitVertical,
  Hourglass,
  MoveVertical,
  Clover,
  PlaneLanding
};

const BACKGROUND_IMAGES = [
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667165/hq720_zj9vyg.jpg",
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667324/unnamed_1_iullfq.jpg",
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667347/unnamed_obrbzm.jpg",
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667377/planes_header_qxopxo.jpg",
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667400/F2B_jfs45m.jpg",
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667421/hq720_1_hfo5ns.jpg",
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667440/unnamed_2_jlxgmg.jpg",
    "https://res.cloudinary.com/daf5llyla/image/upload/v1763667458/2024CLChamps-154327_xrw39e.jpg"
];

// --- God Mode Component ---
const GodMode = ({ onClose }: { onClose: () => void }) => {
    const { godModeActions, state } = useAppStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const GOD_PIN = "43744734";

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === GOD_PIN) {
            setIsAuthenticated(true);
        } else {
            setError("Access Denied");
            setPin('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6">
                <div className="bg-slate-900 border border-red-900 p-8 rounded-xl w-full max-w-sm text-center">
                    <ShieldAlert size={48} className="text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-red-500 mb-4 uppercase tracking-widest">Restricted Area</h2>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <input 
                            type="password" 
                            value={pin} 
                            onChange={e => setPin(e.target.value)} 
                            placeholder="Enter God PIN" 
                            className="w-full bg-black text-red-500 text-center text-2xl font-mono p-2 border border-red-900 rounded outline-none focus:border-red-500"
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                        <div className="flex gap-2">
                            <button type="button" onClick={onClose} className="flex-1 bg-slate-800 text-slate-400 py-2 rounded hover:bg-slate-700">Cancel</button>
                            <button type="submit" className="flex-1 bg-red-900 text-red-100 py-2 rounded hover:bg-red-800">Unlock</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
            <div className="p-6 max-w-2xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                    <h1 className="text-3xl font-black text-red-500 flex items-center gap-3">
                        <Skull size={32} /> GOD MODE
                    </h1>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">Close</button>
                </header>

                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-2">System Status</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-900 p-3 rounded text-slate-300">
                                Competitors: <span className="text-white font-bold">{state.competitors.length}</span>
                            </div>
                            <div className="bg-slate-900 p-3 rounded text-slate-300">
                                Judges: <span className="text-white font-bold">{state.judges.length}</span>
                            </div>
                            <div className="bg-slate-900 p-3 rounded text-slate-300 col-span-2">
                                Director: <span className="text-white font-bold">{state.competitionDetails?.directorName || 'Not Set'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                            onClick={() => { if(confirm('Delete all competitors?')) godModeActions.clearCompetitors(); }}
                            className="bg-slate-800 hover:bg-red-900/30 border border-red-900/50 text-red-400 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors"
                        >
                            <Eraser size={32} />
                            <span className="font-bold">Clear Competitors Only</span>
                            <span className="text-xs opacity-60">Removes all registered competitors and scores</span>
                        </button>

                        <button 
                            onClick={() => { if(confirm('Delete all judges?')) godModeActions.clearJudges(); }}
                            className="bg-slate-800 hover:bg-red-900/30 border border-red-900/50 text-red-400 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors"
                        >
                            <Users size={32} />
                            <span className="font-bold">Clear Judges Only</span>
                            <span className="text-xs opacity-60">Removes all judge profiles and PINs</span>
                        </button>

                        <button 
                            onClick={() => { if(confirm('Reset Director Info?')) godModeActions.resetDirector(); }}
                            className="bg-slate-800 hover:bg-red-900/30 border border-red-900/50 text-red-400 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors"
                        >
                            <Lock size={32} />
                            <span className="font-bold">Unlock Director Login</span>
                            <span className="text-xs opacity-60">Removes competition details/PIN, keeps data</span>
                        </button>

                        <button 
                            onClick={() => { if(confirm('PERFORM FACTORY RESET? THIS CANNOT BE UNDONE.')) godModeActions.factoryReset(); }}
                            className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-xl flex flex-col items-center gap-3 shadow-lg shadow-red-900/50 col-span-full"
                        >
                            <Power size={48} />
                            <span className="font-black text-xl">FACTORY RESET</span>
                            <span className="text-sm opacity-80">WIPES EVERYTHING & RELOADS</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Background Slideshow Component ---
const BackgroundSlideshow = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
        }, 6000); // Switch every 6 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900 z-0 pointer-events-none">
            {/* Dark overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 to-slate-900/90 z-10" />
            
            {BACKGROUND_IMAGES.map((img, i) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform
                        ${i === index ? 'opacity-[0.45] scale-110' : 'opacity-0 scale-100'}
                    `}
                    style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0
                    }}
                />
            ))}
        </div>
    );
};

// --- Landing Page ---
const LandingPage = () => {
  const [showGodMode, setShowGodMode] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Slideshow Background */}
      <BackgroundSlideshow />
      
      {showGodMode && <GodMode onClose={() => setShowGodMode(false)} />}
      
      <div className="mb-8 text-center relative z-10">
        <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-2 border-white/20 shadow-2xl">
           <Plane size={64} className="text-white" />
        </div>
        <h1 className="text-6xl font-black mb-2 tracking-tight drop-shadow-lg">F2B Judge Pro</h1>
        <p className="text-sky-200 text-xl font-light drop-shadow-md">מערכת שיפוט מתקדמת לאווירובטיקה</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10">
        <Link to="/live-scores" className="group bg-gradient-to-br from-yellow-600/40 to-yellow-800/40 hover:from-yellow-600/60 hover:to-yellow-800/60 backdrop-blur-md p-8 rounded-2xl border border-yellow-400/30 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/20 hover:shadow-2xl flex flex-col items-center">
          <BarChartIcon size={48} className="mb-4 text-yellow-300 group-hover:text-white transition-colors" />
          <h2 className="text-2xl font-bold text-yellow-100">תוצאות לייב</h2>
          <p className="text-center text-sm text-yellow-100/80 mt-2">צפייה בציונים הגולמיים לפי סדר הטיסה</p>
        </Link>

        <Link to="/judge-login" className="group bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-sky-500/20 hover:shadow-2xl flex flex-col items-center">
          <ClipboardCheck size={48} className="mb-4 text-sky-300 group-hover:text-white transition-colors" />
          <h2 className="text-2xl font-bold">שופט</h2>
          <p className="text-center text-sm text-sky-200 mt-2 opacity-80">ניהול סבב, ניקוד תרגילים בזמן אמת</p>
        </Link>

        <Link to="/director-login" className="group bg-gradient-to-br from-purple-600/30 to-purple-900/30 hover:from-purple-600/50 hover:to-purple-900/50 backdrop-blur-md p-8 rounded-2xl border border-purple-400/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 hover:shadow-2xl flex flex-col items-center">
          <Users size={48} className="mb-4 text-purple-300 group-hover:text-white transition-colors" />
          <h2 className="text-2xl font-bold">מנהל תחרות</h2>
          <p className="text-center text-sm text-purple-200 mt-2 opacity-80">ניהול מתחרים, שופטים וחישוב תוצאות</p>
        </Link>
      </div>

      <button 
        onClick={() => setShowGodMode(true)}
        className="absolute bottom-4 right-4 p-4 opacity-20 hover:opacity-80 transition-opacity text-white z-20"
        title="System"
      >
          <Fingerprint size={32} />
      </button>
    </div>
  );
};

// --- Live Scores (Public) ---
const LiveScores = () => {
    const { state } = useAppStore();
    const sortedCompetitors = [...state.competitors].sort((a, b) => a.flightOrder - b.flightOrder);

    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            <header className="bg-yellow-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <BarChartIcon size={24} />
                        לוח תוצאות (לפי סדר טיסה)
                    </h1>
                    {state.competitionDetails && (
                        <p className="text-xs text-yellow-100 opacity-80">
                            {state.competitionDetails.date} | {state.competitionDetails.directorName}
                        </p>
                    )}
                </div>
                <Link to="/" className="p-2 bg-yellow-700 rounded-full hover:bg-yellow-500"><LogOut size={20} /></Link>
            </header>

            <div className="max-w-5xl mx-auto p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedCompetitors.map(comp => (
                        <div key={comp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                            <div className="absolute top-0 left-0 bg-slate-800 text-white px-2 py-1 rounded-br text-xs font-bold">
                                #{comp.flightOrder}
                            </div>
                            <div className="bg-slate-100 p-3 border-b border-slate-200 flex justify-between items-center pl-10">
                                <h3 className="font-bold text-slate-800 text-lg">{comp.name}</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                {comp.roundScores.length === 0 ? (
                                    <p className="text-slate-400 text-sm italic text-center py-2">טרם בוצעו טיסות</p>
                                ) : (
                                    Array.from(new Set(comp.roundScores.map(r => r.roundId))).sort().map(rId => {
                                        const roundScores = comp.roundScores.filter(r => r.roundId === rId);
                                        const hasHighScores = roundScores.some(rs => rs.scores.some(s => s.score > 10));
                                        const hasEdits = roundScores.some(rs => rs.isEdited);

                                        return (
                                            <div key={rId} className={`p-2 rounded border ${hasHighScores ? 'bg-yellow-100 border-yellow-300' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="text-xs font-bold text-slate-500">סבב {rId}</div>
                                                    <div className="flex gap-1">
                                                        {hasEdits && <div className="bg-purple-100 text-purple-600 px-1 rounded flex items-center gap-1" title="ציון נערך ידנית"><Pencil size={10} /></div>}
                                                        {hasHighScores && <AlertTriangle size={14} className="text-orange-500 animate-pulse" />}
                                                    </div>
                                                </div>
                                                {roundScores.map((rs, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm items-center">
                                                        <span className="text-slate-600 flex items-center gap-1">
                                                            {rs.judgeName}
                                                        </span>
                                                        <span className={`font-mono font-bold ${hasHighScores ? 'text-orange-700' : 'text-slate-800'}`}>
                                                            {rs.totalScore.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// --- Director Flow ---
const DirectorLogin = () => {
  const { state, setCompetitionDetails, resetCompetition } = useAppStore();
  const [mode, setMode] = useState<'setup' | 'login'>(state.competitionDetails ? 'login' : 'setup');
  const navigate = useNavigate();
  const [setupName, setSetupName] = useState('');
  const [setupDate, setSetupDate] = useState(new Date().toISOString().split('T')[0]);
  const [setupPin, setSetupPin] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
      if(state.competitionDetails) {
          setMode('login');
      } else {
          setMode('setup');
      }
  }, [state.competitionDetails]);

  const handleSetup = (e: React.FormEvent) => {
      e.preventDefault();
      if(setupName && setupDate && setupPin) {
          if (setupPin.length < 4) {
              setError("הקוד חייב להכיל לפחות 4 ספרות");
              return;
          }
          setCompetitionDetails({
              directorName: setupName,
              date: setupDate,
              pin: setupPin
          });
          navigate('/director-dashboard');
      }
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (state.competitionDetails && loginPin === state.competitionDetails.pin) {
          navigate('/director-dashboard');
      } else {
          setError("קוד שגוי, נסה שנית");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-600">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">ניהול תחרות</h2>
        {mode === 'setup' ? (
             <form onSubmit={handleSetup} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">שם מנהל התחרות</label>
                    <input type="text" value={setupName} onChange={e => setSetupName(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">תאריך התחרות</label>
                    <input type="date" value={setupDate} onChange={e => setSetupDate(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">קוד גישה (PIN)</label>
                    <input type="tel" value={setupPin} onChange={e => setSetupPin(e.target.value.replace(/\D/g, ''))} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-center text-xl" required maxLength={6} />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition">צור תחרות</button>
             </form>
        ) : (
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg mb-4 text-center">
                     <p className="text-sm text-purple-800 font-medium">תחרות מתאריך: {state.competitionDetails?.date}</p>
                 </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">הכנס קוד גישה (PIN)</label>
                    <input type="tel" value={loginPin} onChange={e => setLoginPin(e.target.value.replace(/\D/g, ''))} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none text-center text-4xl" required autoFocus maxLength={6} />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
                    <Lock size={20} /> כניסה
                </button>
                <div className="mt-6 pt-6 border-t border-slate-200">
                 <button type="button" onClick={() => resetCompetition()} className="w-full text-slate-500 hover:text-red-600 text-sm font-medium flex items-center justify-center gap-1"><Plus size={16} /> יצירת תחרות חדשה</button>
                </div>
            </form>
        )}
        <Link to="/" className="block text-center mt-6 text-purple-600 font-medium hover:underline">חזרה לדף הבית</Link>
       </div>
    </div>
  );
};

const ScoreEditor = ({ onClose, competitorId, roundId, judgeName }: { onClose: () => void, competitorId: string, roundId: number, judgeName: string }) => {
    const { state, addScore } = useAppStore();
    const competitor = state.competitors.find(c => c.id === competitorId);
    const roundScore = competitor?.roundScores.find(r => r.roundId === roundId && r.judgeName === judgeName);
    const [localScores, setLocalScores] = useState<Score[]>(roundScore ? roundScore.scores : []);

    if (!competitor || !roundScore) return null;

    const handleScoreChange = (maneuverId: number, newVal: string) => {
        const val = parseFloat(newVal);
        if (isNaN(val)) return;
        setLocalScores(prev => {
            const existing = prev.find(s => s.maneuverId === maneuverId);
            if (existing) return prev.map(s => s.maneuverId === maneuverId ? { ...s, score: val } : s);
            else return [...prev, { maneuverId, score: val, timestamp: Date.now() }];
        });
    };

    const handleSave = () => {
        addScore(competitorId, roundId, judgeName, localScores, true);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-4 border-b border-slate-200 bg-purple-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-purple-900 flex items-center gap-2"><Edit3 size={20}/> עריכת ציונים: {competitor.name}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><X /></button>
                </div>
                <div className="p-2 bg-orange-50 border-b border-orange-100 text-xs text-orange-700 text-center">
                    שים לב: שינוי ציונים יסמן את הטופס כ"נערך ידנית" וידגיש את השינויים.
                </div>
                <div className="overflow-y-auto p-4 flex-1 space-y-2">
                    {F2B_MANEUVERS.map(m => {
                        const currentScoreObj = localScores.find(s => s.maneuverId === m.id);
                        const currentScore = currentScoreObj?.score || 0;
                        const originalScore = currentScoreObj?.originalScore;
                        const isModified = originalScore !== undefined && originalScore !== currentScore;

                        return (
                            <div key={m.id} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${isModified ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-100 p-2 rounded-full"><BoxSelect size={16} className="text-slate-500"/></div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-800">{m.name}</span>
                                        {isModified && <span className="text-xs text-orange-600 font-bold flex items-center gap-1"><AlertTriangle size={10}/> שונה מ- {originalScore}</span>}
                                    </div>
                                </div>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    value={currentScore} 
                                    onChange={(e) => handleScoreChange(m.id, e.target.value)} 
                                    className={`w-20 p-2 border rounded text-center font-bold text-lg outline-none focus:ring-2 ${isModified ? 'border-orange-300 text-orange-700 ring-orange-200' : 'border-slate-300 focus:ring-purple-300'}`} 
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">ביטול</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow flex items-center gap-2"><Save size={18} /> שמור שינויים</button>
                </div>
            </div>
        </div>
    );
};

const FlightLogInspector = ({ onClose, competitorId, onEdit }: { onClose: () => void, competitorId: string, onEdit: (cId: string, rId: number, jName: string) => void }) => {
    const { state } = useAppStore();
    const competitor = state.competitors.find(c => c.id === competitorId);
    const [activeTab, setActiveTab] = useState<number>(1);

    if (!competitor) return null;

    const rounds = [1, 2, 3];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-purple-50">
                    <h3 className="font-bold text-xl text-purple-900 flex items-center gap-2">
                        <FileText /> יומן טיסות: {competitor.name}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-purple-200 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="flex border-b border-slate-200">
                    {rounds.map(r => (
                        <button 
                            key={r} 
                            onClick={() => setActiveTab(r)}
                            className={`flex-1 py-3 font-bold text-sm transition-colors ${activeTab === r ? 'border-b-2 border-purple-600 text-purple-700 bg-purple-50' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            סבב {r}
                        </button>
                    ))}
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                    {competitor.roundScores.filter(rs => rs.roundId === activeTab).length === 0 ? (
                        <div className="text-center py-10 text-slate-400 italic">אין נתונים לסבב זה</div>
                    ) : (
                        <div className="grid gap-4">
                            {competitor.roundScores.filter(rs => rs.roundId === activeTab).map((rs, idx) => (
                                <div key={idx} className={`bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center ${rs.isEdited ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                            {rs.judgeName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{rs.judgeName}</div>
                                            <div className="text-xs text-slate-500">ניקוד כולל: <span className="font-mono font-bold">{rs.totalScore.toFixed(2)}</span></div>
                                            {rs.isEdited && <span className="text-[10px] bg-orange-100 text-orange-700 px-1 rounded font-bold border border-orange-200 mt-1 inline-block">נערך ידנית</span>}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onEdit(competitor.id, rs.roundId, rs.judgeName)}
                                        className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg font-bold text-sm hover:bg-purple-50 flex items-center gap-2 shadow-sm"
                                    >
                                        <Edit3 size={16} /> ערוך ציון
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const DirectorDashboard = () => {
  const { getLeaderboard, resetCompetition, state, manageJudges, registerCompetitor, removeCompetitor } = useAppStore();
  
  // View Mode State: 'final' or number (1, 2, 3)
  const [viewMode, setViewMode] = useState<'final' | number>('final');
  
  // Get leaderboard based on view mode
  const leaderboard = getLeaderboard(viewMode === 'final' ? undefined : viewMode);
  
  const navigate = useNavigate();
  const [newJudge, setNewJudge] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newCompOrder, setNewCompOrder] = useState('');
  const [editTarget, setEditTarget] = useState<{cId: string, rId: number, jName: string} | null>(null);
  const [inspectTarget, setInspectTarget] = useState<string | null>(null); // Competitor ID for inspection

  useEffect(() => {
      if (!state.competitionDetails) navigate('/director-login');
  }, [state.competitionDetails, navigate]);

  const handleAddJudge = (e: React.FormEvent) => {
      e.preventDefault();
      if (newJudge.trim()) { manageJudges('add', newJudge.trim()); setNewJudge(''); }
  }

  const handleAddCompetitor = (e: React.FormEvent) => {
      e.preventDefault();
      if (newCompName.trim() && newCompOrder) {
          registerCompetitor(newCompName.trim(), parseInt(newCompOrder));
          setNewCompName(''); setNewCompOrder('');
      }
  }

  const handleExport = () => {
      const BOM = "\uFEFF";
      const maneuversHeaders = F2B_MANEUVERS.map(m => m.name);
      const headers = ['שם מתחרה', 'סבב', 'שופט', 'נערך ידנית', ...maneuversHeaders, 'ניקוד סופי'];
      const rows: (string | number)[][] = [];
      state.competitors.forEach(comp => {
           comp.roundScores.forEach(rs => {
                const scoreMap = new Map(rs.scores.map(s => [s.maneuverId, s.score]));
                const maneuverScores = F2B_MANEUVERS.map(m => scoreMap.get(m.id) || 0);
                rows.push([comp.name, rs.roundId, rs.judgeName, rs.isEdited ? 'כן' : 'לא', ...maneuverScores, rs.totalScore.toFixed(2)]);
           });
      });
      const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `F2B_Results_${state.competitionDetails?.date || 'export'}.csv`;
      link.click();
  };

  // Colors for different judges in the chart
  const JUDGE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

  // Transform data for Judge Comparison Chart
  const judgeComparisonData = state.competitors.map(comp => {
      const dataPoint: any = { name: comp.name };
      state.judges.forEach(j => {
          let judgeValue = 0;
          
          // Filter based on View Mode
          if (viewMode === 'final') {
              // In final mode, we calculate the "Judge's Score" = Avg of Best 2 Rounds
              const jScores = comp.roundScores
                .filter(rs => rs.judgeName === j.name)
                .map(rs => rs.totalScore)
                .sort((a, b) => b - a) // Descending
                .slice(0, 2); // Take top 2

              if (jScores.length > 0) {
                  judgeValue = jScores.reduce((a,b) => a+b, 0) / jScores.length;
              }
          } else {
              // Specific round mode: Just the score for that round
              const rs = comp.roundScores.find(r => r.judgeName === j.name && r.roundId === viewMode);
              if (rs) judgeValue = rs.totalScore;
          }

          if (judgeValue > 0) {
              dataPoint[j.name] = Math.round(judgeValue);
          }
      });
      return dataPoint;
  });

  if (!state.competitionDetails) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       {editTarget && <ScoreEditor competitorId={editTarget.cId} roundId={editTarget.rId} judgeName={editTarget.jName} onClose={() => setEditTarget(null)} />}
       {inspectTarget && <FlightLogInspector competitorId={inspectTarget} onClose={() => setInspectTarget(null)} onEdit={(c,r,j) => { setInspectTarget(null); setEditTarget({cId: c, rId: r, jName: j}); }} />}
       
       <header className="bg-purple-700 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <div>
             <h1 className="text-xl font-bold">ניהול תחרות F2B</h1>
             <div className="text-xs text-purple-200 flex items-center gap-2"><Calendar size={12} /> {state.competitionDetails.date}</div>
        </div>
        <Link to="/" className="p-2 bg-purple-800 rounded-full hover:bg-purple-600"><LogOut size={20} /></Link>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><UserPlus size={20} /> ניהול מתחרים</h3>
                <form onSubmit={handleAddCompetitor} className="flex gap-2 mb-4">
                    <div className="flex-1">
                        <input type="text" value={newCompName} onChange={(e) => setNewCompName(e.target.value)} placeholder="שם המתחרה..." className="w-full p-2 border rounded-lg mb-2" required />
                        <input type="number" value={newCompOrder} onChange={(e) => setNewCompOrder(e.target.value)} placeholder="מיקום בסבב" className="w-full p-2 border rounded-lg" required />
                    </div>
                    <button type="submit" className="bg-purple-600 text-white px-4 rounded-lg hover:bg-purple-700"><Plus /></button>
                </form>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {state.competitors.sort((a,b) => a.flightOrder - b.flightOrder).map(comp => (
                        <div key={comp.id} className="bg-slate-50 p-2 rounded-lg flex justify-between items-center border border-slate-100">
                            <span className="font-medium text-slate-800">#{comp.flightOrder} {comp.name}</span>
                            <button onClick={() => { if(confirm(`למחוק?`)) removeCompetitor(comp.id) }} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><Users size={20} /> ניהול שופטים</h3>
                <form onSubmit={handleAddJudge} className="flex gap-2 mb-4">
                    <input type="text" value={newJudge} onChange={(e) => setNewJudge(e.target.value)} placeholder="שם השופט..." className="flex-1 p-2 border rounded-lg" />
                    <button type="submit" className="bg-purple-600 text-white px-4 rounded-lg"><Plus /></button>
                </form>
                <div className="flex flex-wrap gap-2">
                    {state.judges.map(judge => (
                        <div key={judge.name} className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-100">
                            <span>{judge.name}</span>
                            <button onClick={() => manageJudges('remove', judge.name)} className="text-purple-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- View Toggle Buttons --- */}
        <div className="flex gap-2 justify-center">
             {[1, 2, 3].map(r => (
                 <button
                    key={r}
                    onClick={() => setViewMode(r)}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === r ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                 >
                     סבב {r}
                 </button>
             ))}
             <button
                onClick={() => setViewMode('final')}
                className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'final' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
             >
                 תוצאה סופית
             </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96">
            <h3 className="text-lg font-bold text-slate-700 mb-4">
                {viewMode === 'final' ? 'השוואת ניקוד שופטים (ממוצע 2 סבבים הטובים לכל שופט)' : `השוואת ניקוד שופטים - סבב ${viewMode}`}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={judgeComparisonData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Legend />
                    {state.judges.map((judge, index) => (
                        <Bar key={judge.name} dataKey={judge.name} fill={JUDGE_COLORS[index % JUDGE_COLORS.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-700">
                    {viewMode === 'final' ? 'טבלת דירוג סופי (שקלול F2B)' : `טבלת דירוג - סבב ${viewMode}`}
                </h3>
                {viewMode !== 'final' && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">תצוגת סבב בודד</span>}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3">דירוג</th>
                            <th className="px-6 py-3">שם המתחרה</th>
                            <th className="px-6 py-3">ניקוד {viewMode === 'final' ? 'סופי' : ''}</th>
                            <th className="px-6 py-3 text-xs">שופטים שנחשבו</th>
                            <th className="px-6 py-3 text-xs">סטטיסטיקת שופטים</th>
                            <th className="px-6 py-3 w-20">ניהול</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leaderboard.map((item, index) => (
                            <tr key={item.competitor.id} className={index === 0 ? "bg-yellow-50" : "hover:bg-slate-50"}>
                                <td className="px-6 py-4 font-bold text-slate-700">{index + 1}</td>
                                <td className="px-6 py-4 text-slate-800">{item.competitor.name}</td>
                                <td className="px-6 py-4 font-mono font-bold text-purple-700">{item.finalScore.toFixed(2)}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    <div className="flex flex-wrap gap-1">
                                        {item.details.usedJudges.map(j => <span key={j} className="bg-green-100 text-green-800 px-1 rounded">{j}</span>)}
                                        {item.details.droppedJudges.map(j => <span key={j} className="bg-red-50 text-red-300 px-1 rounded line-through">{j}</span>)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    <div className="space-y-1">
                                        {item.details.toughestJudge && (
                                            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded w-fit">
                                                <TrendingDown size={12} />
                                                <span>קשוח: {item.details.toughestJudge}</span>
                                            </div>
                                        )}
                                        {item.details.generousJudge && (
                                            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                                                <TrendingUp size={12} />
                                                <span>נדיב: {item.details.generousJudge}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => setInspectTarget(item.competitor.id)}
                                        className="p-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition"
                                        title="צפייה וניהול ציונים"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {leaderboard.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">אין נתונים להצגה עבור חתך זה</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div><h3 className="text-lg font-bold text-slate-700">ייצוא נתונים</h3></div>
            <button onClick={handleExport} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"><FileSpreadsheet size={20} /> הורד אקסל</button>
        </div>

        <div className="mt-12 border-t-2 border-red-100 pt-8">
            <button onClick={resetCompetition} className="bg-white border border-red-300 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 transition flex items-center gap-2 font-semibold"><Trash2 size={18} /> איפוס כל נתוני התחרות</button>
        </div>
      </div>
    </div>
  );
};

// --- Judge Flow ---
const JudgeLogin = () => {
  const { state, setJudgePin } = useAppStore();
  const [selectedJudgeName, setSelectedJudgeName] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [step, setStep] = useState<'select' | 'create-pin' | 'enter-pin'>('select');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      setPinInput(''); setError('');
      if (selectedJudgeName) {
          const judge = state.judges.find(j => j.name === selectedJudgeName);
          if (judge) setStep(judge.pin ? 'enter-pin' : 'create-pin');
      } else setStep('select');
  }, [selectedJudgeName, state.judges]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const judge = state.judges.find(j => j.name === selectedJudgeName);
    if (!judge) return;

    if (step === 'create-pin') {
        if (pinInput.length === 4) {
            setJudgePin(selectedJudgeName, pinInput);
            navigate(`/judge-dashboard/${selectedJudgeName}`);
        } else setError('הקוד חייב להיות בן 4 ספרות');
    } else {
        if (judge.pin === pinInput) navigate(`/judge-dashboard/${selectedJudgeName}`);
        else { setError('קוד שגוי'); setPinInput(''); }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-orange-500">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">כניסת שופט</h2>
        {step === 'select' ? (
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">בחר את שמך</label>
                <select value={selectedJudgeName} onChange={e => setSelectedJudgeName(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white">
                    <option value="">-- בחר שופט --</option>
                    {state.judges.map(judge => <option key={judge.name} value={judge.name}>{judge.name}</option>)}
                </select>
            </div>
        ) : (
            <form onSubmit={handlePinSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-orange-50 p-3 rounded-lg mb-4 text-center border border-orange-100">
                     <div className="font-bold text-orange-900 text-lg">{selectedJudgeName}</div>
                     <button type="button" onClick={() => setSelectedJudgeName('')} className="text-xs text-orange-500 underline mt-1">החלף משתמש</button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">{step === 'create-pin' ? 'צור קוד חדש' : 'הכנס קוד'}</label>
                    <div className="relative">
                        <KeyRound className="absolute right-3 top-3 text-slate-400" size={20} />
                        <input type="tel" value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))} className="w-full p-3 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none text-center text-xl font-bold" required autoFocus maxLength={4} placeholder="••••" />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
                <button type="submit" disabled={pinInput.length !== 4} className="w-full bg-orange-500 disabled:bg-slate-300 text-white py-3 rounded-lg font-bold hover:bg-orange-600">{step === 'create-pin' ? 'שמור וכנס' : 'כניסה'}</button>
            </form>
        )}
        <Link to="/" className="block text-center mt-4 text-orange-600 font-medium">חזרה לדף הבית</Link>
       </div>
    </div>
  );
};

const JudgeDashboardWrapper = () => {
    const judgeName = decodeURIComponent(window.location.hash.split('/')[2] || "Unknown");
    return <JudgeDashboard judgeName={judgeName} />
}

const JudgeDashboard: React.FC<{judgeName: string}> = ({ judgeName }) => {
  const { state, addScore } = useAppStore();
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentManeuverIndex, setCurrentManeuverIndex] = useState(0);
  const [scores, setScores] = useState<Score[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [phase, setPhase] = useState<'judging' | 'review' | 'complete'>('judging');
  const [editingScoreIndex, setEditingScoreIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // State to trigger shake animation
  const [shake, setShake] = useState(false);

  const currentManeuver = F2B_MANEUVERS[currentManeuverIndex];
  const selectedCompetitor = state.competitors.find(c => c.id === selectedCompetitorId);
  const IconComponent = ICON_MAP[currentManeuver?.icon] || Plane;

  const startSession = () => {
    if (!selectedCompetitorId) return;
    setIsSessionActive(true); setIsTimerActive(false); setCurrentManeuverIndex(0); setScores([]); setPhase('judging');
  };

  const handleKeypadInput = (val: string) => {
    if (editingScoreIndex !== null) {
        if (val === '.' && editValue.includes('.')) return;
        if (editValue.length > 4) return;
        setEditValue(prev => prev + val);
    } else {
        if (val === '.' && currentInput.includes('.')) return;
        if (currentInput.length > 4) return; 
        setCurrentInput(prev => prev + val);
    }
  };

  const handleKeypadDelete = () => {
    if (editingScoreIndex !== null) setEditValue(prev => prev.slice(0, -1));
    else setCurrentInput(prev => prev.slice(0, -1));
  };

  const submitManeuverScore = () => {
    const scoreVal = parseFloat(currentInput);
    if (isNaN(scoreVal)) return;
    const newScore: Score = { maneuverId: currentManeuver.id, score: scoreVal, timestamp: Date.now() };
    const updatedScores = scores.filter(s => s.maneuverId !== currentManeuver.id);
    updatedScores.push(newScore);
    updatedScores.sort((a,b) => a.maneuverId - b.maneuverId);
    setScores(updatedScores);
    setCurrentInput("");
    if (currentManeuverIndex < F2B_MANEUVERS.length - 1) setCurrentManeuverIndex(prev => prev + 1);
    else { setPhase('review'); setIsTimerActive(false); }
  };

  const finalizeSession = () => {
    const hasErrors = scores.some(s => s.score > 10);
    if (hasErrors) {
        // Trigger shake animation
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return; // Strict block
    }

    addScore(selectedCompetitorId, selectedRound, judgeName, scores);
    setPhase('complete');
    setTimeout(() => { setIsSessionActive(false); setSelectedCompetitorId(""); setScores([]); setCurrentManeuverIndex(0); }, 3000);
  };

  const openEditModal = (index: number, currentVal: number) => { setEditingScoreIndex(index); setEditValue(currentVal.toString()); };
  
  const saveEditedScore = () => {
      if (editingScoreIndex === null) return;
      const val = parseFloat(editValue);
      if (!isNaN(val)) {
          setScores(prev => { const copy = [...prev]; copy[editingScoreIndex].score = val; return copy; });
      }
      setEditingScoreIndex(null); setEditValue("");
  };

  if (!isSessionActive) {
    return (
      <div className="min-h-screen bg-slate-100">
         <header className="bg-orange-600 text-white p-4 shadow flex justify-between items-center">
            <h1 className="font-bold text-lg">שלום, השופט {judgeName}</h1>
            <Link to="/" className="p-2 bg-orange-700 rounded-full"><LogOut size={18} /></Link>
         </header>
         <div className="p-6 max-w-lg mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-4">הגדרות סבב נוכחי</h2>
                <div className="mb-4">
                    <div className="flex gap-2">{[1, 2, 3].map(r => <button key={r} onClick={() => setSelectedRound(r)} className={`flex-1 py-3 rounded-lg font-bold border ${selectedRound === r ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>סבב {r}</button>)}</div>
                </div>
                <div className="mb-6">
                    <select className="w-full p-4 rounded-lg border border-slate-300 bg-white text-lg outline-none focus:border-orange-500" value={selectedCompetitorId} onChange={(e) => setSelectedCompetitorId(e.target.value)}>
                        <option value="">-- בחר מתחרה --</option>
                        {state.competitors.sort((a,b) => a.flightOrder - b.flightOrder).map(c => <option key={c.id} value={c.id}>{c.flightOrder}. {c.name}</option>)}
                    </select>
                </div>
                <button disabled={!selectedCompetitorId} onClick={startSession} className="w-full bg-orange-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-black text-xl hover:bg-orange-700 flex items-center justify-center gap-2"><Play size={24} fill="currentColor" /> פתח דף שיפוט</button>
            </div>
         </div>
      </div>
    );
  }

  if (phase === 'complete') {
      return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle size={80} className="text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-2">השיפוט הסתיים!</h2>
        </div>
      )
  }

  if (phase === 'review') {
      const hasErrors = scores.some(s => s.score > 10);
      
      if (editingScoreIndex !== null) {
          const m = F2B_MANEUVERS.find(man => man.id === scores[editingScoreIndex].maneuverId);
          return (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-2xl">
                      <h3 className="text-center text-lg font-bold mb-2">תיקון ציון</h3>
                      <p className="text-center text-slate-500 mb-4">{m?.name}</p>
                      <JudgeKeypad currentValue={editValue} onInput={handleKeypadInput} onDelete={handleKeypadDelete} />
                      <div className="flex gap-2 mt-4">
                          <button onClick={() => setEditingScoreIndex(null)} className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold">ביטול</button>
                          <button onClick={saveEditedScore} className="flex-1 py-3 bg-orange-600 text-white rounded-lg font-bold">שמור תיקון</button>
                      </div>
                  </div>
              </div>
          );
      }

      return (
          <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto w-full flex flex-col h-full">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ClipboardCheck /> סיכום ואישור</h2>
                  <div className="flex-1 overflow-y-auto border rounded-lg mb-4">
                      {scores.map((score, idx) => {
                          const m = F2B_MANEUVERS.find(man => man.id === score.maneuverId);
                          const isHigh = score.score > 10;
                          return (
                              <div key={score.maneuverId} onClick={() => openEditModal(idx, score.score)} className={`p-3 flex justify-between items-center border-b cursor-pointer hover:bg-slate-100 ${isHigh ? 'animate-flash' : ''}`}>
                                  <div className="flex items-center gap-3">
                                      <span className="text-xs font-bold text-slate-400 w-6">#{idx+1}</span>
                                      <div className="flex flex-col">
                                          <span className="font-medium">{m?.name}</span>
                                          <span className="text-xs text-slate-400 flex items-center gap-1"><Edit3 size={10}/> לחץ לעריכה</span>
                                      </div>
                                  </div>
                                  <div className={`font-bold text-lg ${isHigh ? 'text-red-600' : 'text-slate-800'}`}>{score.score}</div>
                              </div>
                          )
                      })}
                  </div>
                  {hasErrors && (
                      <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-4 flex items-start gap-3 animate-shake">
                          <AlertTriangle className="shrink-0 mt-1" />
                          <div><p className="font-bold">שגיאה: קיימים ציונים מעל 10</p><p className="text-sm">לא ניתן לשלוח טופס עם שגיאות. אנא תקן.</p></div>
                      </div>
                  )}
                  <button 
                    onClick={finalizeSession}
                    disabled={hasErrors}
                    className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg transition ${shake ? 'animate-shake' : ''} ${hasErrors ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                      {hasErrors ? 'תקן שגיאות לשליחה' : 'אשר ושלח ציונים'}
                  </button>
              </div>
          </div>
      )
  }

  const isLastManeuver = currentManeuverIndex === F2B_MANEUVERS.length - 1;
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
       <div className="bg-white p-3 shadow-sm flex justify-between items-center border-b border-slate-200 sticky top-0 z-10">
           <div><div className="text-xs text-slate-500">מתחרה</div><div className="font-bold text-slate-800 text-lg leading-tight">{selectedCompetitor?.name}</div></div>
           <Timer isActive={isTimerActive} onFinish={() => setIsTimerActive(false)} />
       </div>
       <div className="flex-1 flex flex-col p-4 max-w-xl mx-auto w-full relative">
           {!isTimerActive && scores.length === 0 && (
               <div className="absolute inset-0 bg-slate-100 z-20 flex items-center justify-center p-6">
                   <button onClick={() => setIsTimerActive(true)} className="w-full py-8 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-3xl shadow-xl shadow-green-200 animate-pulse flex items-center justify-center gap-3"><Play fill="currentColor" size={32} /> התחל טיסה</button>
               </div>
           )}
           <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 mb-4 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-br-lg">תרגיל {currentManeuverIndex + 1} / {F2B_MANEUVERS.length}</div>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2 mt-2"><IconComponent className="text-orange-500" size={36} /></div>
                <h2 className="text-2xl font-bold text-center text-slate-800 leading-tight mb-1">{currentManeuver.name}</h2>
                <div className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full">K-Factor: {currentManeuver.kFactor}</div>
           </div>
           <div className="flex-1"><JudgeKeypad currentValue={currentInput} onInput={handleKeypadInput} onDelete={handleKeypadDelete} /></div>
           <div className="mt-4 pb-6">
                 <button onClick={submitManeuverScore} disabled={!currentInput} className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${currentInput ? (isLastManeuver ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white') : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}>
                    {isLastManeuver ? <><CheckCircle /> סיום</> : <><ChevronLeft /> הבא</>}
                 </button>
           </div>
       </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="font-sans antialiased text-slate-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/live-scores" element={<LiveScores />} />
          <Route path="/director-login" element={<DirectorLogin />} />
          <Route path="/director-dashboard" element={<DirectorDashboard />} />
          <Route path="/judge-login" element={<JudgeLogin />} />
          <Route path="/judge-dashboard/:name" element={<JudgeDashboardWrapper />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
