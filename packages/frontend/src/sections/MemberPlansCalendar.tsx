// [ 임포트 시작 ]
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  CheckCircle2, Loader2, Plus, Trash2, X 
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
// [ 임포트 끝 ]

// [ 타입 정의 시작 ]
interface MemberGoal {
  id: number;
  title: string;
  current_val: number;
  target_val: number;
  unit: string;
  is_achieved_today: string;
  goal_type: string;
  gol_date: string; // 추가된 날짜 필드
}
// [ 타입 정의 끝 ]

const MEMBER_ID = 'U000002';

const MemberPlansCalendar = () => {
  // [ 상태 관리 시작 ]
  const [goals, setGoals] = useState<MemberGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 달력 제어 상태
  const [viewDate, setViewDate] = useState(new Date()); // 현재 보고 있는 달 (월 이동용)
  const [selectedDate, setSelectedDate] = useState(new Date()); // 클릭해서 선택한 날짜
  
  // 모달 입력 상태
  const [title, setTitle] = useState('스쿼트');
  const [target, setTarget] = useState('30');
  const [unit, setUnit] = useState('회');
  const [type, setType] = useState('일일');
  // [ 상태 관리 끝 ]

  // [ 헬퍼 함수 시작 ]
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 달력 생성을 위한 계산
  const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const lastDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  // [ 헬퍼 함수 끝 ]

  // [ 데이터 로드 시작 ]
  const loadGoalsByDate = useCallback(async () => {
    try {
      setLoading(true);
      // 특정 날짜(selectedDate)의 목표만 가져오도록 API 호출 (백엔드 수정 필요)
      const res = await axios.get(`http://localhost:3001/api/get_member_goals`, {
        params: { memberId: MEMBER_ID, date: formatDate(selectedDate) }
      });
      if (res.data.success) setGoals(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { loadGoalsByDate(); }, [loadGoalsByDate]);
  // [ 데이터 로드 끝 ]

  // [ 이벤트 핸들러 시작 ]
  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleSave = async () => {
    try {
      const newGoal = {
        member_id: MEMBER_ID,
        title,
        target_val: Number(target),
        unit,
        goal_type: type,
        gol_date: formatDate(selectedDate), // 선택된 날짜로 저장
        icon_name: title === '플랭크' ? 'Timer' : 'Dumbbell',
        icon_color: 'bg-indigo-500'
      };
      await axios.post('http://localhost:3001/api/add_member_goal', newGoal);
      setIsModalOpen(false);
      loadGoalsByDate();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await axios.delete(`http://localhost:3001/api/delete_member_goal?goalId=${id}`);
    loadGoalsByDate();
  };
  // [ 이벤트 핸들러 끝 ]

  return (
    <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-20">
      
      {/* [ 좌측: 월 이동 가능한 달력 ] */}
      <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><CalendarIcon size={20} /></div>
            <h2 className="text-2xl font-black text-slate-800">
              {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 border"><ChevronLeft size={20} /></button>
            <button onClick={() => setViewDate(new Date())} className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl">오늘</button>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 border"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {dayNames.map(day => <div key={day} className="text-center text-xs font-bold text-slate-300 uppercase tracking-tighter pb-4">{day}</div>)}
          
          {/* 공백 칸 생성 */}
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          
          {/* 실제 날짜 생성 */}
          {Array.from({ length: lastDate }).map((_, i) => {
            const dateNum = i + 1;
            const isSelected = formatDate(selectedDate) === formatDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), dateNum));
            const isToday = formatDate(new Date()) === formatDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), dateNum));

            return (
              <div 
                key={dateNum} 
                onClick={() => setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), dateNum))}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-bold cursor-pointer transition-all relative
                  ${isSelected ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'hover:bg-slate-50 text-slate-600'}
                  ${isToday && !isSelected ? 'text-indigo-600 ring-2 ring-indigo-100' : ''}`}
              >
                {dateNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* [ 우측: 선택된 날짜의 일정 리스트 ] */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-black text-slate-800">{formatDate(selectedDate)}</h2>
          <p className="text-slate-400 text-sm font-medium">선택한 날짜의 운동 일정</p>
        </div>

        <div className="flex-1 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-200" /></div>
          ) : goals.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
              <p className="text-slate-300 font-bold text-sm">일정이 없습니다.</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="p-5 rounded-2xl border border-slate-50 bg-slate-50/50 group flex items-center justify-between hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-500 font-bold text-xs">
                    {goal.goal_type === '일일' ? 'D' : 'W'}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">{goal.title}</div>
                    <div className="text-[11px] text-slate-400 font-bold">{goal.target_val}{goal.unit}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {goal.is_achieved_today === 'Y' && <CheckCircle2 className="text-green-500" size={18} />}
                  <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> 일정 추가
        </button>
      </div>

      {/* [ 모달 시작 ] */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900">일정 추가</h2>
                <X className="cursor-pointer text-slate-300 hover:text-slate-500" onClick={() => setIsModalOpen(false)} />
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-800 mb-2 block">운동 선택</label>
                  <select value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">
                    <option>스쿼트</option><option>런지</option><option>플랭크</option><option>푸쉬업</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-2 block">목표치</label>
                    <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-800 mb-2 block">단위</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                      <option>회</option><option>분</option><option>세트</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleSave} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl transition-all">저장하기</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberPlansCalendar;