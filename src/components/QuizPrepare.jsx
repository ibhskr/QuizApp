// ==================== QUIZ PREPARE PAGE ====================
import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Play, Pause, SkipForward, RotateCcw, Settings, PlusCircle, Edit2, Trash2, Download, Copy, FileUp, Home, BookOpen, Presentation } from 'lucide-react';



export const QuizPrepare = ({ onNavigate }) => {
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
