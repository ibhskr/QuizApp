import React, { useState, useEffect, useCallback } from "react";
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
export const Test = ({ onNavigate }) => {
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFinished, setIsFinish] = useState(false);
  const navigate = useNavigate();
  const handleTimerComplete = useCallback(() => {
    setShowAnswer(true);
    if (autoAdvance) {
      setTimeout(() => {
        handleNext();
      }, 3000);
    }
  }, [autoAdvance]);

  const { seconds, isRunning, start, pause, reset } = useTimer(
    timerDuration,
    handleTimerComplete
  );

  const handleNext = () => {
    if (quizData && currentIndex < quizData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      reset(timerDuration);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    reset(timerDuration);
    // setIsFinish(true);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleExit}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Change Quiz
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  Auto-advance (3s delay)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentIndex + 1} of {quizData.length}
            </span>
            <span>
              {Math.round(((currentIndex + 1) / quizData.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / quizData.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Timer + Controls */}
        <div className="flex flex-row justify-between">
          <div className="flex flex-wrap gap-3 justify-center h-16">
            {!isRunning && !showAnswer && (
              <button
                onClick={start}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
              >
                <Play className="w-5 h-5" />
                Start Timer
              </button>
            )}
            {isRunning && (
              <button
                onClick={pause}
                className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-semibold"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            )}
            {showAnswer && !isLastQuestion && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Next Question
                <SkipForward className="w-5 h-5" />
              </button>
            )}
            {showAnswer && isLastQuestion && (
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                Restart Quiz
              </button>
            )}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div
              className={`text-6xl font-bold mb-2 ${
                seconds / timerDuration > 0.5
                  ? "text-green-600"
                  : seconds / timerDuration > 0.25
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {seconds}s
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              {isRunning ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Timer Running</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span>Timer Paused</span>
                </>
              )}
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={enterFullScreen}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg h-16 hover:bg-indigo-700"
          >
            Go Fullscreen
          </button>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              Question #{currentQuestion.no}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>
          <div className="space-y-3">
            {["a", "b", "c", "d"].map((opt) => {
              const isCorrect = currentQuestion.correct.toLowerCase() === opt;
              const showCorrect = showAnswer && isCorrect;
              return (
                <div
                  key={opt}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        showCorrect
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-700"
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
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-semibold text-blue-900 mb-1">Explanation:</p>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Keyboard Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Keyboard: Space = Start/Pause | Enter = Next Question</p>
        </div>
      </div>
    </div>
  );
};
