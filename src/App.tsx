import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  Users, 
  Split, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Play,
  Info,
  RotateCcw,
  Home
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TEAM_QUESTIONS } from './constants';
import { cn } from './lib/utils';

type GameStatus = 'START' | 'PLAYING' | 'WON' | 'LOST';

const SOUNDS = {
  CORRECT: 'https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3', // Triumphant orchestral hit
  WRONG: 'https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3',   // Dramatic fail tone
  TICK: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',    // Intense clock tick
  NEW_QUESTION: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3' // Suspenseful transition
};

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState<string>("Team A");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('START');
  const [timeLeft, setTimeLeft] = useState(50);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    audiencePoll: true
  });
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollData, setPollData] = useState<number[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initialScores: Record<string, number> = {};
    Object.keys(TEAM_QUESTIONS).forEach(team => {
      initialScores[team] = 0;
    });
    return initialScores;
  });
  const bgMusic = useRef<HTMLAudioElement | null>(null);

  const tickAudio = useRef<HTMLAudioElement | null>(null);

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const readQuestion = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  const quizQuestions = TEAM_QUESTIONS[selectedTeam];
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleGameOver = useCallback((won: boolean) => {
    window.speechSynthesis.cancel();
    if (won) {
      setGameStatus('WON');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setGameStatus('LOST');
      playSound(SOUNDS.WRONG);
    }
    if (tickAudio.current) {
      tickAudio.current.pause();
      tickAudio.current = null;
    }
  }, []);

  const moveToNextQuestion = useCallback(() => {
    const quizQuestions = TEAM_QUESTIONS[selectedTeam];
    if (currentQuestionIndex === quizQuestions.length - 1) {
      handleGameOver(true);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerRevealed(false);
        setTimeLeft(50);
        setHiddenOptions([]);
        setShowPoll(false);
      }, 2000);
    }
  }, [currentQuestionIndex, handleGameOver]);

  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      // Suspenseful background music
      bgMusic.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_783d1a0e02.mp3?filename=suspense-90479.mp3');
      bgMusic.current.loop = true;
      bgMusic.current.volume = 0.2;
      bgMusic.current.play().catch(e => console.log('BG Music play failed:', e));
    } else {
      if (bgMusic.current) {
        bgMusic.current.pause();
        bgMusic.current = null;
      }
    }
    return () => {
      if (bgMusic.current) {
        bgMusic.current.pause();
      }
    };
  }, [gameStatus]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStatus === 'PLAYING' && timeLeft > 0 && !isAnswerRevealed && !isReading) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 6 && prev > 0) {
            playSound(SOUNDS.TICK);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === 'PLAYING' && !isAnswerRevealed) {
      setIsAnswerRevealed(true);
      playSound(SOUNDS.WRONG);
      moveToNextQuestion();
    }
    return () => clearInterval(timer);
  }, [gameStatus, timeLeft, isAnswerRevealed, isReading, moveToNextQuestion]);

  useEffect(() => {
    if (gameStatus === 'PLAYING' && !isAnswerRevealed) {
      setIsReading(true);
      playSound(SOUNDS.NEW_QUESTION);
      setTimeout(() => {
        readQuestion(currentQuestion.text);
      }, 1000);
    }
  }, [currentQuestionIndex, gameStatus, currentQuestion.text, readQuestion]);

  const handleOptionClick = (index: number) => {
    if (isAnswerRevealed || hiddenOptions.includes(index)) return;
    setSelectedOption(index);
  };

  const confirmAnswer = () => {
    if (selectedOption === null) return;
    window.speechSynthesis.cancel();
    setIsAnswerRevealed(true);

    setTimeout(() => {
      if (selectedOption === currentQuestion.correctAnswer) {
        playSound(SOUNDS.CORRECT);
        setScores(prev => ({
          ...prev,
          [selectedTeam]: prev[selectedTeam] + 10
        }));
      } else {
        playSound(SOUNDS.WRONG);
      }
      moveToNextQuestion();
    }, 1500);
  };

  const useLifeline = (type: keyof typeof lifelines) => {
    if (!lifelines[type] || isAnswerRevealed || selectedTeam === "FFF" || selectedTeam === "Tie Breaker") return;

    setLifelines(prev => ({ ...prev, [type]: false }));

    if (type === 'fiftyFifty') {
      const wrongOptions = currentQuestion.options
        .map((_, i) => i)
        .filter(i => i !== currentQuestion.correctAnswer);
      const shuffled = wrongOptions.sort(() => 0.5 - Math.random());
      setHiddenOptions(shuffled.slice(0, 2));
    } else if (type === 'audiencePoll') {
      const data = [0, 0, 0, 0];
      const correctWeight = 60 + Math.random() * 30;
      data[currentQuestion.correctAnswer] = Math.floor(correctWeight);
      let remaining = 100 - data[currentQuestion.correctAnswer];
      
      const others = [0, 1, 2, 3].filter(i => i !== currentQuestion.correctAnswer);
      others.forEach((idx, i) => {
        if (i === others.length - 1) {
          data[idx] = remaining;
        } else {
          const val = Math.floor(Math.random() * remaining);
          data[idx] = val;
          remaining -= val;
        }
      });
      setPollData(data);
      setShowPoll(true);
    }
  };

  const startGame = () => {
    setGameStatus('PLAYING');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setTimeLeft(50);
    setLifelines({
      fiftyFifty: true,
      audiencePoll: true
    });
    setHiddenOptions([]);
    setShowPoll(false);
  };

  const goHome = () => {
    window.speechSynthesis.cancel();
    setGameStatus('START');
  };

  if (gameStatus === 'START') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920" 
            alt="Engineering Background" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-[#020617]/40 to-[#020617]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8 relative z-10"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
            <Trophy className="w-24 h-24 mx-auto text-yellow-500 relative z-10" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1 mb-6">
              <p className="text-blue-500 font-black tracking-widest text-2xl uppercase">BTIRT presents</p>
              <h2 className="text-2xl font-black tracking-widest text-white uppercase">HORIZON 2k26</h2>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.3em]">Cultural Fest</p>
            </div>
            <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent uppercase">
              TECHNICAL TALENT HUNT
            </h1>
            <p className="text-gray-400 text-lg">
              Showcase your skills and conquer the ultimate tech challenge. {TEAM_QUESTIONS[selectedTeam].length} levels of pure knowledge.
            </p>
          </div>

          {/* Team Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(TEAM_QUESTIONS).map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={cn(
                  "py-3 rounded-xl font-bold text-sm transition-all border-2",
                  selectedTeam === team
                    ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10"
                    : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
                )}
              >
                {team}
              </button>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-3 flex items-center gap-2">
              <Trophy className="w-3 h-3" /> Live Leaderboard
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(scores).map(([team, score]) => (
                <div key={team} className="flex items-center justify-between bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="text-xs text-gray-400">{team}</span>
                  <span className="text-sm font-bold text-blue-400">{score}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={startGame}
            className="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 transition-all rounded-xl font-bold text-xl flex items-center justify-center gap-2 overflow-hidden shadow-lg shadow-blue-600/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Play className="w-6 h-6 fill-current" />
            START HUNT
          </button>

          {/* Game Rules & Lifelines Section */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-left space-y-6 backdrop-blur-sm max-h-[350px] overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Info className="w-4 h-4" /> General Rules & Guidelines
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-bold">1</div>
                  <p className="text-gray-300"><span className="text-white font-semibold">Timing:</span> 50-second time limit for every question.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-bold">2</div>
                  <p className="text-gray-300"><span className="text-white font-semibold">Continuous Hunt:</span> Wrong answers or timeouts won't stop you—the hunt continues to the next level!</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-bold">3</div>
                  <p className="text-gray-300"><span className="text-white font-semibold">No Unfair Means:</span> Mobiles/external aids prohibited. One warning before disqualification.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-bold">4</div>
                  <p className="text-gray-300"><span className="text-white font-semibold">Winner:</span> Team with the most correct answers will be declared the winner.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Round 1: Elimination & Qualification
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0 text-[10px] font-bold">A</div>
                  <p className="text-gray-300"><span className="text-white font-semibold">FFF Round:</span> One member from each of the 7 teams plays the Fastest Finger First round.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0 text-[10px] font-bold">B</div>
                  <p className="text-gray-300"><span className="text-white font-semibold">TTH Qualification:</span> Only the 4 fastest teams with correct sequences proceed to TTH.</p>
                </div>
              </div>
            </div>

            {selectedTeam !== "FFF" && selectedTeam !== "Tie Breaker" && (
              <div className="pt-2 border-t border-slate-800 flex gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] uppercase">
                    <Split className="w-3 h-3" /> 50:50
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">Removes two incorrect options.</p>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] uppercase">
                    <Users className="w-3 h-3" /> Poll
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">Simulates audience vote.</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2 justify-center">
              <Timer className="w-4 h-4" /> 50s per question
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Info className="w-4 h-4" /> {TEAM_QUESTIONS[selectedTeam].length} Levels
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameStatus === 'WON' || gameStatus === 'LOST') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 text-white">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 rounded-3xl text-center space-y-6 backdrop-blur-xl"
        >
          {gameStatus === 'WON' ? (
            <>
              <Trophy className="w-20 h-20 mx-auto text-yellow-500 animate-bounce" />
              <h2 className="text-4xl font-bold">CHAMPION!</h2>
              <p className="text-gray-400">You've completed the Technical Talent Hunt and proved your mastery!</p>
            </>
          ) : (
            <>
              <XCircle className="w-20 h-20 mx-auto text-red-500" />
              <h2 className="text-4xl font-bold">HUNT OVER</h2>
              <p className="text-gray-400">Great effort! You reached level {currentQuestionIndex + 1}.</p>
            </>
          )}
          <div className="flex flex-col gap-3">
            <button 
              onClick={startGame}
              className="w-full py-4 bg-blue-600 text-white hover:bg-blue-500 transition-colors rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> RESTART HUNT
            </button>
            <button 
              onClick={goHome}
              className="w-full py-4 bg-white text-black hover:bg-gray-200 transition-colors rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" /> HOME
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 relative">
        {/* Header: Lifelines & Timer */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2 lg:gap-4">
            {selectedTeam !== "FFF" && selectedTeam !== "Tie Breaker" && (
              <>
                <LifelineButton 
                  active={lifelines.fiftyFifty} 
                  onClick={() => useLifeline('fiftyFifty')} 
                  icon={<Split className="w-5 h-5" />} 
                  label="50:50" 
                />
                <LifelineButton 
                  active={lifelines.audiencePoll} 
                  onClick={() => useLifeline('audiencePoll')} 
                  icon={<Users className="w-5 h-5" />} 
                  label="Poll" 
                />
              </>
            )}
            <button
              onClick={goHome}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-slate-700 text-slate-500 flex items-center justify-center transition-all group-hover:border-white group-hover:text-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-500 group-hover:text-white">Home</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Score</div>
              <div className="text-3xl font-black text-blue-500 tabular-nums">{scores[selectedTeam]}</div>
            </div>

            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (timeLeft / 50) * 175.9}
                  className={cn(
                    "transition-all duration-1000",
                    timeLeft > 10 ? "text-blue-500" : "text-red-500"
                  )}
                />
              </svg>
              <span className={cn(
                "absolute text-xl font-bold",
                timeLeft <= 10 && "animate-pulse text-red-500"
              )}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 blur opacity-25"></div>
                <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
                  <span className="text-blue-500 font-mono text-sm mb-2 block uppercase tracking-widest">Level {currentQuestionIndex + 1}</span>
                  <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                    {currentQuestion.text}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <OptionButton
                    key={index}
                    label={String.fromCharCode(65 + index)}
                    text={option}
                    selected={selectedOption === index}
                    correct={isAnswerRevealed && index === currentQuestion.correctAnswer}
                    wrong={isAnswerRevealed && selectedOption === index && index !== currentQuestion.correctAnswer}
                    disabled={isAnswerRevealed || hiddenOptions.includes(index)}
                    hidden={hiddenOptions.includes(index)}
                    onClick={() => handleOptionClick(index)}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center">
            <button
              onClick={confirmAnswer}
              disabled={selectedOption === null || isAnswerRevealed}
              className={cn(
                "px-12 py-4 rounded-full font-bold text-lg transition-all transform active:scale-95",
                selectedOption !== null && !isAnswerRevealed
                  ? "bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              )}
            >
              LOCK ANSWER
            </button>
          </div>
        </div>

        {/* Lifeline Overlays */}
        <AnimatePresence>
          {showPoll && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-24 right-8 w-64 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl z-20"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2"><Users className="w-4 h-4" /> Audience Poll</h3>
                <button onClick={() => setShowPoll(false)} className="text-gray-500 hover:text-white">×</button>
              </div>
              <div className="space-y-3">
                {pollData.map((val, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{String.fromCharCode(65 + i)}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar: Progress Tree */}
      <div className="w-full lg:w-80 bg-slate-900/50 border-l border-slate-800 p-4 lg:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest">Hunt Progress</h3>
          <span className="text-blue-500 font-bold text-[10px] uppercase bg-blue-500/10 px-2 py-0.5 rounded">{selectedTeam}</span>
        </div>
        <div className="flex-1 flex flex-col-reverse gap-1">
          {TEAM_QUESTIONS[selectedTeam].map((q, i) => (
            <div 
              key={q.id}
              className={cn(
                "flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                currentQuestionIndex === i 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105 z-10" 
                  : i < currentQuestionIndex 
                    ? "text-green-500" 
                    : "text-gray-500",
                (i + 1) % 5 === 0 && i !== currentQuestionIndex && "text-yellow-600"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-4 text-right opacity-50">{i + 1}</span>
                <span>Level {i + 1}</span>
              </div>
              {i < currentQuestionIndex && <CheckCircle2 className="w-4 h-4" />}
              {currentQuestionIndex === i && <ChevronRight className="w-4 h-4 animate-pulse" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LifelineButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className={cn(
        "flex flex-col items-center gap-1 group",
        !active && "opacity-30 grayscale cursor-not-allowed"
      )}
    >
      <div className={cn(
        "w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 flex items-center justify-center transition-all",
        active 
          ? "border-blue-500 bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white" 
          : "border-slate-700 text-slate-700"
      )}>
        {icon}
      </div>
      <span className="text-[10px] uppercase font-bold tracking-tighter text-slate-500">{label}</span>
    </button>
  );
}

interface OptionButtonProps {
  label: string;
  text: string;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  disabled: boolean;
  hidden: boolean;
  onClick: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ label, text, selected, correct, wrong, disabled, hidden, onClick }) => {
  if (hidden) return <div className="h-16 lg:h-20" />;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative h-16 lg:h-20 w-full text-left px-6 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 group overflow-hidden",
        !selected && !correct && !wrong && "bg-slate-900 border-slate-800 hover:border-blue-500 hover:bg-slate-800",
        selected && !correct && !wrong && "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/20",
        correct && "bg-green-600 border-green-400 text-white shadow-lg shadow-green-600/20 animate-pulse",
        wrong && "bg-red-600 border-red-400 text-white shadow-lg shadow-red-600/20"
      )}
    >
      <span className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
        selected || correct || wrong ? "bg-white/20" : "bg-slate-800 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
      )}>
        {label}
      </span>
      <span className="font-medium text-lg truncate">{text}</span>
      
      {/* Sparkle effect on correct */}
      {correct && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]"></div>
      )}
    </button>
  );
}
