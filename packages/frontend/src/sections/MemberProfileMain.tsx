import { Smartphone, Mail } from "lucide-react";

interface MemberProfileMainProps {
  userData: any;
}

const MemberProfileMain = ({ userData }: MemberProfileMainProps) => {
  console.log("로그인 유저 데이터:", userData);
  if (!userData) return <div className="p-6 text-gray-500">정보를 불러오는 중입니다...</div>;

  const profileImg = `http://localhost:5173${userData.img || "/member/U000002.jpg"}`;

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <div className="border border-[#e0e0e0] rounded-2xl p-6 bg-white shadow-sm hover:border-[#ECEFEF] transition-colors">
        
        {/* 헤더 시작 */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-bold text-[#333] text-lg">기본정보</span>
          <button className="text-gray-400 text-sm hover:text-gray-600 transition-colors">ⓘ</button>
        </div>
        {/* 헤더 끝 */}

        {/* 프로필 섹션 시작 */}
        <div className="flex items-center justify-between pb-6 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-4">
            <img
              src={profileImg}
              width="80" height="80" 
              className="rounded-full bg-[#f8f9fa] object-cover" 
              alt="프로필"
            />
            <div>
              <h2 className="text-2xl font-bold text-[#333]">{userData.nickname}</h2>
              <p className="text-[#8e8e8e]">{userData.name}</p>
            </div>
          </div>
        </div>
        {/* 프로필 섹션 끝 */}

        {/* 전화번호 섹션 시작 */}
        <div className="py-5 border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-[#666]" />
              <span className="text-[#333] font-medium">{userData.p_number || "전화번호 미등록"}</span>
            </div>
          </div>
        </div>
        {/* 전화번호 섹션 끝 */}

        {/* 이메일 섹션 시작 */}
        <div className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#666]" />
              <span className="text-[#333]">{userData.e_mail || "이메일 미등록"}</span>
            </div>
          </div>
        </div>
        {/* 이메일 섹션 끝 */}

        {/* 하단 버튼 시작 */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => alert('준비중..')} 
            className="px-4 py-1.5 bg-white border border-[#dcdcdc] rounded-lg text-xs text-[#666] transition-all hover:bg-[#fcfcfc] hover:border-[#aaa] active:scale-95 shadow-sm"
          >
            내 정보 수정
          </button>
        </div>
        {/* 하단 버튼 끝 */}

      </div>
    </div>
  );
};

export default MemberProfileMain;