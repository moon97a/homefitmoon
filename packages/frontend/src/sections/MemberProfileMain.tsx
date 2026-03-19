import { useState } from "react";

const MemberProfileMain = ({ data }: { data: string }) => {
  // 1. 스위치 상태 관리 (true면 ON, false면 OFF)
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);

  // 2. 스위치 클릭 핸들러
  const handleToggle = () => {
    setIsLoginEnabled(!isLoginEnabled);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* 초록색 테두리 박스 */}
      <div className="border border-[#e0e0e0] rounded-2xl p-6 bg-white shadow-sm hover:border-[#ECEFEF] transition-colors">
        
        {/* 헤더 부분 */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-bold text-[#333] text-lg">기본정보</span>
          <button className="text-gray-400 text-sm">ⓘ</button>
        </div>

        {/* 1. 프로필 섹션 */}
        <div className="flex items-center justify-between pb-6 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-4">
            <img 
              src="https://static.nid.naver.com/images/web/user/default.png" 
              width="80" height="80" className="rounded-full bg-[#f8f9fa]" alt="프로필" 
            />
            <div>
              <h2 className="text-2xl font-bold text-[#333]">닉네임</h2>
              <p className="text-[#8e8e8e]">이메일</p>
            </div>
          </div>
          <button className="px-4 py-1 text-sm text-[#666] border border-[#dcdcdc] rounded bg-[#fcfcfc]">닉네임수정</button>
        </div>

        {/* 2. 전화번호 섹션 */}
        <div className="py-5 border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">📱</span>
              <span className="text-[#333] font-medium">+82 010 1234 5678</span>
            </div>
            <button className="text-[#666] text-sm border px-3 py-1 rounded">수정</button>
          </div>
          
          {/* 로그인 스위치 영역 */}
          <div className="flex items-center justify-between bg-[#f8f9fa] p-4 rounded-xl">
            <span className="text-[#333] font-medium">이 번호로 로그인하기</span>
            <div className="flex items-center gap-2">
              {/* 상태에 따른 텍스트 색상 변경 */}
              <span className={`font-bold text-sm transition-colors ${isLoginEnabled ? 'text-[#2db400]' : 'text-gray-400'}`}>
                {isLoginEnabled ? 'ON' : 'OFF'}
              </span>
              
              {/* 실제 작동하는 스위치 바디 */}
              <div 
                onClick={handleToggle}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isLoginEnabled ? 'bg-[#2db400]' : 'bg-gray-300'}`}
              >
                {/* 스위치 동그라미 (핸들) */}
                <div 
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${isLoginEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 이메일 섹션 */}
        <div className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">✉️</span>
              <span className="text-[#333]">이메일</span>
            </div>
            <button className="text-[#666] text-sm border px-3 py-1 rounded">수정</button>
          </div>
          <div className="flex items-center justify-between text-[#8e8e8e]">
            <div className="flex items-center gap-3">
              <span className="text-lg opacity-50">✉️</span>
              <span>본인확인 이메일 없음</span>
            </div>
            <button className="text-[#2db400] text-sm font-medium border border-[#2db400] px-3 py-1 rounded">등록</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MemberProfileMain;