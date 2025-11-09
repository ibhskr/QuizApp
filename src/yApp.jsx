import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Play, Pause, SkipForward, RotateCcw, Settings, PlusCircle, Edit2, Trash2, Download, Copy, FileUp, Home, BookOpen, Presentation } from 'lucide-react';

// ==================== CUSTOM TIMER HOOK ====================
const useTimer = (initialTime, onComplete) => {
  const [seconds, setSeconds] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => {
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

// ==================== QUIZ PREPARE PAGE ====================
const QuizPrepare = ({ onNavigate }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    no: 1,
    question: '',
    a: '',
    b: '',
    c: '',
    d: '',
    correct: 'a',
    explanation: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const resetForm = () => {
    setCurrentQuestion({
      no: questions.length + 1,
      question: '',
      a: '',
      b: '',
      c: '',
      d: '',
      correct: 'a',
      explanation: ''
    });
    setEditingIndex(null);
  };

  const handleInputChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: field === 'no' ? parseInt(value) || 1 : value
    }));
  };

  const validateQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return false;
    }
    if (!currentQuestion.a.trim() || !currentQuestion.b.trim() || !currentQuestion.c.trim() || !currentQuestion.d.trim()) {
      alert('Please fill all options (A, B, C, D)');
      return false;
    }
    return true;
  };

  const handleAddQuestion = () => {
    if (!validateQuestion()) return;
    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = { ...currentQuestion };
      setQuestions(updated);
    } else {
      setQuestions([...questions, { ...currentQuestion }]);
    }
    resetForm();
  };

  const handleEdit = (index) => {
    setCurrentQuestion(questions[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
      if (editingIndex === index) resetForm();
    }
  };

  const handleExportJSON = () => {
    if (questions.length === 0) {
      alert('Please add at least one question before exporting');
      return;
    }
    const jsonString = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(questions, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          if (Array.isArray(json)) {
            setQuestions(json);
            resetForm();
            alert('JSON imported successfully!');
          } else {
            alert('Invalid JSON format');
          }
        } catch (error) {
          alert('Error parsing JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all questions?')) {
      setQuestions([]);
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold">
              <Home className="w-5 h-5" />Home
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Prepare Quiz</h1>
          </div>
          <div className="flex gap-2">
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" id="import-json" />
            <label htmlFor="import-json" className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer text-sm">
              <FileUp className="w-4 h-4" />Import
            </label>
            <button onClick={handleClearAll} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">Clear All</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Question Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editingIndex !== null ? 'Edit Question' : 'Add New Question'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Question Number</label>
                <input type="number" value={currentQuestion.no} onChange={(e) => handleInputChange('no', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" min="1" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
                <textarea value={currentQuestion.question} onChange={(e) => handleInputChange('question', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" rows="3" placeholder="Enter your question..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Option A *</label>
                  <input type="text" value={currentQuestion.a} onChange={(e) => handleInputChange('a', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Option A" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Option B *</label>
                  <input type="text" value={currentQuestion.b} onChange={(e) => handleInputChange('b', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Option B" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Option C *</label>
                  <input type="text" value={currentQuestion.c} onChange={(e) => handleInputChange('c', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Option C" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Option D *</label>
                  <input type="text" value={currentQuestion.d} onChange={(e) => handleInputChange('d', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Option D" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correct Answer *</label>
                <select value={currentQuestion.correct} onChange={(e) => handleInputChange('correct', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value="a">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                  <option value="d">D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Explanation (Optional)</label>
                <textarea value={currentQuestion.explanation} onChange={(e) => handleInputChange('explanation', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" rows="2" placeholder="Add explanation..." />
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddQuestion} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
                  <PlusCircle className="w-5 h-5" />{editingIndex !== null ? 'Update' : 'Add Question'}
                </button>
                {editingIndex !== null && <button onClick={resetForm} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancel</button>}
              </div>
            </div>
          </div>

          {/* JSON Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">JSON Preview ({questions.length})</h2>
              <div className="flex gap-2">
                <button onClick={handleCopyJSON} disabled={questions.length === 0} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                  <Copy className="w-4 h-4" />{copySuccess ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleExportJSON} disabled={questions.length === 0} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                  <Download className="w-4 h-4" />Export
                </button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto" style={{ maxHeight: '600px' }}>
              <pre className="text-green-400 text-sm font-mono">{questions.length > 0 ? JSON.stringify(questions, null, 2) : '[\n  // Your questions appear here\n]'}</pre>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Added Questions ({questions.length})</h2>
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">Q{q.no}</span>
                      <span className="font-semibold text-gray-800">{q.question}</span>
                    </div>
                    <div className="text-sm text-gray-600">Correct: <span className="font-semibold text-green-600">{q.correct.toUpperCase()}</span>{q.explanation && <span className="ml-2 text-gray-500">• Has explanation</span>}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(idx)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== TEST PAGE ====================
const Test = ({ onNavigate }) => {
  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleTimerComplete = useCallback(() => {
    setShowAnswer(true);
    if (autoAdvance) {
      setTimeout(() => {
        handleNext();
      }, 3000);
    }
  }, [autoAdvance]);

  const { seconds, isRunning, start, pause, reset } = useTimer(timerDuration, handleTimerComplete);

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      reset(timerDuration);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    reset(timerDuration);
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
      if (e.code === 'Space' && !showAnswer) {
        e.preventDefault();
        isRunning ? pause() : start();
      } else if (e.code === 'Enter' && showAnswer && currentIndex < quizData.length - 1) {
        handleNext();
      }
    };
    if (quizData) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isRunning, showAnswer, currentIndex, quizData]);

  if (!quizData) {
    return <FileUploadScreen onFileLoad={handleFileLoad} onNavigate={onNavigate} />;
  }

  const currentQuestion = quizData[currentIndex];
  const isLastQuestion = currentIndex === quizData.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleExit} className="text-gray-600 hover:text-gray-800 font-semibold">← Change Quiz</button>
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <Settings className="w-5 h-5" />Settings
          </button>
        </div>

        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Quiz Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Timer Duration: {timerDuration}s</label>
                <input type="range" min="10" max="60" step="5" value={timerDuration} onChange={(e) => { setTimerDuration(Number(e.target.value)); reset(Number(e.target.value)); }} className="w-full" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="auto" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} className="w-4 h-4" />
                <label htmlFor="auto" className="text-sm font-semibold text-gray-700">Auto-advance (3s delay)</label>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentIndex + 1} of {quizData.length}</span>
            <span>{Math.round(((currentIndex + 1) / quizData.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }} />
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold mb-2 ${(seconds / timerDuration) > 0.5 ? 'text-green-600' : (seconds / timerDuration) > 0.25 ? 'text-yellow-600' : 'text-red-600'}`}>{seconds}s</div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            {isRunning ? <><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span>Timer Running</span></> : <><div className="w-2 h-2 bg-gray-400 rounded-full" /><span>Timer Paused</span></>}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">Question #{currentQuestion.no}</span>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">{currentQuestion.question}</h2>
          </div>
          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((opt) => {
              const isCorrect = currentQuestion.correct.toLowerCase() === opt;
              const showCorrect = showAnswer && isCorrect;
              return (
                <div key={opt} className={`p-4 rounded-lg border-2 transition-all ${showCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${showCorrect ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>{opt.toUpperCase()}</span>
                    <p className="text-gray-800 flex-1 pt-1">{currentQuestion[opt]}</p>
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

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!isRunning && !showAnswer && (
            <button onClick={start} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
              <Play className="w-5 h-5" />Start Timer
            </button>
          )}
          {isRunning && (
            <button onClick={pause} className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-semibold">
              <Pause className="w-5 h-5" />Pause
            </button>
          )}
          {showAnswer && !isLastQuestion && (
            <button onClick={handleNext} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold">
              Next Question<SkipForward className="w-5 h-5" />
            </button>
          )}
          {showAnswer && isLastQuestion && (
            <button onClick={handleRestart} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold">
              <RotateCcw className="w-5 h-5" />Restart Quiz
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Keyboard: Space = Start/Pause | Enter = Next Question</p>
        </div>
      </div>
    </div>
  );
};

// ==================== FILE UPLOAD SCREEN ====================
const FileUploadScreen = ({ onFileLoad, onNavigate }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (Array.isArray(json) && json.length > 0) {
            onFileLoad(json);
          } else {
            alert('Invalid JSON format.');
          }
        } catch (error) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a JSON file.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <button onClick={() => onNavigate('home')} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold">
          <Home className="w-5 h-5" />Home
        </button>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Start Teaching</h1>
          <p className="text-gray-600">Upload your quiz JSON to begin</p>
        </div>
        <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }} className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}`}>
          <input type="file" accept=".json" onChange={(e) => handleFile(e.target.files[0])} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-gray-600 mb-4">
              <p className="font-semibold mb-2">Drop your JSON file here</p>
              <p className="text-sm">or click to browse</p>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Choose File</button>
          </label>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const navigate = (page) => setCurrentPage(page);

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Live Teaching Quiz App</h1>
            <p className="text-xl text-gray-600">Create engaging quizzes and teach live on YouTube</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div onClick={() => navigate('prepare')} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Prepare Quiz</h2>
              <p className="text-gray-600 mb-6">Build your quiz with interactive form. Add questions, options, explanations. Export as JSON.</p>
              <div className="flex items-center text-indigo-600 font-semibold">Start Building <span className="ml-2">→</span></div>
            </div>
            <div onClick={() => navigate('test')} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Presentation className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Go For Test</h2>
              <p className="text-gray-600 mb-6">Upload your quiz JSON and start teaching live. Perfect for YouTube streaming with timer and auto-reveal.</p>
              <div className="flex items-center text-green-600 font-semibold">Start Quiz <span className="ml-2">→</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'prepare') {
    return <QuizPrepare onNavigate={navigate} />;
  }

  if (currentPage === 'test') {
    return <Test onNavigate={navigate} />;
  }

  return null;
};

export default App;