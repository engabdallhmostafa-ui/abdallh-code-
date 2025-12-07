import React, { useEffect, useState } from 'react';
import { THINKING_MESSAGES, TUV_BLUE } from '../constants';

interface ThinkingIndicatorProps {
  isVisible: boolean;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ isVisible }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0);
      setProgress(0);
      return;
    }

    // Message rotation
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 2000);

    // Simulated Progress Bar (Fast start, slow finish)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev; // Stall at 98% until done
        const remaining = 100 - prev;
        // Move 10% of the remaining distance roughly
        const step = Math.max(1, Math.floor(Math.random() * (remaining / 5)));
        return prev + step;
      });
    }, 300);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col w-full max-w-[85%] md:max-w-md mb-6 bg-white border border-blue-100 rounded-xl p-4 shadow-sm animate-pulse-subtle">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <span className="text-xs font-bold text-[#00549F]">
            {THINKING_MESSAGES[messageIndex]}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-gray-400">{progress}%</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-[#00549F] h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-2 flex justify-between text-[10px] text-gray-400 font-medium">
        <span>Processing Engineering Data...</span>
        <span>SBC 2024 / ACI 318</span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;