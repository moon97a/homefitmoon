import React, { useState } from 'react';
import { MapPin, Globe, Info } from 'lucide-react';
import ToggleSwitch from '@/components/ToggleSwitch'; // ✅ 새로 만든 토글 스위치 컴포넌트 임포트
import { Bell, Clock } from 'lucide-react'

// ✅ 1. 토글 스위치가 받을 데이터의 타입을 미리 정의합니다.
interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const LoginSecuritySettings = () => {
  const [isBestFitAutoSave, setIsBestFitAutoSave] = useState(false);
  const [isOverseasBlocked, setIsOverseasBlocked] = useState(true);
  const [isMarketingInfoReceived, setIsMarketingInfoReceived] = useState(true);
  const [isReminderOn, setIsReminderOn] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [isOn, setIsOn] = useState<boolean>(false);

  return (
    <div className="max-w-2xl p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-1 mb-3">
        <h2 className="text-lg font-bold text-gray-800">설정</h2>
        <Info size={16} className="text-gray-400 cursor-help" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">BestFit 자동 저장</span>
          </div>
          <ToggleSwitch
            isOn={isBestFitAutoSave} 
            onToggle={() => setIsBestFitAutoSave(!isBestFitAutoSave)} 
          />
        </div>

        <div className="border-t border-gray-100 mx-6"></div>

<div className="border-b border-gray-100">
      {/* 상단: 토글 및 시간 표시 영역 */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <Bell size={20} className={isReminderOn ? "text-blue-500" : "text-gray-500"} />
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">운동 리마인드</span>
            {/* 토글이 켜져 있을 때만 버튼 옆(아래)에 선택된 시간 표시 */}
            {isReminderOn && (
              <span className="text-xs text-blue-600 font-semibold">
                매일 {reminderTime} 알림
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 토글 스위치 */}
          <ToggleSwitch 
            isOn={isReminderOn} 
            onToggle={() => setIsReminderOn(!isReminderOn)} 
          />
        </div>
      </div>

      {/* 하단: 토글이 켜졌을 때만 나타나는 시간 선택 란 */}
      {isReminderOn && (
        <div className="px-6 pb-5 animate-fadeIn">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <Clock size={18} className="text-gray-400" />
            <span className="text-sm text-gray-600 mr-auto">알림 시간 설정</span>
            <input 
              type="time" 
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-transparent text-gray-800 font-bold focus:outline-none cursor-pointer"
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-400 px-1">
            * 설정하신 시간에 맞춰 HomeFit이 운동 알림을 보내드려요.
          </p>
        </div>
      )}
    </div>
    
        <div className="border-t border-gray-100 mx-6"></div>

        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">마케팅 정보 수신</span>
          </div>
          <ToggleSwitch 
            isOn={isMarketingInfoReceived} 
            onToggle={() => setIsMarketingInfoReceived(!isMarketingInfoReceived)} 
          />
        </div>
      </div>
    </div>
  );
};



export default LoginSecuritySettings;