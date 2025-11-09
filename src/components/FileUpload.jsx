import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Play, Pause, SkipForward, RotateCcw, Settings, PlusCircle, Edit2, Trash2, Download, Copy, FileUp, Home, BookOpen, Presentation } from 'lucide-react';
import { useNavigate } from 'react-router';

export const FileUpload = ({ onFileLoad, onNavigate }) => {
  const [isDragging, setIsDragging] = useState(false);
const navigate = useNavigate();
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
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold">
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
              <p className="text-sm text-indigo-600">or click to browse</p>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Choose File</button>
          </label>
        </div>
      </div>
    </div>
  );
};
