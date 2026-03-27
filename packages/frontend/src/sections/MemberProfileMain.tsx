import axios from "axios";
import { Smartphone, Mail, Loader2, AlertCircle, Award, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import type { Member } from "shared";


interface MemberProfileMainProps {
  userData: { id: string };
}

// API 응답 규격 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}


const MemberProfileMain = ({ userData }: MemberProfileMainProps) => {
  const [memberInfo, setMemberInfo] = useState<Member | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!userData?.id) return;

      try {
        setStatus("loading");
        // API 엔드포인트는 백엔드 app.get 설정에 맞춰 '/api/get_member' 사용
        const res = await axios.get<ApiResponse<Member>>(
          `http://localhost:3001/api/get_member`,
          { params: { memberId: userData.id } }
        );

        if (res.data.success) {
          setMemberInfo(res.data.data);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Member Data Fetch Error:", err);
        setStatus("error");
      }
    };

    fetchMemberData();
  }, [userData?.id]);

  // 로딩 및 에러 처리 (얼리 리턴)
  if (status === "loading") return (
    <div className="flex flex-col items-center justify-center p-20 text-gray-400 gap-3">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-sm font-medium">프로필을 불러오고 있습니다...</p>
    </div>
  );

  if (status === "error" || !memberInfo) return (
    <div className="flex flex-col items-center justify-center p-20 text-red-400 gap-3">
      <AlertCircle size={32} />
      <p className="text-sm font-medium">사용자 정보를 찾을 수 없습니다.</p>
    </div>
  );



  return (
    <div className="max-w-2xl mx-auto p-4 animate-in fade-in duration-500">
      <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all">

        {/* 상단: 레벨 및 배지 */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Award className="text-yellow-500" size={20} />
            <span className="font-bold text-gray-800 text-lg">LV.{memberInfo.lvl}</span>
            <span className="text-xs text-gray-400 font-normal">({memberInfo.exp_point} EXP)</span>
          </div>
          <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
            <Flame size={14} />
            <span className="text-xs font-bold">{memberInfo.streak}일 연속</span>
          </div>
        </div>

        {/* 프로필 메인 */}
        <div className="flex items-center gap-5 pb-8 border-b border-gray-100">
          <div className="relative">
            <img
              src={memberInfo.img}
              className="w-20 h-20 rounded-full bg-gray-100 object-cover ring-2 ring-gray-50"
              alt="프로필"
              onError={(e) => {
                // 실제 파일 로드에 실패하면 강제로 기본 이미지로 교체
                e.currentTarget.src = "/member/avator.png";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-gray-900">{memberInfo.nickname}</h2>
              <span className="text-sm text-gray-500 font-medium">{memberInfo.name}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {memberInfo.sex} · {memberInfo.age}세 · {memberInfo.mes_name || "소속 없음"}
            </p>
          </div>
        </div>

        {/* 연락처 및 포인트 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Smartphone size={16} />
              <span className="text-sm">{memberInfo.p_number || "연락처 미등록"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={16} />
              <span className="text-sm">{memberInfo.e_mail || "이메일 미등록"}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-xs text-gray-400 mb-1">보유 포인트</span>
            <span className="text-xl font-bold text-blue-600">
              {memberInfo.point?.toLocaleString() ?? "0"} <small className="text-sm font-normal text-gray-500">P</small>
            </span>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="mt-4 flex justify-end pt-4 border-t border-gray-50">
          <button
            onClick={() => alert('회원 정보 수정 페이지로 이동')}
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95 shadow-sm"
          >
            내 정보 수정
          </button>
        </div>

      </div>
    </div>
  );
};

export default MemberProfileMain;