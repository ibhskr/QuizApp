import React from "react";
import { Trophy, RotateCcw, Home } from "lucide-react";

export const CompletedPage = ({ score = 8, total = 10, onRestart, onHome }) => {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 p-6">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full text-center p-10 transform transition-all hover:scale-[1.02]">
        {/* Trophy Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-300 blur-3xl opacity-40 animate-pulse"></div>
            <Trophy className="w-24 h-24 text-yellow-500 animate-bounce relative z-10" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Quiz Completed! 🎉
        </h1>
        <p className="text-gray-600 mb-8">
          You’ve reached the end of the quiz. Great job!
        </p>

        {/* Score Section */}
        

       
       </div>
       

     
    </div>
  );
};
