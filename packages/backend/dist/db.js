// oracle-pool.ts (에러 수정 완료)
import oracledb from 'oracledb';
import dotenv from 'dotenv';
import Logger from './logger.js';
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
let pool = null;
export async function initPool() {
    if (pool)
        return;
    try {
        pool = await oracledb.createPool(DB_CONFIG);
        console.log('DB풀을 생성하였습니다.');
        await Logger.log('i', 'DB풀 생성 성공');
    }
    catch (error) {
        console.log('DB풀을 생성하지 못했습니다.', error.message || error);
        await Logger.logError('DB풀 생성 실패', error.message || error);
        throw error;
    }
}
export async function closePool() {
    if (!pool)
        return;
    try {
        await pool.close(5000); // 5초 내 정리
        console.log('DB풀을 종료하였습니다.');
        await Logger.log('i', 'DB풀 종료 성공');
    }
    catch (error) {
        console.log('DB풀을 종료하지 못했습니다.', error.message || error);
        await Logger.logError('DB풀 종료 실패', error.message || error);
        throw error;
    }
}
/**
 * 쿼리 실행 (SELECT) - 수정됨!
 */
async function select(sql, binds = []) {
    let logEntry = null;
    let connection = null;
    try {
        // 1. 쿼리 시작 로그
        await initPool();
        connection = await pool.getConnection();
        logEntry = await Logger.logQueryStart(sql, binds);
        const result = await connection.execute(sql, binds, {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
        // 2. 성공 로그
        await Logger.logQuerySuccess(logEntry, result.rows.length);
        return result.rows;
    }
    catch (error) {
        // 3. 에러 로그
        await Logger.logQueryError(logEntry, error);
        throw error;
    }
    finally {
        if (connection)
            await connection.close();
    }
}
/**
 * INSERT/UPDATE/DELETE (DML)
 */
async function execute(sql, binds = []) {
    let logEntry = null;
    let connection = null;
    try {
        await initPool();
        connection = await pool.getConnection();
        logEntry = await Logger.logQueryStart(sql, binds);
        const result = await connection.execute(sql, binds, {
            autoCommit: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        await Logger.logQuerySuccess(logEntry, result.rowsAffected || 0);
        return result;
    }
    catch (error) {
        // 3. 에러 로그
        await Logger.logQueryError(logEntry, error);
        throw error;
    }
    finally {
        if (connection)
            await connection.close();
    }
}
// =================================================================================================================
// DB에서 데이터를 조회하여 반환하는 함수들 (원시 데이터 조회)
// =================================================================================================================
// 1. 메뉴 조회 - 메뉴와 서브메뉴를 각각 조회한 후, 자바스크립트에서 조합하여 반환
async function getRawMenus() {
    return select(`
SELECT  id, 
        title, img, description 
FROM    nav_item
`);
}
async function getRawSubMenus(title = '') {
    return select(`
SELECT  TO_CHAR(nav_item_id) || '-' || TO_CHAR(id) AS id, 
        title, href, description 
FROM    nav_sub_item
WHERE   title LIKE '%' || :title || '%'
ORDER BY nav_item_id, id
`, [title]);
}
// 2. 칼럼정의 조회 - 테이블명으로 칼럼정의 조회 (칼럼명은 소문자로 반환)
async function getRawColDescs(tableName) {
    return select(`
SELECT  Lower(id) AS id,  -- 중요함: 칼럼명을 소문자로 변환하여 반환
        title,
        type,
        width,
        summary
FROM    column_desc
WHERE   table_name = :tableName
ORDER BY seq
`, [tableName]);
}
// 3 인보이스 조회 - 인보이스와 관련된 여러 테이블을 JOIN하여 조회
async function getRawInvoices() {
    return select(`
SELECT  A.id,
        A.inv_dt,
        A.seller_id,
        B.name seller_name,
        D.name area_name,
        ZA.name payment_status,
        ZB.name payment_method,
        ZA.ord payment_status_color,
        ZB.ord payment_method_color,        
        A.qty,
        A.price,
        A.amount
FROM    invoice A
JOIN    seller B ON B.id = A.seller_id
JOIN    area_desc C ON C.id = B.area_desc_id
JOIN    area D ON D.id = C.area_id
LEFT JOIN minor_desc ZA on ZA.code_id = 'C0001' AND ZA.id = A.payment_status
LEFT JOIN minor_desc ZB on ZB.code_id = 'C0002' AND ZB.id = A.payment_method
ORDER BY A.inv_dt DESC
`);
}
// =================================================================================================================
// DB에서 읽어들인 데이터를 객체 데이터로 변환하여 반환하는 함수들
// =================================================================================================================
// 2. 메뉴 조회 
export const getMenus = async (title = '') => {
    const menus = await getRawMenus();
    const subMenus = await getRawSubMenus(title);
    // 메뉴 맵 생성
    const menuMap = new Map();
    // 1단계: 메뉴 객체 생성
    menus.forEach((menu) => {
        const navItem = {
            id: menu.ID,
            title: menu.TITLE || '',
            img: menu.IMG || '',
            description: menu.DESCRIPTION || '',
            sub_menus: []
        };
        menuMap.set(navItem.id, navItem);
    });
    // 2단계: 서브메뉴 연결 (1-1 → id="1"에 추가)
    subMenus.forEach((sub) => {
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
};
// 3. Invoice 조회
export const getInvoices = async () => {
    const invoices = await getRawInvoices();
    return invoices.map((inv) => ({
        id: inv.ID,
        inv_dt: inv.INV_DT,
        seller_id: inv.SELLER_ID,
        seller_name: inv.SELLER_NAME,
        area_name: inv.AREA_NAME,
        payment_status: inv.PAYMENT_STATUS,
        payment_method: inv.PAYMENT_METHOD,
        payment_status_color: inv.PAYMENT_STATUS_COLOR,
        payment_method_color: inv.PAYMENT_METHOD_COLOR,
        qty: inv.QTY,
        price: inv.PRICE,
        amount: inv.AMOUNT
    }));
};
// 4. Column Description 조회
export const getColDescs = async (tableName) => {
    const colDescs = await getRawColDescs(tableName);
    return colDescs.map((col) => ({
        id: col.ID,
        title: col.TITLE,
        type: col.TYPE,
        width: col.WIDTH,
        summary: col.SUMMARY,
        aggregate: 0
    }));
};
