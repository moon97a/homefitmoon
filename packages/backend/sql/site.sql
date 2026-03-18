REM Copyright : Copyright (c) 2026 by White Dog
REM Author : 109 
REM History : 2026-02-03 - 최초 작성 
REM Remark : oracle 용 SQL
REM
SET TERMOUT OFF
SET ECHO OFF
SET DEFINE OFF;

REM ===============================================================================================================
REM = 메뉴삭제 
REM ===============================================================================================================
DROP TABLE NAV_SUB_ITEM;
DROP TABLE NAV_ITEM;
REM ===============================================================================================================
REM = 메뉴
REM ===============================================================================================================
CREATE TABLE NAV_ITEM
(
    ID VARCHAR2(5) NOT NULL,
	TITLE NVARCHAR2(14) NOT NULL,
    IMG NVARCHAR2(256) NOT NULL,
	DESCRIPTION NVARCHAR2(1024) NOT NULL, 
    CONSTRAINT NAV_ITEM_PK PRIMARY KEY (ID)  
);

INSERT INTO NAV_ITEM VALUES
(
    'M0001', '운동', '/menu/workout.jpg','운동을 측정하고 기록합니다.'
);
INSERT INTO NAV_ITEM VALUES
(
    'M0002', '기록', '/menu/history.jpg','운동 성과를 확인합니다.'
);
INSERT INTO NAV_ITEM VALUES
(
    'M0003', '보상', '/menu/reward.jpg','포인트, 업적, 순위를 확인하며 쇼핑몰에서 운동용품을 구입할 수 있습니다.'
);
INSERT INTO NAV_ITEM VALUES
(
    'M0004', '내정보', '/menu/member.jpg','개인 정보를 관리합니다.'
);

SELECT *
FROM   NAV_ITEM;
REM ===============================================================================================================
REM = 상세메뉴
REM ===============================================================================================================
CREATE TABLE NAV_SUB_ITEM
(
    NAV_ITEM_ID VARCHAR2(5) NOT NULL, 
    ID VARCHAR2(5) NOT NULL,
	TITLE NVARCHAR2(14) NOT NULL,
    IMG NVARCHAR2(256) NOT NULL,
	DESCRIPTION NVARCHAR2(1024), 
    PAGE NVARCHAR2(256) NOT NULL,
    HREF NVARCHAR2(256) NOT NULL,
    CONSTRAINT NAV_SUB_ITEM_PK PRIMARY KEY (NAV_ITEM_ID, ID),
    CONSTRAINT NAV_SUB_ITEM_USER_NAV_ITEM_ID_FK FOREIGN KEY (NAV_ITEM_ID) REFERENCES NAV_ITEM(ID)    
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0001', 'S0001', '운동하기','/menu/tracking.jpg', '프로그램에 따라 운동을 수행합니다.', 'WorkoutTracking', '/workout/tracking'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0002', 'S0001', '운동내역','/menu/state.jpg', '운동 내역을 확인합니다.', 'HistoryState', '/history/state'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0002', 'S0002', '콘텐츠제작','/menu/content.jpg', '운동 내역으로 SNS 콘텐츠를 자동 생성합니다.', 'HistoryContent', '/history/content'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0003', 'S0001', '포인트','/menu/point.jpg', '운동 포인트를 확인합니다.', 'RewardPoint', '/reward/point'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0003', 'S0002', '업적','/menu/achievement.jpg', '운동 업적을 확인합니다.', 'RewardAchievement', '/reward/achievement'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0003', 'S0003', '순위','/menu/ranking.jpg', '운동 순위를 확인합니다.', 'RewardRanking', '/reward/ranking'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0003', 'S0004', '쇼핑몰','/menu/mall.jpg', '굿즈 또는 운동용품을 구매합니다.', 'RewardMall', '/reward/mall'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0004', 'S0001', '프로필','/menu/profile.jpg', '개인 정보를 관리합니다.', 'MemberProfile', '/member/profile'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0004', 'S0002', '회원등록','/menu/register.png', '개인 정보를 등록합니다.', 'MemberRegister', '/member/register'
);
INSERT INTO NAV_SUB_ITEM VALUES
(
    'M0004', 'S0003', '운동목표','/menu/plan.jpg', '운동 목표를 설정하고 관리합니다.', 'MemberPlan', '/member/plan'
);

SELECT *
FROM   NAV_SUB_ITEM;

REM ===============================================================================================================
REM = 코드삭제 
REM ===============================================================================================================
DROP TABLE MINOR_DESC;
DROP TABLE CODE_DESC;
REM ===============================================================================================================
REM # 코드 정의서
REM ===============================================================================================================
CREATE TABLE CODE_DESC
(
    ID VARCHAR2(5) NOT NULL,
    NAME NVARCHAR2(100) NOT NULL,
    CONSTRAINT CODE_DESC_PK PRIMARY KEY (ID) 
);
INSERT INTO CODE_DESC VALUES ('C0001', 'Payment Status');
INSERT INTO CODE_DESC VALUES ('C0002', 'Payment Method');
INSERT INTO CODE_DESC VALUES ('C0003', 'Sex');
INSERT INTO CODE_DESC VALUES ('C0004', 'Membership');

CREATE TABLE MINOR_DESC
(
    CODE_ID VARCHAR2(5) NOT NULL,
    ID VARCHAR2(5) NOT NULL,
    NAME NVARCHAR2(100) NOT NULL,
    ORD NUMBER(4) NOT NULL,    
    CONSTRAINT MINOR_DESC_PK PRIMARY KEY (CODE_ID, ID),
    CONSTRAINT MINOR_DESC_CODE_DESC_FK FOREIGN KEY (CODE_ID) REFERENCES CODE_DESC(ID)
);
INSERT INTO MINOR_DESC VALUES ('C0001', 'PY', '정산', 1);
INSERT INTO MINOR_DESC VALUES ('C0001', 'PD', '진행중', 2);

INSERT INTO MINOR_DESC VALUES ('C0002', 'CD', '신용카드', 1);
INSERT INTO MINOR_DESC VALUES ('C0002', 'CH', '현금', 2);
INSERT INTO MINOR_DESC VALUES ('C0002', 'KP', '카카오페이', 3);

INSERT INTO MINOR_DESC VALUES ('C0003', 'M', '남성', 1);
INSERT INTO MINOR_DESC VALUES ('C0003', 'F', '여성', 2);

INSERT INTO MINOR_DESC VALUES ('C0004', 'F', '무료', 1);
INSERT INTO MINOR_DESC VALUES ('C0004', 'N', '일반', 2);
INSERT INTO MINOR_DESC VALUES ('C0004', 'V', 'VIP', 3);

SELECT  *
FROM    CODE_DESC; 
SELECT  *
FROM    MINOR_DESC; 

REM ===============================================================================================================
REM = 테이블 칼럼 삭제 
REM ===============================================================================================================
DROP TABLE COLUMN_DESC;
REM ===============================================================================================================
REM # 테이블 칼럼 명세서
REM ===============================================================================================================
CREATE TABLE COLUMN_DESC
(
    TABLE_NAME VARCHAR2(30) NOT NULL,
    SEQ NUMBER(10) NOT NULL,
    ORD NUMBER(2) NOT NULL,
    ID VARCHAR2(20) NOT NULL,
    TITLE NVARCHAR2(50) NOT NULL,
    TYPE VARCHAR2(20) NOT NULL,
    WIDTH NUMBER(10),
    SUMMARY VARCHAR2(100),
    CONSTRAINT COLUMN_DESC_PK PRIMARY KEY (TABLE_NAME, SEQ)  -- 
);

INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 1, 1, 'id', '운동번호', 'key', 80, null);
INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 2, 2, 'wo_dt', '운동일', 'dat', 100, null);
INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 3, 3, 'title', '운동명', 'lst', 100, null);
INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 4, 4, 'target_reps', '반복횟수', 'qty', 100, 'sum');
INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 5, 5, 'target_sets', '세트수', 'qty', 100, 'sum');
INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 6, 6, 'count', '실행횟수', 'qty', 100, 'sum');  
INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 7, 7, 'point', '획득포인트', 'qty', 100, 'sum');  
INSERT INTO COLUMN_DESC VALUES ('WorkoutRecord', 8, 8, 'description', '운동내역', 'str', 100, 'sum');  

INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 1, 1, 'id', '운동번호', 'key', 80, null);
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 2, 2, 'wo_dt', '운동일', 'dat', 100, null);
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 3, 3, 'title', '운동명', 'lst', 100, null);
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 4, 4, 'target_reps', '반복횟수', 'qty', 100, 'sum');
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 5, 5, 'target_sets', '세트수', 'qty', 100, 'sum');
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 6, 6, 'count_p', '권장횟수', 'qty', 100, 'sum');  
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 7, 7, 'count', '실행횟수', 'qty', 100, 'sum');  
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 8, 8, 'count_s', '잔여횟수', 'qty', 100, 'sum');  
INSERT INTO COLUMN_DESC VALUES ('WorkoutAchievement', 9, 9, 'description', '운동내역', 'str', 100, 'sum');  

SELECT *
FROM   COLUMN_DESC
WHERE  TABLE_NAME = 'WorkoutRecord';

REM ===============================================================================================================
REM = 홈트 테이블 삭제  
REM ===============================================================================================================
DROP TABLE WORKOUT_DETAIL;
DROP TABLE WORKOUT_RECORD;
DROP TABLE MEMBER;
DROP TABLE WORKOUT;
DROP TABLE ACHIEVEMENT;
DROP TABLE REWARD;
REM ===============================================================================================================
REM = 회원 
REM ===============================================================================================================
CREATE TABLE MEMBER
(
    ID VARCHAR2(7) NOT NULL,
	NAME NVARCHAR2(14) NOT NULL,
    IMG NVARCHAR2(256) NOT NULL,
	SEX NVARCHAR2(3) NOT NULL,
    AGE NUMBER(3) NOT NULL, 
    POINT NUMBER(10) DEFAULT 0,
    EXP_POINT NUMBER(10) DEFAULT 0, 
    LVL NUMBER(10) DEFAULT 0, -- 4500 점마다 1vl 증가
    MEMBERSHIP NVARCHAR2(1) NOT NULL,
    CONSTRAINT MEMBER_PK PRIMARY KEY (ID)  -- 
);

INSERT INTO MEMBER VALUES
(
    'U000001', '백병구', '/member/U000001.jpg','남', 52, 0, 0, 1, 'V'
);
INSERT INTO MEMBER VALUES
(
    'U000002', '문정인', '/member/u000002.jpg','여', 24, 0, 0, 1, 'F'  
);
INSERT INTO MEMBER VALUES
(
    'U000003', '문성윤', '/member/u000003.jpg','남', 40, 0, 0, 1, 'N' 
);
INSERT INTO MEMBER VALUES
(
    'U000004', '김동건', '/member/u000004.jpg','남', 26, 0, 0, 1, 'N'
);

SELECT *
FROM   MEMBER;

REM ===============================================================================================================
REM = 운동
REM ===============================================================================================================
CREATE TABLE WORKOUT
(
    ID VARCHAR2(5) NOT NULL,
	TITLE NVARCHAR2(14) NOT NULL,
    IMG NVARCHAR2(256) NOT NULL,
	DESCRIPTION NVARCHAR2(512) NOT NULL, 
    GUIDE NVARCHAR2(512) NOT NULL,
    CONSTRAINT WORKOUT_PK PRIMARY KEY (ID)  -- 
);

INSERT INTO WORKOUT VALUES
(
    'W0001', '프랭크', '/workout/plank.png','코어 근육(복근, 허리, 등)을 강화하는 운동으로, 몸을 널빤지처럼 일직선으로 유지하는 동작입니다.', '30초 동안 자세 유지하기'
);
INSERT INTO WORKOUT VALUES
(
    'W0002', '스쿼트', '/workout/squat.png','하체 근육(허벅지, 엉덩이)을 강화하는 운동으로, 무릎과 엉덩이를 굽히고 펴는 동작입니다.', '다리를 어깨 너비로 벌리고 앉았다 일어나기'
);
INSERT INTO WORKOUT VALUES
(
    'W0003', '푸시업', '/workout/pushup.png','상체 근육(가슴, 어깨, 삼두근)을 강화하는 운동으로, 팔을 굽히고 펴는 동작입니다.', '손은 어깨너비보다 약간 넓게, 손가락은 앞쪽으로 향하게 위치'
);
INSERT INTO WORKOUT VALUES
(
    'W0004', '런지', '/workout/lunge.png','하체 근육(허벅지, 엉덩이)을 강화하는 운동으로, 한쪽 다리를 앞으로 내딛고 무릎을 굽히는 동작입니다.', '좌우 각 10회씩 반복하기'
);

SELECT *
FROM   WORKOUT;

REM ===============================================================================================================
REM = 운동기록 
REM ===============================================================================================================
CREATE TABLE WORKOUT_RECORD 
(
    ID VARCHAR2(7) NOT NULL,
    MEMBER_ID VARCHAR2(7) NOT NULL,
	WO_DT DATE DEFAULT SYSDATE,
    DESCRIPTION NVARCHAR2(1024) NOT NULL, 
    CONSTRAINT WORKOUT_RECORD_PK PRIMARY KEY (ID), 
    CONSTRAINT WORKOUT_RECORD_USER_ID_FK FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER(ID)    
    
);

INSERT INTO WORKOUT_RECORD VALUES
(
    'WR00001', 'U000001', '2026-03-01', '첫번째 운동'
);
INSERT INTO WORKOUT_RECORD VALUES
(
    'WR00002', 'U000001', '2026-03-02', '두번째 운동'
);
INSERT INTO WORKOUT_RECORD VALUES
(
    'WR00003', 'U000001', '2026-03-12', '첫번째 운동'
);
INSERT INTO WORKOUT_RECORD VALUES
(
    'WR00004', 'U000002', '2026-03-02', '두번째 운동'
);

SELECT *
FROM   WORKOUT_RECORD;
REM ===============================================================================================================
REM = 운동상세
REM ===============================================================================================================
CREATE TABLE WORKOUT_DETAIL 
(
    WORKOUT_RECORD_ID VARCHAR2(7) NOT NULL,
    WORKOUT_ID VARCHAR2(5) NOT NULL,
    TARGET_REPS NUMBER(10) NOT NULL, -- 권장운동횟수
    TARGET_SETS NUMBER(10) NOT NULL, -- 권장세트수
    COUNT NUMBER(10) NOT NULL, -- 실제운동횟수
    POINT NUMBER(10) NOT NULL, -- 운동포인트
    CONSTRAINT WORKOUT_DETAIL_PK PRIMARY KEY (WORKOUT_RECORD_ID, WORKOUT_ID),  -- 
    CONSTRAINT WORKOUT_DETAIL_WORKOUT_ID_FK FOREIGN KEY (WORKOUT_ID) REFERENCES WORKOUT(ID)    
);

INSERT INTO WORKOUT_DETAIL VALUES
(
    'WR00001', 'W0001', 15, 3, 45, 0
);
INSERT INTO WORKOUT_DETAIL VALUES
(
    'WR00001', 'W0002', 30, 2, 60, 0
);
INSERT INTO WORKOUT_DETAIL VALUES
(
    'WR00001', 'W0003', 20, 3, 55, 0
);
INSERT INTO WORKOUT_DETAIL VALUES
(
    'WR00002', 'W0001', 15, 3, 30, 0 
);
INSERT INTO WORKOUT_DETAIL VALUES
(
    'WR00003', 'W0001', 15, 3, 45, 0
);
INSERT INTO WORKOUT_DETAIL VALUES
(
    'WR00003', 'W0002', 30, 2, 60, 0
);

SELECT *
FROM   WORKOUT_DETAIL;
REM ===============================================================================================================
REM = 업적
REM ===============================================================================================================
CREATE TABLE ACHIEVEMENT
(
    ID VARCHAR2(5) NOT NULL,
	TITLE NVARCHAR2(14) NOT NULL,
    IMG NVARCHAR2(256) NOT NULL,
	DESCRIPTION NVARCHAR2(1024) NOT NULL, 
    CONSTRAINT ACHIEVEMENT_PK PRIMARY KEY (ID)  -- 
);

INSERT INTO ACHIEVEMENT VALUES
(
    'W001', '첫 운동 완료', '/achievement/first.jpg','첫번째 운동을 완료.'
);
INSERT INTO ACHIEVEMENT VALUES
(
    'W002', '주간 챔피언', '/achievement/weeklychamp.jpg','일주일 동안 5회 운동 완료.'
);
INSERT INTO ACHIEVEMENT VALUES
(
    'W003', '완벽한 자세', '/achievement/perfectposture.jpg','자세 정확도 95% 이상 달성.'
);
INSERT INTO ACHIEVEMENT VALUES
(
    'W004', '꾸준함의 달인', '/achievement/consistency.jpg','7일 연속 운동 완료.'
);
INSERT INTO ACHIEVEMENT VALUES
(
    'W005', '100회 클럽', '/achievement/hundredclub.jpg','100회 운동 완료.'
);

SELECT *
FROM   ACHIEVEMENT;
REM ===============================================================================================================
REM = 보상
REM ===============================================================================================================
CREATE TABLE REWARD
(
    ID VARCHAR2(5) NOT NULL,
	TITLE NVARCHAR2(14) NOT NULL,
    IMG NVARCHAR2(256) NOT NULL,
	DESCRIPTION NVARCHAR2(1024) NOT NULL, 
    REQUIRE_POINT NUMBER(10) NOT NULL,
    CONSTRAINT REWARD_PK PRIMARY KEY (ID)  -- 
);

INSERT INTO REWARD VALUES
(
    'R002', '맞춤 운동 프로그램', '/reward/custom_program.jpg','AI가 나만의 운동 프로그램을 생성해줍니다', 50
);
INSERT INTO REWARD VALUES
(
    'R003', '홈트레이닝 용품 할인', '/reward/home_training_discount.jpg','홈트레이닝 용품을 할인된 가격에 구매하세요', 50
);
INSERT INTO REWARD VALUES
(
    'R004', '영양 가이드북', '/reward/nutrition_guide.jpg','영양 가이드북을 제공합니다', 30
);
INSERT INTO REWARD VALUES
(
    'R005', 'SNS 콘텐츠 제작권', '/reward/sns_content.jpg','SNS 콘텐츠를 제작할 수 있는 권한을 제공합니다', 70
);
INSERT INTO REWARD VALUES
(
    'R006', '1:1 온라인 상담', '/reward/online_consultation.jpg','전문 트레이너와 30분 온라인 상담', 70
);

SELECT *
FROM   REWARD;

COMMIT;

SET TERMOUT ON
SET ECHO ON
SET DEFINE ON;

