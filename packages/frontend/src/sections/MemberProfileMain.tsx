import { useState } from "react";
import ToggleSwitch from '@/components/ToggleSwitch';

const MemberProfileMain = ({ data }: { data: string }) => {
  const [isLoginEnabled, setIsLoginEnabled] = useState(true);

  const handleToggle = () => {
    setIsLoginEnabled(!isLoginEnabled);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      {/* 프로필 Section1 시작 */}
      <div className="border border-[#e0e0e0] rounded-2xl p-6 bg-white shadow-sm hover:border-[#ECEFEF] transition-colors">

        <div className="flex items-center gap-2 mb-6">
          <span className="font-bold text-[#333] text-lg">기본정보</span>
          <button className="text-gray-400 text-sm hover:text-gray-600 transition-colors">ⓘ</button>
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
              <p className="text-[#8e8e8e]">실명</p>
            </div>
          </div>

        </div>

        {/* 2. 전화번호 섹션 */}
        <div className="py-5 border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-[18px] h-[18px] text-[#666]"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
              <span className="text-[#333] font-medium">+82 010 1234 5678</span>
            </div>

          </div>

          <div className="flex items-center justify-between bg-[#f8f9fa] p-4 rounded-xl">
            <span className="text-[#333] font-medium">이 번호로 로그인하기</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm transition-colors ${isLoginEnabled ? 'text-[#2db400]' : 'text-gray-400'}`}>
                {isLoginEnabled ? 'ON' : 'OFF'}
              </span>

              <div
                onClick={handleToggle}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isLoginEnabled ? 'bg-[#2db400]' : 'bg-gray-300'}`}
              >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-[18px] h-[18px] text-[#666]"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              <span className="text-[#333]">이메일</span>
            </div>

          </div>
          <div className="flex items-center justify-between text-[#8e8e8e]">
          </div>
        </div>
        {/* ✅ 통합 '내 정보 수정' 버튼 추가 */}
        <div className="mt-8 flex justify-end ">
          <button onClick={()=>{alert('준비중..')}} 
          className="px-4 py-1.5 bg-white border border-[#dcdcdc] rounded-lg text-xs text-[#666] transition-all hover:bg-[#fcfcfc] hover:border-[#aaa] active:scale-95 shadow-sm">
            내 정보 수정
          </button>
        </div>
      </div>
      {/* 프로필 Section1 끝 */}

    </div>
  );
};

export default MemberProfileMain;