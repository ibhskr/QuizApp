import React from "react";
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
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router";

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen border border-b-black">
      <div className="w-screen h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <div className="max-w-5xl w-full px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Live Teaching Quiz App
            </h1>
            <p className="text-xl text-gray-600">
              Create engaging quizzes and teach live on YouTube
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Prepare Quiz Card */}
            <div
              onClick={() => navigate("/quiz-prepare")}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Prepare Quiz
              </h2>
              <p className="text-gray-600 mb-6">
                Build your quiz with interactive form. Add questions, options,
                explanations. Export as JSON.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold">
                Start Building <span className="ml-2">→</span>
              </div>
            </div>

            {/* Go For Test Card */}
            <div
              onClick={() => navigate("/test")}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Presentation className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Go For Test
              </h2>
              <p className="text-gray-600 mb-6">
                Upload your quiz JSON and start teaching live. Perfect for
                YouTube streaming with timer and auto-reveal.
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                Start Quiz <span className="ml-2">→</span>
              </div>
            </div>

            {/* Automated Test Card */}
            <div
              onClick={() => navigate("/auto-test")}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Timer className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Automated Test
              </h2>
              <p className="text-gray-600 mb-6">
                Experience auto-timed quiz mode — answers reveal automatically,
                and the next question appears after 3 seconds.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                Try Auto Mode <span className="ml-2">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
