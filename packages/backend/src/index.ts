import express from 'express';
import cors from 'cors';
import { 
  closePool, 
  getMenus, searchSubMenus, 
  getColDescs, 
  getWorkoutRecords, getWorkoutPivot, getWorkoutPivotWithPlan, getCurMenuPos, getWorkoutHistory, 
  getMember, 
  getWorkoutDetail} from './db.js';
import dotenv from 'dotenv';
import Logger from './logger.js'

//=================================================================================================
// 환경 변수 로드 & 서버 초기화
//=================================================================================================
dotenv.config();
const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// 서버 시작
let server: any;
server = app.listen(PORT, () => {
  try {
    console.log(`Backend 가동을 시작합니다.: http://localhost:${PORT}`);
    Logger.log('i', `Backend 시작: http://localhost:${PORT}`);
  } catch (error) {
    console.log(`Backend 가동이 실패했습니다.: ${(error as Error).message}`);
    Logger.logError('Backend 가동 실패', error);
    process.exit(1);
  }
});

// 서버 종료 시
let isShuttingDown = false;
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown); 

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  console.log(`Backend 가동을 종료합니다.`);
  Logger.log('i', `Backend 가동 종료 : ${signal}`);
  try {
    // 1. DB 풀 정리 (이전 대화 참고)
    await closePool()

    // 2. 서버 종료 (대기)
    if (server) {
      await new Promise<void>((resolve) => {
        server!.close((err: any) => {
          if (err) {
            console.log('서버를 중지하는 중 에러가 생겼습니다.', (err as Error).message || err);
          } else {
            console.log('서버를 종료하였습니다.');
          }
          resolve();
        });
      });
    }
    
  } catch (error) {
    console.log('Backend 종료중 에러가 생겼습니다.', (error as Error).message || error);
  } finally {
    console.log('Backend가 완전히 종료되었습니다.');
    process.exit(0);
  }
}

//================================================================================================
// 메뉴  
//================================================================================================
// API: 메뉴 전체 조회
// GET /api/get_menus
// PARAMETER : 없음
app.get('/api/get_menus', async (req, res) => {
  let apiLogEntry = null;
  try {
    apiLogEntry = await Logger.logApiStart('GET /api/get_menus', []);
    const menus = await getMenus();
    let menu =  
    res.json({
      success: true,
      data: menus,
      count: menus.length,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
// API: 메뉴 위치조회 
// GET /api/get_menu_pos?page=메뉴페이지명
// PARAMETER : page (선택) - 조회할 메뉴 페이지명 
app.get('/api/get_menu_pos', async (req, res) => {
  let apiLogEntry = null;  
  try {
    const { page } = req.query as { page?: string };  
    apiLogEntry = await Logger.logApiStart('GET /api/get_menu_pos', [page]);
    const menuPos = await getCurMenuPos(page);
    res.json({
      success: true,
      data: menuPos,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
// API: 메뉴 검색
// GET /api/search_menus?key=검색어
// PARAMETER : key (필수) - 검색할 메뉴 제목 또는 설명
app.get('/api/search_menus', async (req, res) => {
  let apiLogEntry = null;  
  try {
    const { key } = req.query as { key: string };  
    if (!key) {
      return res.status(400).json({
        success: false,
        error: '검색어가 필요합니다.'
      });
    }
    apiLogEntry = await Logger.logApiStart('GET /api/search_menus', [key]);
    const menus = await searchSubMenus(key);
    res.json({
      success: true,
      data: menus,
      count: menus.length,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
// API: 테이블 컬럼 설명 조회
// GET /api/get_col_descs?table=테이블명
// PARAMETER : table (필수) - 컬럼 설명을 조회할 테이블 이름
//================================================================================================
// 테이블 컬럼 설명
//================================================================================================
app.get('/api/get_col_descs', async (req, res) => {
    let apiLogEntry = null;
  try {
    const { table } = req.query as { table: string };  // 👈 req.query 사용!

    if (!table) {
      return res.status(400).json({
        success: false,
        error: 'table 이름이 필요합니다.'
      });
    }
    apiLogEntry = await Logger.logApiStart('GET /api/get_col_descs', [table]);
    const colDescs = await getColDescs(table);
    res.json({
      success: true,
      data: colDescs,
      count: colDescs.length,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
// API: 전체 운동내역 조회
// GET /api/get_workout_records?memberId=회원ID
// PARAMETER : memberId (필수) - 조회할 회원 ID
//================================================================================================
// 운동
//================================================================================================
app.get('/api/get_workout_records', async (req, res) => {
  let apiLogEntry = null;
  try {
    const { memberId } = req.query as { memberId: string };
    const { from } = req.query as { from: string };
    const { to } = req.query as { to: string };
    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: '회원 ID가 필요합니다.'
      });
    }
    if (!from) {
      return res.status(400).json({
        success: false,
        error: '시작일이 필요합니다.'
      });
    }
    if (!to) {
      return res.status(400).json({
        success: false,
        error: '종료일이 필요합니다.'
      });
    }     
    apiLogEntry = await Logger.logApiStart('GET /api/get_workout_records', [memberId, from, to]);
    const records = await getWorkoutRecords(memberId, from, to);
    res.json({
      success: true,
      data: records,
      count: records.length,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
// API: 전체 운동내역 일별 집계 조회
// GET /api/get_workout_pivot?memberId=회원ID&from=시작일&to=종료일
// PARAMETER : memberId (필수) - 조회할 회원 ID
//             from (필수) - 조회 시작일 (YYYY-MM-DD)
//             to (필수) - 조회 종료일 (YYYY-MM-DD)
app.get('/api/get_workout_pivot', async (req, res) => {
  let apiLogEntry = null;
  try {
    const { memberId } = req.query as { memberId: string };
    const { from } = req.query as { from: string };
    const { to } = req.query as { to: string };
    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: '회원 ID가 필요합니다.'
      });
    }
    if (!from) {
      return res.status(400).json({
        success: false,
        error: '시작일이 필요합니다.'
      });
    }
    if (!to) {
      return res.status(400).json({
        success: false,
        error: '종료일이 필요합니다.'
      });
    }        
    apiLogEntry = await Logger.logApiStart('GET /api/get_workout_pivot', [memberId, from, to]);
    const records = await getWorkoutPivot(memberId, from, to);
    res.json({
      success: true,
      data: records.data,
      columns: records.columns,      
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
// API: 전체 운동내역 일별 집계 조회 (플랜 포함)
// GET /api/get_workout_pivot_with_plan?memberId=회원ID&from=시작일&to=종료일
// PARAMETER : memberId (필수) - 조회할 회원 ID
//             from (필수) - 조회 시작일 (YYYY-MM-DD)
//             to (필수) - 조회 종료일 (YYYY-MM-DD)
app.get('/api/get_workout_pivot_with_plan', async (req, res) => {
  let apiLogEntry = null;
  try {
    const { memberId } = req.query as { memberId: string };
    const { from } = req.query as { from: string };
    const { to } = req.query as { to: string };
    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: '회원 ID가 필요합니다.'
      });
    }
    if (!from) {
      return res.status(400).json({
        success: false,
        error: '시작일이 필요합니다.'
      });
    }
    if (!to) {
      return res.status(400).json({
        success: false,
        error: '종료일이 필요합니다.'
      });
    }        
    apiLogEntry = await Logger.logApiStart('GET /api/get_workout_pivot_with_plan', [memberId, from, to]);
    const records = await getWorkoutPivotWithPlan(memberId, from, to);
    res.json({
      success: true,
      data: records.data,
      columns: records.columns,      
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
// API: 메뉴 위치조회 
// GET /api/get_menu_pos?page=메뉴페이지명
// PARAMETER : page (선택) - 조회할 메뉴 페이지명 
app.get('/api/get_workout_history', async (req, res) => {
  let apiLogEntry = null;  
  try {
    const { memberId } = req.query as { memberId?: string };  
    apiLogEntry = await Logger.logApiStart('GET /api/get_workout_history', [memberId]);
    const workoutHistory = await getWorkoutHistory(memberId);
    res.json({
      success: true,
      data: workoutHistory,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
app.get('/api/get_workout_detail', async (req, res) => {
  let apiLogEntry = null;
  try {
    const { workoutRecordId } = req.query as { workoutRecordId: string };
    if (!workoutRecordId) {
      return res.status(400).json({
        success: false,
        error: '운동 기록 ID가 필요합니다.'
      });
    }
    apiLogEntry = await Logger.logApiStart('GET /api/get_workout_detail', [workoutRecordId]);
    const records = await getWorkoutDetail(workoutRecordId);
    res.json({
      success: true,
      data: records,
      count: records.length,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});
//================================================================================================
// 회원정보
//================================================================================================
// API: 회원 정보 조회
// GET /api/get_member?memberId=회원ID
// PARAMETER : memberId (필수) - 조회할 회원 ID
app.get('/api/get_member', async (req, res) => {
  let apiLogEntry = null;
  try {
    const { memberId } = req.query as { memberId: string };
    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: '회원 ID가 필요합니다.'
      });
    }
    apiLogEntry = await Logger.logApiStart('GET /api/get_member', [memberId]);
    const member = await getMember(memberId);
    res.json({
      success: true,
      data: member,
      timestamp: new Date().toISOString()
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

//================================================================================================
// 우편번호 
//================================================================================================
// API: 우편번호 검색 (한국우편사업진흥원)
// GET /api/get_postcodes?zipcode=우편번호
// PARAMETER : zipcode (필수) - 검색할 우편번호 (5자리)
app.get('/api/get_postcodes', async (req, res) => {
  let apiLogEntry = null;
  try {
    const { zipcode } = req.query;
    
    if (!zipcode || zipcode.length !== 5) {
      return res.status(400).json({ error: '5자리 우편번호 입력' });
    }
    apiLogEntry = await Logger.logApiStart('GET /api/get_postcodes', [zipcode]);
    const serviceKey = process.env.VITE_EPOST_SERVICE_KEY!;
    const url = `http://biz.epost.go.kr/KpostPortal/openapi?regkey=${serviceKey}&target=postNew&query=${zipcode}`;
    
    const response = await fetch(url);
    const xml = await response.text();
    
    const addresses = parseEpostXML(xml);
    res.json({
      success: true,
      data: addresses
    });
    await Logger.logApiSuccess(apiLogEntry);
  } catch (error) {
    await Logger.logApiError(apiLogEntry, error);
    res.status(500).json({ error: (error as Error).message });
  }
});
function parseEpostXML(xml: string) {
  const results: any[] = [];
  
  // 1단계: CDATA 태그 제거 (핵심!)
  const cleanXml = xml
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')  // CDATA 내용만 추출
    .replace(/<postcd>(.*?)<\/postcd>/gs, (match, p1) => `<postcd>${p1.trim()}</postcd>`)
    .replace(/<address>(.*?)<\/address>/gs, (match, p1) => `<address>${p1.trim()}</address>`)
    .replace(/<roadAddress>(.*?)<\/roadAddress>/gs, (match, p1) => `<roadAddress>${p1.trim()}</roadAddress>`);
  
  // 2단계: <item> 추출
  const itemRegex = /<item>(.*?)<\/item>/gs;
  let match;
  
  while ((match = itemRegex.exec(cleanXml)) !== null) {
    const item = match[1];
    
    const postcodeMatch = item.match(/<postcd>([^<]+)<\/postcd>/i);
    const addressMatch = item.match(/<address>([^<]+)<\/address>/i);
    const roadMatch = item.match(/<roadAddress>([^<]+)<\/roadAddress>/i);
    
    if (postcodeMatch?.[1]) {
      results.push({
        postcode: postcodeMatch[1].trim(),
        address: addressMatch?.[1]?.trim() || '',
        roadAddress: roadMatch?.[1]?.trim() || ''
      });
    }
  }
  
  return results;
}


