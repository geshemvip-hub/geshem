import React from 'react';

interface JudgeKeypadProps {
  onInput: (val: string) => void;
  onDelete: () => void;
  currentValue: string;
}

export const JudgeKeypad: React.FC<JudgeKeypadProps> = ({ onInput, onDelete, currentValue }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto mt-4">
      <div className="col-span-3 bg-slate-100 p-4 rounded-lg mb-2 text-center">
          <span className="text-3xl font-bold text-slate-800 h-8 block">{currentValue || "-"}</span>
      </div>
      
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => onInput(k)}
          className="bg-white border border-slate-200 shadow-sm rounded-lg p-4 text-2xl font-semibold active:bg-blue-50 transition-colors text-slate-700"
        >
          {k}
        </button>
      ))}
      
      <button
        onClick={onDelete}
        className="bg-red-50 border border-red-100 shadow-sm rounded-lg p-4 text-xl font-semibold text-red-600 active:bg-red-100 transition-colors flex items-center justify-center"
      >
        מחק
      </button>
    </div>
  );
};