import { useState,useEffect } from "react";

export const useTimer = (initialTime, onComplete) => {
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