// [ 임포트 시작 ]
import React, { useState, useEffect, useCallback } from 'react';
import { Flame, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import MemberPlansCalendar from "./MemberPlansCalendar";
// [ 임포트 끝 ]

// [ 상수 및 타입 시작 ]
const REQUIRED_XP = 1000;
const LEVEL_TITLES = ['홈트 초보자', '홈트 입문자', '홈트 중급자', '홈트 상급자', '홈트 고수'];
const MEMBER_ID = 'U000002';

interface MemberStats {
  level: number;
  currentXP: number;
  streak: number;
  nickname: string;
  profileImg: string;
}
// [ 상수 및 타입 끝 ]

export default function MemberPlan() {
  // [ 상태 관리 시작 ]
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);
  // [ 상태 관리 끝 ]

  // [ 데이터 로드 로직 시작 ]
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/api/get_member?memberId=${MEMBER_ID}`);
      const result = await res.json();
      
      if (result.success) {
        const m = result.data;
        setMemberStats({
          level: Number(m.LVL ?? m.lvl ?? 0),
          currentXP: Number(m.EXP_POINT ?? m.exp_point ?? 0),
          streak: Number(m.STREAK ?? m.streak ?? 0),
          nickname: m.NICKNAME || m.NAME || '회원',
          profileImg: m.IMG || m.img || '/member/default.jpg'
        });
      }
    } catch (err) {
      console.error("회원 데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  // [ 데이터 로드 로직 끝 ]

  // [ 로딩 뷰 시작 ]
  if (loading || !memberStats) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-bold text-slate-400">데이터를 불러오는 중입니다...</div>;
  }
  // [ 로딩 뷰 끝 ]

  return (
    <div className="flex flex-col gap-3 bg-[#F8FAFC] min-h-screen pb-10">
      
      {/* [ 상단 네비게이션 시작 ] */}
      <div className="px-6 pt-4 flex justify-end items-center">
        <button className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm hover:text-indigo-600 transition-colors">
          <RotateCcw size={14} /> 다음 날 시뮬레이션
        </button>
      </div>
      {/* [ 상단 네비게이션 끝 ] */}

      {/* [ 프로필 헤더 시작 ] */}
      <header className="flex flex-col items-center pt-8 pb-4">
        <div className="relative">
          <img 
            src={`http://localhost:5173${memberStats.profileImg}`} 
            alt={`${memberStats.nickname}님의 프로필`} 
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" 
          />
          <div className="absolute bottom-0 right-0 bg-[#F59E0B] text-white text-xs font-bold w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow">
            {memberStats.level}
          </div>
        </div>
        <h1 className="text-3xl font-black mt-4 text-slate-900 leading-none">운동 목표</h1>
        <p className="text-slate-400 font-medium mt-1">{memberStats.nickname}님, 오늘도 힘내세요!</p>
      </header>
      {/* [ 프로필 헤더 끝 ] */}

      {/* [ 통합 대시보드 카드 시작 ] */}
      <div className="max-w-7xl mx-auto w-full px-6 mt-6">
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 hover:shadow-md transition-shadow">
          
          {/* 경험치 섹션 */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-slate-400 text-sm font-medium">현재 레벨</span>
                <h3 className="text-xl font-bold">
                  {LEVEL_TITLES[memberStats.level] || '홈트 고수'} (Lv.{memberStats.level})
                </h3>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-sm font-medium">다음 레벨</span>
                <h3 className="text-xl font-bold text-[#6366F1]">
                  {LEVEL_TITLES[memberStats.level + 1] || '최고 등급'} (Lv.{memberStats.level + 1})
                </h3>
              </div>
            </div>
            
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <motion.div 
                className="h-full bg-[#6366F1] rounded-full" 
                initial={{ width: 0 }} 
                animate={{ width: `${Math.min((memberStats.currentXP / REQUIRED_XP) * 100, 100)}%` }} 
              />
            </div>
            <p className="text-slate-400 text-sm font-medium">
              {memberStats.currentXP} / {REQUIRED_XP} XP · {Math.round(Math.min((memberStats.currentXP / REQUIRED_XP) * 100, 100))}% 완료
            </p>
          </div>

          <div className="hidden md:block w-px h-20 bg-slate-100" />

          {/* 스트릭 섹션 */}
          <div className="flex items-center gap-5 min-w-[200px]">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${memberStats.streak > 0 ? 'bg-orange-50' : 'bg-slate-50'}`}>
              <Flame size={32} className={memberStats.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-200'} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">연속 목표 달성</p>
              <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">{memberStats.streak}일 연속</h3>
            </div>
          </div>

        </div>
      </div>
      {/* [ 통합 대시보드 카드 끝 ] */}

      {/* [ 하단 캘린더 섹션 시작 ] */}
      <div className="mt-6">
        <MemberPlansCalendar />
      </div>
      {/* [ 하단 캘린더 섹션 끝 ] */}

    </div>
  );
}