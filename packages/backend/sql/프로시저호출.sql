-- 서버아웃풋 활성화
SET SERVEROUTPUT ON SIZE UNLIMITED;

-- 방법2: 익명 블록 (상세)
DECLARE
  v_result CLOB;
BEGIN
  usp_get_workout_pivot_json('U000001', DATE '2026-01-01', DATE '2026-01-05', v_result);
  DBMS_OUTPUT.PUT_LINE('결과: ' || DBMS_LOB.SUBSTR(v_result, 1000, 1));
END;
/