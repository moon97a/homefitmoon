// [ 임포트 시작 ]
import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Plus, Flame, Dumbbell, Timer, Star,
  Target, Heart, Zap, Footprints, Trash2, HelpCircle, RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WdogBreadClum from "@/components/WdogBreadClum";
// [ 임포트 끝 ]

// [ 타입 및 상수 시작 ]
type Tab = '일일 목표' | '주간 목표';

interface Goal {
  id: number;
  iconName: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  iconColor: string;
  isRepresentative: boolean;
  isAchievedToday: boolean;
  goalType: string;
}

const iconMap: Record<string, any> = { Dumbbell, Flame, Footprints, Timer, Target, Heart, Zap };

const iconOptions = [
  { name: 'Target', icon: Target, color: 'bg-indigo-500' },
  { name: 'Dumbbell', icon: Dumbbell, color: 'bg-indigo-500' },
  { name: 'Flame', icon: Flame, color: 'bg-orange-500' },
  { name: 'Footprints', icon: Footprints, color: 'bg-green-500' },
  { name: 'Timer', icon: Timer, color: 'bg-purple-500' },
  { name: 'Heart', icon: Heart, color: 'bg-red-500' },
  { name: 'Zap', icon: Zap, color: 'bg-yellow-500' },
];

const REQUIRED_XP = 1000;
const ACHIEVEMENT_XP = 200;
const LEVEL_TITLES = ['홈트 초보자', '홈트 입문자', '홈트 중급자', '홈트 상급자', '홈트 고수'];
const MEMBER_ID = 'U000002';
// [ 타입 및 상수 끝 ]

// [ 서브 컴포넌트 시작 ]
const CharacterAvatar = ({ level }: { level: number }) => (
  <div className="relative">
    <div className="w-24 h-24 bg-[#818CF8] rounded-full flex items-center justify-center text-white shadow-lg">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>
    <div className="absolute bottom-0 right-0 bg-[#F59E0B] text-white text-xs font-bold w-7 h-7 rounded-full border-4 border-white flex items-center justify-center shadow">{level}</div>
  </div>
);

const XPBar = ({ currentXP, requiredXP, currentLevel, nextLevel }: any) => {
  const progress = Math.min((currentXP / requiredXP) * 100, 100);
  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-end mb-4">
        <div><span className="text-slate-400 text-sm font-medium">현재 레벨</span><h3 className="text-xl font-bold">{currentLevel}</h3></div>
        <div className="text-right"><span className="text-slate-400 text-sm font-medium">다음 레벨</span><h3 className="text-xl font-bold text-[#6366F1]">{nextLevel}</h3></div>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
        <motion.div className="h-full bg-[#6366F1] rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>
      <p className="text-slate-400 text-sm font-medium">{currentXP} / {requiredXP} XP · {Math.round(progress)}% 완료</p>
    </div>
  );
};
// [ 서브 컴포넌트 끝 ]

// [ 메인 컴포넌트 시작 ]
export default function MemberPlan() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [streak, setStreak] = useState(0);
  const [currentXP, setCurrentXP] = useState(0);
  const [level, setLevel] = useState(0);
  const [memberName, setMemberName] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('일일 목표');
  const [modalTitle, setModalTitle] = useState('');
  const [modalTarget, setModalTarget] = useState('30');
  const [modalUnit, setModalUnit] = useState('분');
  const [selectedIconIdx, setSelectedIconIdx] = useState(4);
  const [xpGainNotify, setXpGainNotify] = useState<boolean>(false);

  // [ 데이터 로드 로직 시작 ]
  const loadInitialData = useCallback(async () => {
    try {
      const memberRes = await fetch(`http://localhost:3001/api/get_member?memberId=${MEMBER_ID}`);
      const memberResult = await memberRes.json();
      if (memberResult.success) {
        const m = memberResult.data;
        setLevel(Number(m.LVL ?? m.lvl ?? 0));
        setCurrentXP(Number(m.EXP_POINT ?? m.exp_point ?? 0));
        setStreak(Number(m.STREAK ?? m.streak ?? 0));
        setMemberName(m.NAME ?? m.name ?? '');
      }

      const goalsRes = await fetch(`http://localhost:3001/api/get_member_goals?memberId=${MEMBER_ID}`);
      const goalsResult = await goalsRes.json();
      if (goalsResult.success) {
        const mapped = (goalsResult.data || []).map((g: any) => ({
          id: g.ID ?? g.id,
          iconName: g.ICON_NAME ?? g.icon_name,
          title: g.TITLE ?? g.title,
          current: Number(g.CURRENT_VAL ?? g.current_val ?? 0),
          target: Number(g.TARGET_VAL ?? g.target_val ?? 0),
          unit: g.UNIT ?? g.unit,
          iconColor: g.ICON_COLOR ?? g.icon_color,
          isRepresentative: (g.IS_REPRESENTATIVE ?? g.is_representative) === 'Y',
          isAchievedToday: (g.IS_ACHIEVED_TODAY ?? g.is_achieved_today) === 'Y',
          goalType: String(g.GOAL_TYPE ?? g.goal_type ?? '').trim()
        }));
        setGoals(mapped);
      }
    } catch (err) { console.error("데이터 로드 실패:", err); }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  // [ 데이터 로드 로직 끝 ]

  // [ 이벤트 핸들러 시작 ]

  const handleSetRepresentative = async (goalId: number) => {
    try {
      const res = await fetch('http://localhost:3001/api/set_representative_goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: MEMBER_ID, goalId })
      });
      if (res.ok) {
        alert("⭐ 대표 목표가 설정되었습니다!");
        await loadInitialData();
      }
    } catch (err) { console.error(err); }
  };

  const handleAddGoal = async () => {
    if (!modalTitle.trim()) return alert("목표 이름을 입력해주세요!");
    const newGoalData = {
      member_id: MEMBER_ID,
      title: modalTitle,
      icon_name: iconOptions[selectedIconIdx].name,
      icon_color: iconOptions[selectedIconIdx].color,
      target_val: Number(modalTarget),
      unit: modalUnit,
      is_representative: goals.length === 0 ? 'Y' : 'N',
      goal_type: activeTab 
    };
    try {
      const res = await fetch('http://localhost:3001/api/add_member_goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoalData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setModalTitle('');
        await loadInitialData(); 
      }
    } catch (err) { console.error(err); }
  };

  const updateProgress = async (id: number, val: number) => {
    try {
      const res = await fetch('http://localhost:3001/api/update_goal_progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId: id, memberId: MEMBER_ID, currentVal: val })
      });

      if (res.ok) {
        const goal = goals.find(g => g.id === id);
        if (goal && val >= goal.target && !goal.isAchievedToday) {
          let newExp = currentXP + ACHIEVEMENT_XP;
          let newLvl = level;

          // ★ 레벨업 계산 로직
          if (newExp >= REQUIRED_XP) {
            newLvl += 1;
            newExp -= REQUIRED_XP;
            alert(`🎊 레벨업 축하합니다! [${LEVEL_TITLES[newLvl] || '홈트 고수'}] 등급이 되었습니다!`);
          }

          setXpGainNotify(true);
          setTimeout(() => setXpGainNotify(false), 2000);
          
          await fetch('http://localhost:3001/api/update_member_stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberId: MEMBER_ID, lvl: newLvl, expPoint: newExp })
          });
        }
        await loadInitialData(); 
      }
    } catch (err) { console.error(err); }
  };

  const handleNextDay = async () => {
    const repGoal = goals.find(g => g.isRepresentative);
    
    // 대표 목표가 없으면 스트릭을 계산할 수 없음
    if (!repGoal) {
      return alert("⚠️ 별표(⭐)를 눌러 대표 목표를 먼저 설정해주세요!");
    }

    let nextStreak = streak;
    if (repGoal.current >= repGoal.target) {
      nextStreak += 1;
      alert(`🔥 대단해요! ${nextStreak}일 연속 목표 달성 성공!`);
    } else {
      nextStreak = 0;
      alert("😢 대표 목표를 달성하지 못해 연속 성공 기록이 초기화되었습니다.");
    }

    try {
      const res = await fetch('http://localhost:3001/api/simulate_next_day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: MEMBER_ID, streakIncr: nextStreak })
      });
      if (res.ok) await loadInitialData(); 
    } catch (err) { console.error(err); }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/delete_member_goal?goalId=${id}`, { method: 'DELETE' });
      if (res.ok) await loadInitialData();
    } catch (err) { console.error(err); }
  };
  // [ 이벤트 핸들러 끝 ]

  // [ 렌더링 준비 ]
  const filteredGoals = goals.filter(g => g.goalType.includes(activeTab.substring(0, 2)));

  return (
    <div className="flex flex-col gap-3 bg-[#F8FAFC] pb-20">
      <div className="flex gap-4">
        <WdogBreadClum page="MemberPlan" />
      </div>
      {/* 상단 네비게이션 및 시뮬레이션 버튼 */}
      <div className="px-6 pt-4 flex justify-between items-center">
        
        <button onClick={handleNextDay} className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm hover:text-indigo-600 transition-colors">
          <RotateCcw size={14} /> 다음 날 시뮬레이션
        </button>
      </div>

      {/* 헤더 섹션 */}
      <header className="flex flex-col items-center pt-8 pb-4">
        <CharacterAvatar level={level} />
        <h1 className="text-3xl font-black mt-4 text-slate-900 leading-none">운동 목표</h1>
        <p className="text-slate-400 font-medium mt-1">님, 오늘도 힘내세요!</p>
      </header>

      {/* 상태 대시보드 (XP 및 스트릭) */}
      <div className="max-w-6xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-6">
        <div className="md:col-span-2">
          <XPBar 
            currentXP={currentXP} 
            requiredXP={REQUIRED_XP} 
            currentLevel={`${LEVEL_TITLES[level] || '홈트 고수'} (Lv.${level})`} 
            nextLevel={`${LEVEL_TITLES[level + 1] || '만렙 달성'} (Lv.${level+1})`} 
          />
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${streak > 0 ? 'bg-orange-50' : 'bg-slate-50'}`}>
            <Flame size={32} className={streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300'} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">연속 목표 달성</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">{streak}일 연속</h3>
          </div>
        </div>
      </div>

      {/* 목표 리스트 섹션 */}
      <div className="max-w-6xl mx-auto w-full px-6">
        <div className="flex justify-between items-center border-b border-slate-200 mb-8 mt-4">
          <div className="flex gap-8">
            {['일일 목표', '주간 목표'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as Tab)} className={`pb-4 text-lg font-bold transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                {tab}
                {activeTab === tab && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" />}
              </button>
            ))}
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#6366F1] text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg hover:bg-[#5558e6] transition-all mb-2">
            <Plus size={20} strokeWidth={3} /> 목표 추가하기
          </button>
        </div>

        {filteredGoals.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><Plus size={32} /></div>
            <p className="text-slate-400 font-bold">아직 설정된 {activeTab}가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className={`relative bg-white p-7 rounded-[32px] border ${goal.isRepresentative ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-100'} shadow-sm transition-hover hover:shadow-lg flex flex-col justify-between group`}>
                <button onClick={() => handleSetRepresentative(goal.id)} className={`absolute top-6 left-16 p-2 rounded-full transition-all ${goal.isRepresentative ? 'text-amber-400 bg-amber-50' : 'text-slate-200 hover:text-slate-400 bg-slate-50'}`}>
                  <Star size={20} fill={goal.isRepresentative ? "currentColor" : "none"} />
                </button>
                <button onClick={() => handleDeleteGoal(goal.id)} className="absolute top-6 right-6 p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={20} />
                </button>
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${goal.iconColor} text-white mb-6 shadow-md`}>
                    {React.createElement(iconMap[goal.iconName] || Dumbbell, { size: 24 })}
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest leading-tight">
                    {goal.title} {goal.isAchievedToday && <span className="text-xs text-green-500 font-bold ml-1">달성!</span>}
                  </h4>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                    <motion.div className={`h-full ${goal.iconColor}`} initial={{ width: 0 }} animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <span className="text-3xl font-black">{goal.current}</span>
                    <span className="text-slate-300 font-bold ml-1.5 text-lg">/ {goal.target} {goal.unit}</span>
                  </div>
                  <button onClick={() => {
                    const val = prompt('진행도를 입력하세요:', String(goal.current));
                    if (val !== null) updateProgress(goal.id, Number(val));
                  }} className="text-xs font-bold text-indigo-500 hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">업데이트</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 경험치 알림 팝업 */}
      <AnimatePresence>
        {xpGainNotify && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 left-10 z-50 bg-[#111827] text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3">
            <Zap className="text-yellow-400" /> 목표 달성! 경험치 +200 XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* 목표 추가 모달 (생략된 경우를 대비해 기존 구조 유지) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900">{activeTab} 추가</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-500"><X size={28} /></button>
              </div>
              <div className="mb-8">
                <label className="text-sm font-bold text-slate-800 mb-4 block">아이콘 선택</label>
                <div className="flex flex-wrap gap-2.5">
                  {iconOptions.map((opt, idx) => {
                    const IconComp = opt.icon;
                    const isSelected = selectedIconIdx === idx;
                    return (
                      <button key={idx} onClick={() => setSelectedIconIdx(idx)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${isSelected ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-lg ring-4 ring-indigo-100' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}><IconComp size={22} /></button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-800 mb-3 block">목표 이름</label>
                  <input type="text" value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} placeholder="예: 스쿼트 챌린지" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#6366F1] focus:outline-none font-bold transition-all placeholder:text-slate-300" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-3 block">목표 수치</label>
                    <input type="number" value={modalTarget} onChange={(e) => setModalTarget(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#6366F1] focus:outline-none font-black transition-all" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-3 block">단위</label>
                    <select value={modalUnit} onChange={(e) => setModalUnit(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#6366F1] focus:outline-none font-bold transition-all cursor-pointer">
                      <option>분</option><option>시간</option><option>kcal</option><option>보</option><option>회</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all border border-slate-100">취소</button>
                <button onClick={handleAddGoal} className="flex-1 py-5 rounded-3xl font-bold text-white bg-[#6366F1] shadow-xl shadow-indigo-100 hover:bg-[#5558e6] transition-all transform hover:-translate-y-1">추가하기</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
// [ 메인 컴포넌트 끝 ]