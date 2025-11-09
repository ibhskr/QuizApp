import React from "react";
import { Trophy, Youtube, RotateCcw, Home } from "lucide-react";
import bgimg from "../assets/bg2.avif";
import { useNavigate } from "react-router";
export const CompletedPage = () => {
  const navigate = useNavigate();
  const handleSubscribe = () => {
    window.open("https://www.youtube.com/@Way2StudyIndia", "_blank");
  };

  const handleRetry = () => {
    // Logic for retry (you can navigate or reload quiz)
    window.location.reload();
  };

  const handleHome = () => {
    // Navigate to homepage if you have router
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div
        className="absolute inset-0 bg-cover bg-center blur-lg scale-105"
        style={{
          backgroundImage: `url(${bgimg})`,
        }}
      ></div>{" "}
      {/* Card */}
      <div className="bg-white rounded-3xl z-100 shadow-2xl max-w-lg w-full text-center p-10 transform transition-all hover:scale-[1.02]">
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
        <p className="text-gray-600 text-lg mb-8">
          Great job completing the quiz! Every small step takes you closer to
          your goal. 🚀
        </p>

        {/* Motivational Quote */}
        <blockquote className="italic text-purple-700 font-semibold mb-8">
          "Success doesn’t come from what you do occasionally, it comes from
          what you do consistently."
        </blockquote>

        {/* Subscribe Section */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-5 text-white mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Enjoyed the Quiz?</h2>
          <p className="text-sm opacity-90 mb-4">
            Subscribe to our <strong>Way2Study India</strong> YouTube channel
            for more quizzes, study tips, and motivational videos!
          </p>
          <button
            onClick={handleSubscribe}
            className="flex items-center justify-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-all mx-auto"
          >
            <Youtube className="w-5 h-5" />
            Subscribe Now
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition-all w-full sm:w-auto"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Quiz
          </button>
          <button
            onClick={()=>navigate("/")}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-200 font-semibold transition-all w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
      {/* Footer Text */}
      <p className="mt-8 text-gray-600 text-sm text-center max-w-md">
        Keep practicing daily, and you’ll soon master every concept. 💪
        <br />
        <span className="font-semibold text-purple-700">
          Way2Study India wishes you success!
        </span>
      </p>
    </div>
  );
};
