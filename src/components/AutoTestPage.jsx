import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Upload,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Settings,
  PlusCircle,
  Edit2,
  Trash2,
  Download,
  Copy,
  FileUp,
  Home,
  BookOpen,
  Presentation,
} from "lucide-react";
import { FileUpload } from "./FileUpload";
import { useNavigate } from "react-router";
import bgimg from "../assets/bg2.avif";

// ==================== CUSTOM TIMER HOOK ====================
const useTimer = (initialTime, onComplete) => {
  const [seconds, setSeconds] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, onComplete]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newTime) => {
    setSeconds(newTime || initialTime);
    setIsRunning(false);
  };

  return { seconds, isRunning, start, pause, reset };
};

// ------- main Test Page ------------- //
export const AutoTest = ({ onNavigate }) => {
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [autoAdvance, setAutoAdvance] = useState(true); // Default enabled
  const [showSettings, setShowSettings] = useState(false);
  const [isFinished, setIsFinish] = useState(false);
  const navigate = useNavigate();
  const autoAdvanceTimeoutRef = useRef(null);

  const handleTimerComplete = useCallback(() => {
    setShowAnswer(true);
    
    // Clear any existing timeout
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }

    if (autoAdvance) {
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (quizData && nextIndex < quizData.length) {
            setShowAnswer(false);
            // Reset timer for next question
            setTimeout(() => {
              reset(timerDuration);
              start();
            }, 100);
            return nextIndex;
          }
          return prev;
        });
      }, 3000);
    }
  }, [autoAdvance, quizData, timerDuration]);

  const { seconds, isRunning, start, pause, reset } = useTimer(
    timerDuration,
    handleTimerComplete
  );

  const handleNext = () => {
    if (quizData && currentIndex < quizData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      reset(timerDuration);
      if (autoAdvance) {
        start();
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    reset(timerDuration);
    navigate("/finished");
  };

  const handleFileLoad = (data) => {
    setQuizData(data);
    setCurrentIndex(0);
    setShowAnswer(false);
    reset(timerDuration);
  };

  const handleExit = () => {
    setQuizData(null);
    setCurrentIndex(0);
    setShowAnswer(false);
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
  };

  const handleStartQuiz = () => {
    reset(timerDuration);
    start();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space" && !showAnswer) {
        e.preventDefault();
        isRunning ? pause() : start();
      } else if (
        e.code === "Enter" &&
        showAnswer &&
        quizData &&
        currentIndex < quizData.length - 1
      ) {
        handleNext();
      }
    };
    if (quizData) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [isRunning, showAnswer, currentIndex, quizData, pause, start]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Request fullscreen only after user click
  const enterFullScreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  if (!quizData) {
    return <FileUpload onFileLoad={handleFileLoad} onNavigate={onNavigate} />;
  }

  const currentQuestion = quizData[currentIndex];
  const isLastQuestion = currentIndex === quizData.length - 1;

  return (
    <div className="relative min-h-screen bg-black p-4 overflow-hidden">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-lg scale-105"
        style={{
          backgroundImage: `url(${bgimg})`,
        }}
      ></div>
      <div className="max-w-4xl mx-auto py-8 backdrop-blur-3xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 ">
          <button
            onClick={handleExit}
            className="text-black hover:text-gray-800 font-semibold"
          >
            ← Change Quiz
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-black hover:text-gray-800"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Quiz Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Timer Duration: {timerDuration}s
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={timerDuration}
                  onChange={(e) => {
                    setTimerDuration(Number(e.target.value));
                    reset(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="auto"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="auto"
                  className="text-sm font-semibold text-gray-700"
                >
                  Auto-advance: Show answer for 3s, then next question automatically
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-black mb-2">
            <span>
              Question {currentIndex + 1} of {quizData.length}
            </span>
            <span>
              {Math.round(((currentIndex + 1) / quizData.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / quizData.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Timer + Controls */}
        <div className="flex flex-row items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl px-8 py-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 w-1/5 ">
            {!isRunning && !showAnswer && (
              <button
                onClick={handleStartQuiz}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3  rounded-xl w-full hover:bg-green-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Start Timer
              </button>
            )}
            {isRunning && (
              <button
                onClick={pause}
                className="flex w-full items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}
            {showAnswer && !isLastQuestion && (
              <button
                onClick={handleNext}
                className="flex w-full items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Next Question
                <SkipForward className="w-5 h-5" />
              </button>
            )}
            {showAnswer && isLastQuestion && (
              <button
                onClick={handleRestart}
                className="flex w-full items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                Finish Quiz
              </button>
            )}
          </div>
          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold mb-1 text-black">{seconds}s</div>
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              {isRunning ? (
                <>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span>Running</span>
                </>
              ) : showAnswer ? (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Answer Shown</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  <span>Paused</span>
                </>
              )}
            </div>
          </div>
          {/* Fullscreen Button */}
          <button
            onClick={enterFullScreen}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Fullscreen
          </button>
        </div>

        {/* Question */}
        <div className=" bg-gray-400 rounded-xl shadow-black border border-black p-8 mb-6 mt-6">
          <div className="mb-6">
            <span className="inline-block  bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Question #{currentQuestion.no}
            </span>
            <h2 className="text-3xl font-bold text-black leading-relaxed bengali-font">
              {currentQuestion.question}
            </h2>
          </div>
          <div className="space-y-3 bengali-font text-2xl text-black">
            {["a", "b", "c", "d"].map((opt) => {
              const isCorrect = currentQuestion.correct.toLowerCase() === opt;
              const showCorrect = showAnswer && isCorrect;
              return (
                <div
                  key={opt}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-200 font-bold"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showCorrect
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {opt.toUpperCase()}
                    </span>
                    <p className="text-gray-800 flex-1 pt-1">
                      {currentQuestion[opt]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {showAnswer && currentQuestion.explanation && (
            <div className="mt-6 p-4  bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-semibold text-blue-900 mb-1">Explanation:</p>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Keyboard Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Keyboard: Space = Start/Pause | Enter = Next Question</p>
          {autoAdvance && (
            <p className="text-green-600 font-semibold mt-2">
              🤖 Auto-Advance Mode: Timer → Answer (3s) → Next Question (loops till end)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};