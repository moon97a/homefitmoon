// oracle-pool.ts (에러 수정 완료)
import oracledb from 'oracledb';
import { NavItem, NavSubItem, ColDesc, WorkoutRecord, ChartData, WorkoutRecordWithPlan, MenuPos, WorkoutHistory, Member, WorkoutDetail } from 'shared';
import dotenv from 'dotenv';
import Logger from './logger.js'

// 환경 변수 로드
dotenv.config();

const DB_CONFIG = {
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`,
  poolMin: 1,
  poolMax: 10,
  poolIncrement: 1
};

let pool: any = null;

export async function initPool(): Promise<void> {
  if (pool) return;
  try {
    oracledb.fetchAsString = [oracledb.CLOB];    
    pool = await oracledb.createPool(DB_CONFIG);
    console.log('DB풀을 생성하였습니다.');
    await Logger.log('i', 'DB풀 생성 성공');
  } catch (error) {
    console.log('DB풀을 생성하지 못했습니다.', (error as Error).message || error);
    await Logger.logError('DB풀 생성 실패', (error as Error).message || error);
    throw error;
  }
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  try {
    await pool.close(5000); // 5초 내 정리
    console.log('DB풀을 종료하였습니다.');
    await Logger.log('i', 'DB풀 종료 성공');
  } catch (error) {
    console.log('DB풀을 종료하지 못했습니다.', (error as Error).message || error);
    await Logger.logError('DB풀 종료 실패', (error as Error).message || error);
    throw error;
  }
}

/**
 * 쿼리 실행 (SELECT) - 수정됨!
 */
async function select(sql: string, binds: any[] = []): Promise<any[]> {
  let logEntry = null;
  let connection = null;
  try {
    // 1. 쿼리 시작 로그
    await initPool();
    connection = await pool!.getConnection();    
    logEntry = await Logger.logQueryStart(sql, binds);
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    // 2. 성공 로그
    await Logger.logQuerySuccess(logEntry, result.rows.length)    
    return result.rows as any[];
  } catch (error) {
    // 3. 에러 로그
    await Logger.logQueryError(logEntry, error)
    throw error
  } finally {
    if (connection) 
      await connection.close();
  }
}
/**
 * 쿼리 실행 (PL/SQL) - 수정됨!
 */
async function execPlsql(sql: string, binds: Record<string, any>, options: any = {}): Promise<any> {
  let logEntry = null;
  let connection = null;
  try {
    // 1. 쿼리 시작 로그
    await initPool();
    connection = await pool!.getConnection();    
    logEntry = await Logger.logQueryStart(sql, binds);

    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      ...options
    });
    // 2. 성공 로그
    await Logger.logQuerySuccess(logEntry, result.rowsAffected || 0);
    // JSON CLOB 자동 처리
    if (result.outBinds?.json) {
      const clob = result.outBinds.json as oracledb.Lob;      
      const jsonData = await clob.getData();
      const jsonString = typeof jsonData === 'string' ? jsonData : jsonData.toString();
      return JSON.parse(jsonString);
    }
    return result.outBinds || result.rows || [];
  } catch (error) {
    // 3. 에러 로그
    console.log('Executing PL/SQL with binds: 실패', '에러:', (error as Error).message || error);
    await Logger.logQueryError(logEntry, error)
    throw error
  } finally {
    if (connection) 
      await connection.close();
  }
}

/**
 * INSERT/UPDATE/DELETE (DML)
 */
async function execute(sql: string, binds: any[] = []): Promise<any> {
  let logEntry = null;
  let connection = null;  
  try {
    await initPool();
    connection = await pool!.getConnection();
    logEntry = await Logger.logQueryStart(sql, binds);
    const result = await connection.execute(sql, binds, {
      autoCommit: true,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    await Logger.logQuerySuccess(logEntry, result.rowsAffected || 0);
    return result;
  } catch (error) {
    // 3. 에러 로그
    await Logger.logQueryError(logEntry, error)
    throw error
  } finally {    
    if (connection) 
      await connection.close();
  }
}

// =================================================================================================================
// DB에서 데이터를 조회하여 반환하는 함수들 (원시 데이터 조회)
// =================================================================================================================
// 1. 메뉴 조회 - 메뉴와 서브메뉴를 각각 조회한 후, 자바스크립트에서 조합하여 반환
async function getRawMenus(): Promise<any[]> {
  return select(`
SELECT  id, 
        title, img, description 
FROM    nav_item
`);
}
async function getRawSubMenus(title: string = ''): Promise<any[]> {
  return select(`
SELECT  nav_item_id || '-' || id AS id, 
        title, href, description 
FROM    nav_sub_item
WHERE   title LIKE '%' || :1 || '%'
ORDER BY nav_item_id, id
`, [title]);
}
async function getRawCurMenuPos(page: string = ''): Promise<any[]> {
  return select(`
SELECT  JSON_OBJECT(
            'id' VALUE a.id,
            'parent_title' VALUE b.title, 
            'title' VALUE a.title,
            'siblings' VALUE (
            COALESCE(
                    (
                    SELECT  JSON_ARRAYAGG(
                                JSON_OBJECT(
                                'id' VALUE id,
                                'title' VALUE title,
                                'href' VALUE href
                                )
                            ) 
                    FROM    nav_sub_item  
                    WHERE   nav_item_id = a.nav_item_id -- 현재 메뉴 자식 조회
                    ), 
                    JSON_ARRAY()  -- 빈 배열 반환
                )
            )   
         ) AS result 
FROM    nav_sub_item a 
JOIN    nav_item b ON b.id = a.nav_item_id 
WHERE   a.page = :1
`, [page]);
}
async function searchRawSubMenus(key: string = ''): Promise<any[]> {
  if (!key?.trim() || key.trim().length < 2) {
    return [];  
  }
  const cleanKey = key.trim();
  return select(`
SELECT  nav_item_id || '-' || id AS id, 
        title, href, description 
FROM    nav_sub_item
WHERE   title LIKE '%' || UPPER(:1) || '%' OR description LIKE '%' || UPPER(:2) || '%'
ORDER BY nav_item_id, id
`, [cleanKey, cleanKey]);
}
// 2. 칼럼정의 조회 - 테이블명으로 칼럼정의 조회 (칼럼명은 소문자로 반환)
async function getRawColDescs(tableName: string): Promise<any[]> {
  return select(`
SELECT  Lower(id) AS id,  -- 중요함: 칼럼명을 소문자로 변환하여 반환
        title,
        type,
        width,
        summary
FROM    column_desc
WHERE   table_name = :1
ORDER BY seq
`, [tableName]);
}
// 3 운동내역 조회 
async function getRawWorkoutRecords(memberId: string, from: string, to: string): Promise<any[]> {
  return select(`
SELECT  A.id || '-' || B.workout_id AS id,
        B.workout_id,
        A.wo_dt,
        C.title,
        MOD(TO_NUMBER(SUBSTR(B.workout_id, 2)) -1, 5) title_color, 
        B.target_reps,
        B.target_sets,
        B.count,
        B.target_reps * B.target_sets AS count_p,  
        CASE 
          WHEN (B.target_reps * B.target_sets - B.count) < 0 
          THEN 0 
          ELSE (B.target_reps * B.target_sets - B.count) 
        END AS count_s,        
        B.point,
        A.description
FROM    workout_record A
JOIN    workout_detail B ON B.workout_record_id = A.id 
JOIN    workout C ON C.id = B.workout_id
WHERE   A.member_id = :1
AND     A.wo_dt >= :2
AND     A.wo_dt <= :3
`, [memberId, from, to]);
}
async function getRawWorkoutPivot(memberId: string, from: string, to: string): Promise<any> {
  const binds = {
    member_id: memberId,
    from_dt: from,
    to_dt: to,
    json: { dir: oracledb.BIND_OUT, type: oracledb.CLOB }
  };
  return execPlsql(`
BEGIN
  usp_get_workout_pivot_json(
    :member_id,
    :from_dt,
    :to_dt,
    :json
  );
END;
`, binds);
}
async function getRawWorkoutPivotWithPlan(memberId: string, from: string, to: string): Promise<any> {
  const binds = {
    member_id: memberId,
    from_dt: from,
    to_dt: to,
    json: { dir: oracledb.BIND_OUT, type: oracledb.CLOB }
  };
  return execPlsql(`
BEGIN
  usp_get_workout_pivot_with_plan_json(
    :member_id,
    :from_dt,
    :to_dt,
    :json
  );
END;
`, binds);
}
async function getRawWorkoutHistory(memberId: string = ''): Promise<any[]> {
  return select(`
WITH date_range AS (
    SELECT TRUNC(SYSDATE) - 7 + LEVEL AS date_val  -- 7일전부터 오늘
    FROM DUAL 
    CONNECT BY LEVEL < 8  -- (7일전~오늘)
)
SELECT  JSON_ARRAYAGG(
            JSON_OBJECT(
                'wo_dt' VALUE TO_CHAR(date_val, 'MM-DD'),
                'status' VALUE CASE WHEN b.wo_dt IS NOT NULL THEN 'G' ELSE 'B' END
            )  ORDER BY A.date_val  -- date_val 정렬 추가
        ) AS result    
FROM    date_range A
LEFT JOIN workout_record B ON B.wo_dt = A.date_val AND B.member_id = :1
`, [memberId]);
}
async function getRawWorkoutDetail(workoutRecordId: string = ''): Promise<any[]> {
  return select(`
SELECT  B.title,
        B.guide,
        B.img,
        A.target_reps,
        A.target_sets
FROM    workout_detail A
JOIN    workout B ON B.id = A.workout_id
WHERE   A.workout_record_id = :1
`, [workoutRecordId]);
}
// 4. 회원 정보 조회 (예시)
async function getRawMember(memberId: string): Promise<any> {
  return select(`
SELECT
    A.id,
    A.name,
    A.img,
    A.sex,
    A.age,
    A.point,
    A.exp_point,
    A.lvl,
    A.membership,
    B.name membership_name
FROM member A
JOIN minor_desc B on B.code_id = 'C0004' AND B.id = A.membership
WHERE A.id = :1
`, [memberId]);
}
// =================================================================================================================
// DB에서 읽어들인 데이터를 객체 데이터로 변환하여 반환하는 함수들
// =================================================================================================================
// 2. 메뉴 조회 
export const getMenus = async (title: string = ''): Promise<NavItem[]> => {
  const menus = await getRawMenus();
  const subMenus = await getRawSubMenus(title);
  
  // 메뉴 맵 생성
  const menuMap = new Map<string, NavItem>();
  
  // 1단계: 메뉴 객체 생성
  menus.forEach((menu: any) => {
    const navItem: NavItem = {
      id: menu.ID,
      title: menu.TITLE || '',
      img: menu.IMG || '',
      description: menu.DESCRIPTION || '',
      sub_menus: []
    };
    menuMap.set(navItem.id, navItem);
  });
  
  // 2단계: 서브메뉴 연결 (1-1 → id="1"에 추가)
  subMenus.forEach((sub: any) => {
    const parentId = sub.ID.split('-')[0]; // "1-1" → "1"
    const parentMenu = menuMap.get(parentId);
    
    if (parentMenu) {
      parentMenu.sub_menus.push({
        id: sub.ID,
        title: sub.TITLE || '',
        href: sub.HREF || '',
        description: sub.DESCRIPTION || ''
      });
    }
  });
  
  return Array.from(menuMap.values());
}
// 3. 메뉴 검색
export const searchSubMenus = async (key: string = ''): Promise<NavSubItem[]> => {
  const subMenus = await searchRawSubMenus(key);
  return subMenus.map((sub: any) => ({
    id: sub.ID,
    title: sub.TITLE,
    href: sub.HREF,
    description: sub.DESCRIPTION
  }));
}
// 4. 메뉴 검색
export const getCurMenuPos = async (page: string = ''): Promise<MenuPos> => {
  const result = await getRawCurMenuPos(page);
  const parsedResult = JSON.parse(result[0].RESULT);  // 문자열 → 객체
  return parsedResult as MenuPos;
}
// 4. Column Description 조회
export const getColDescs = async (tableName: string): Promise<ColDesc[]> => {
  const colDescs = await getRawColDescs(tableName);
  return colDescs.map((col: any) => ({      
    id: col.ID,
    title: col.TITLE,     
    type: col.TYPE,
    width: col.WIDTH,
    summary: col.SUMMARY,
    aggregate: 0
  }));
} 
// 5. 운동내역 조회
export const getWorkoutRecords = async (memberId: string, from: string, to: string): Promise<WorkoutRecord[]> => {
  const records = await getRawWorkoutRecords(memberId, from, to);
  return records.map((rec: any) => ({
    id: rec.ID,
    workout_id: rec.WORKOUT_ID,
    wo_dt: rec.WO_DT,
    title: rec.TITLE,
    title_color: rec.TITLE_COLOR,
    target_reps: rec.TARGET_REPS,
    target_sets: rec.TARGET_SETS,
    count: rec.COUNT,
    count_p: rec.COUNT_P,
    count_s: rec.COUNT_S,
    point: rec.POINT,
    description: rec.DESCRIPTION
  }));
}
// 6. 운동내역 피벗 조회
export const getWorkoutPivot = async (memberId: string, from: string, to: string): Promise<ChartData> => {
  const result = await getRawWorkoutPivot(memberId, from, to);
  // 3. ChartData 타입 반환
  return {
    columns: result.columns,
    data: result.data
  } as ChartData;
}
// 7. 운동내역 피벗 조회 (플랜 포함)
export const getWorkoutPivotWithPlan = async (memberId: string, from: string, to: string): Promise<ChartData> => {
  const result = await getRawWorkoutPivotWithPlan(memberId, from, to);
  // 3. ChartData 타입 반환
  return {
    columns: result.columns,
    data: result.data
  } as ChartData;
}
// 8. 운동내역 히스토리 조회
export const getWorkoutHistory = async (memberId: string = ''): Promise<WorkoutHistory[]> => {
  const result = await getRawWorkoutHistory(memberId);
  const parsedResult = JSON.parse(result[0].RESULT);  // 문자열 → 객체
  return parsedResult as WorkoutHistory[];
}
// 9. 운동내역 상세 조회
export const getWorkoutDetail = async (workoutRecordId: string = ''): Promise<WorkoutDetail[]> => {
  const records = await getRawWorkoutDetail(workoutRecordId);
  return records.map((rec: any) => ({
    title: rec.TITLE,
    guide: rec.GUIDE,
    img: rec.IMG,
    target_reps: rec.TARGET_REPS,
    target_sets: rec.TARGET_SETS
  }));
}
// 10. 회원정보 조회
export const getMember = async (memberId: string): Promise<Member> => {
  const record = await getRawMember(memberId);
  return {
    id: record[0].ID,
    name: record[0].NAME,
    img: record[0].IMG,
    sex: record[0].SEX,
    age: record[0].AGE,
    point: record[0].POINT,
    exp_point: record[0].EXP_POINT,
    lvl: record[0].LVL,
    membership: record[0].MEMBERSHIP,
    membership_name: record[0].MEMBERSHIP_NAME
  };
}