// ToggleSwitch.tsx (따로 만든 파일)
import React from 'react';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ isOn, onToggle }: ToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ${
        isOn ? 'bg-green-500' : 'bg-gray-400'
      }`}
    >
      {/* ... 스위치 내부 코드 생략 ... */}
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${isOn ? 'translate-x-8' : 'translate-x-1'}`} />
    </button>
  );
};

export default ToggleSwitch; 