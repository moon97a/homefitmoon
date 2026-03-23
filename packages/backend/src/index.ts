import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  closePool, getMenus, getWorkoutDetail, getCurMenuPos, 
  getWorkoutHistory, getMember, getMemberGoals, addMemberGoal, deleteMemberGoal, updateGoalProgress,
  updateMemberStats, execute,
  setRepresentativeGoal,
  getAllMemberships
} from './db.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// [1] AI 설정 - 정인님이 말씀하신 3세대 모델로 세팅!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ==========================================
// 🚀 AI 운동 추천 API (Gemini 3 Flash Preview)
// ==========================================
app.post('/api/recommend-exercise', async (req, res) => {
  console.log("🚀 Gemini 3 Flash에게 추천 요청 중...");
  
  try {
    const { userProfile, availableExercises } = req.body;
    
    // 💡 최신 모델명으로 호출 (2026년 표준)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); 

    const prompt = `
      당신은 HomeFit의 수석 AI 코치입니다.
      사용자: ${userProfile?.name}, 목표: ${userProfile?.goal}
      보유 운동: ${availableExercises?.join(', ')}
      위 목록 중 가장 적합한 3가지를 골라 반드시 순수 JSON 배열로만 응답하세요.
      형식: [{"name": "운동명", "sets": "15회 3세트", "reason": "이유"}]
      형식에 맞추되 운동과 세트는 사용자 프로필과 보유 운동에 최적화된 추천을 해주세요.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    
    console.log("🤖 Gemini 3 추천 완료!");
    res.json(JSON.parse(text));
    
  } catch (error: any) {
    console.error("🔥 AI 에러 상세:", error.message);

    // 💡 할당량 초과(429)나 권한 에러 시 정인님의 개발이 멈추지 않게 방어 로직 가동
    if (error.message.includes("429") || error.message.includes("403") || error.message.includes("Quota")) {
      console.log("⚠️ 할당량 초과 혹은 모델 접근 제한으로 임시 데이터를 전송합니다.");
      return res.json([
        { "name": "플랭크", "sets": "60초 3세트", "reason": "코어 안정을 위한 가장 확실한 방법입니다." },
        { "name": "스쿼트", "sets": "20회 3세트", "reason": "하체 근력과 전신 대사를 높여줍니다." },
        { "name": "런지", "sets": "15회 3세트", "reason": "균형 감각과 하체 근력을 동시에 강화합니다." }
      ]);
    }
    
    res.status(500).json({ error: "AI 모델 연결 실패", message: error.message });
  }
});

// ==========================================
// 🎯 운동 목표(Member Goals) API
// ==========================================

// 1. 목표 리스트 조회 (회원 ID 기준)
app.get('/api/get_member_goals', async (req, res) => { 
  try { 
    const { memberId } = req.query as { memberId: string }; 
    const data = await getMemberGoals(memberId); 
    res.json({ success: true, data }); 
  } catch (err) { 
    res.status(500).json({ success: false, error: err }); 
  } 
});

// 2. 새로운 목표 추가
app.post('/api/add_member_goal', async (req, res) => { 
  try { 
    // 리액트에서 보낸 목표 데이터를 받아서 DB에 저장
    const result = await addMemberGoal(req.body); 
    res.json({ success: true, result }); 
  } catch (err) { 
    res.status(500).json({ success: false, error: err }); 
  } 
});

// 3. 목표 삭제
app.delete('/api/delete_member_goal', async (req, res) => { 
  try { 
    const { goalId } = req.query as { goalId: string }; 
    const result = await deleteMemberGoal(Number(goalId)); 
    res.json({ success: true, result }); 
  } catch (err) { 
    res.status(500).json({ success: false, error: err }); 
  } 
});

// 4. 목표 진행도 업데이트 (경험치 로직 포함 가능)
app.post('/api/update_goal_progress', async (req, res) => { 
  try { 
    const { goalId, memberId, currentVal } = req.body; 
    const result = await updateGoalProgress(goalId, memberId, currentVal); 
    res.json({ success: true, result }); 
  } catch (err) { 
    res.status(500).json({ success: false, error: err }); 
  } 
});

// ==========================================
// 🛠️ 기본 데이터 API들 (기존 기능 유지)
// ==========================================
app.get('/api/get_menus', async (req, res) => { try { const data = await getMenus(); res.json({ success: true, data }); } catch (err) { res.status(500).json({ success: false, error: err }); } });
app.get('/api/get_workout_history', async (req, res) => { try { const { memberId } = req.query as { memberId?: string }; const data = await getWorkoutHistory(memberId); res.json({ success: true, data }); } catch (err) { res.status(500).json({ success: false, error: err }); } });
app.get('/api/get_workout_detail', async (req, res) => { try { const { workoutRecordId } = req.query as { workoutRecordId: string }; const data = await getWorkoutDetail(workoutRecordId); res.json({ success: true, data }); } catch (err) { res.status(500).json({ success: false, error: err }); } });
app.get('/api/get_member', async (req, res) => { try { const { memberId } = req.query as { memberId: string }; const data = await getMember(memberId); res.json({ success: true, data }); } catch (err) { res.status(500).json({ success: false, error: err }); } });

const server = app.listen(PORT, () => console.log(`✅ 백엔드 가동 중: http://localhost:${PORT}`));
process.on('SIGINT', async () => { await closePool(); server.close(() => process.exit(0)); });

// index.ts 에 추가
app.get('/api/get_menu_pos', async (req, res) => { 
  try { 
    const { page } = req.query as { page: string }; 
    const data = await getCurMenuPos(page); 
    res.json({ success: true, data }); 
  } catch (err) { 
    res.status(500).json({ success: false, error: err }); 
  } 
});

// server/index.ts 에 추가
app.post('/api/update_member_stats', async (req, res) => {
  try {
    const { memberId, lvl, expPoint } = req.body;
    const result = await updateMemberStats(memberId, lvl, expPoint);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// index.ts 에 추가
app.post('/api/simulate_next_day', async (req, res) => {
  try {
    const { memberId, streakIncr } = req.body;
    
    // 1. 모든 목표의 진행도를 0으로 리셋 (DB 업데이트)
    await execute(`UPDATE MEMBER_GOAL SET CURRENT_VAL = 0, IS_ACHIEVED_TODAY = 'N' WHERE MEMBER_ID = :1`, [memberId]);
    
    // 2. 스트릭 업데이트 (성공 시 +1, 실패 시 0 등 리액트에서 결정한 값으로)
    await execute(`UPDATE MEMBER SET STREAK = :1 WHERE ID = :2`, [streakIncr, memberId]);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// [index.ts 추가 로직] 대표 목표 설정 API
app.post('/api/set_representative_goal', async (req, res) => {
  try {
    const { memberId, goalId } = req.body;
    const result = await setRepresentativeGoal(memberId, goalId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

app.get('/api/get_all_memberships', async (req, res) => {
  try {
    const data = await getAllMemberships();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});
