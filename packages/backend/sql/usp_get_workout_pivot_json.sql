create or replace PROCEDURE usp_get_workout_pivot_json(
  p_member_id NVARCHAR2,
  p_from_dt   DATE,
  p_to_dt     DATE,
  p_result_json OUT CLOB
) 
IS
  v_cols        CLOB;  -- PIVOT IN 절
  v_sql_data    CLOB;  -- 피벗 + JSON 배열 SQL
  v_data_json   CLOB;  -- data 부분 JSON
  v_cols_json   CLOB;  -- columns 부분 JSON
BEGIN
  -- 1) PIVOT IN 절 컬럼 목록
  SELECT LISTAGG(
           '''' || workout_id || ''' AS "' || workout_id || '"',
           ', '
         )
    INTO v_cols
    FROM (
      SELECT DISTINCT B.workout_id
      FROM workout_record A
           JOIN workout_detail B ON B.workout_record_id = A.id
      WHERE A.member_id = p_member_id
        AND A.wo_dt BETWEEN p_from_dt AND p_to_dt
    );

  -- 2) columns: workout_id / workout_name 리스트 JSON
  SELECT JSON_ARRAYAGG(
           JSON_OBJECT(
             'id'   VALUE w.id,
             'name' VALUE w.title
           )
         )
    INTO v_cols_json
    FROM (
      SELECT DISTINCT C.id, C.title
      FROM workout_record A
           JOIN workout_detail B ON B.workout_record_id = A.id
           JOIN workout C        ON C.id = B.workout_id
      WHERE A.member_id = p_member_id
        AND A.wo_dt BETWEEN p_from_dt AND p_to_dt
    ) w;

  -- 3) data: 동적 PIVOT 결과를 JSON 배열로 만드는 SQL
  v_sql_data := '
    WITH workout AS (
      SELECT DISTINCT B.workout_id
      FROM workout_record A
           JOIN workout_detail B ON B.workout_record_id = A.id
      WHERE A.member_id = ''' || p_member_id || '''
        AND A.wo_dt BETWEEN ''' || p_from_dt || ''' AND ''' || p_to_dt || '''
    ), date_range AS (
      SELECT 
        TRUNC(TO_DATE(''' || p_from_dt || ''', ''YYYY-MM-DD'')) + LEVEL - 1 AS date_val
      FROM DUAL 
      CONNECT BY LEVEL <= TRUNC(TO_DATE(''' || p_to_dt || ''', ''YYYY-MM-DD'') - TO_DATE(''' || p_from_dt || ''', ''YYYY-MM-DD'')) + 1
    )
    SELECT JSON_ARRAYAGG(
             JSON_OBJECT(
               ''wo_dt'' VALUE wo_dt';

  FOR c IN (
    SELECT DISTINCT B.workout_id
    FROM workout_record A
         JOIN workout_detail B ON B.workout_record_id = A.id
    WHERE A.member_id = p_member_id
      AND A.wo_dt BETWEEN p_from_dt AND p_to_dt
  ) LOOP
    v_sql_data := v_sql_data ||
                  ', ''' || c.workout_id || ''' VALUE ' || c.workout_id;
  END LOOP;

  v_sql_data := v_sql_data || '
             ) RETURNING CLOB
           ) AS j
      FROM (
        SELECT *
        FROM (
          SELECT TO_CHAR(dr.date_val, ''DD'') wo_dt, 
                 w.workout_id,
                 0 count
          FROM   date_range dr
          CROSS JOIN workout w

          UNION ALL 

          SELECT TO_CHAR(A.wo_dt, ''DD''),
                 B.workout_id,
                 B.count
          FROM   workout_record A
                 JOIN workout_detail B ON B.workout_record_id = A.id
          WHERE  A.member_id = ''' || p_member_id || '''
          AND    A.wo_dt BETWEEN ''' || p_from_dt || ''' AND ''' || p_to_dt || '''
        )
        PIVOT (
          SUM(count)
          FOR workout_id IN (' || v_cols || ')
        )
      )
      ';
--DBMS_OUTPUT.PUT_LINE(v_sql_data);  -- 크기 확인

  EXECUTE IMMEDIATE v_sql_data
    INTO v_data_json;

--  DBMS_OUTPUT.PUT_LINE(v_cols_json);  -- 크기 확인
--  DBMS_OUTPUT.PUT_LINE(v_data_json);  -- 크기 확인
  -- 4) columns + data 하나로 합치기
   p_result_json := '{
    "columns": ' || NVL(v_cols_json, '[]') || ',
    "data": ' || NVL(v_data_json, '[]') || '
  }';
  -- DBMS_OUTPUT.PUT_LINE(p_result_json);  -- 크기 확인  
END;
/