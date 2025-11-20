import React, { useState, useEffect } from 'react';
import { TOTAL_FLIGHT_TIME_MS } from '../constants';

interface TimerProps {
  isActive: boolean;
  onFinish: () => void;
}

export const Timer: React.FC<TimerProps> = ({ isActive, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(TOTAL_FLIGHT_TIME_MS);

  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1000) {
                clearInterval(interval);
                onFinish();
                return 0;
            }
            return prev - 1000;
        });
      }, 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onFinish]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const urgencyColor = timeLeft < 60000 ? 'text-red-600' : 'text-slate-800';

  return (
    <div className={`font-mono text-4xl font-bold ${urgencyColor} bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200`}>
      {formatTime(timeLeft)}
    </div>
  );
};