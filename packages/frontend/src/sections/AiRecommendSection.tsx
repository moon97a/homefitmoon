import React, { useState } from 'react';

// 1. [수정 가능] 인터페이스 정의
// 만약 추천 결과에 '소모 칼로리'나 '주의사항' 같은 데이터가 더 필요하면 여기에 추가하세요.
interface ExerciseRecommend {
  name: string;   // 운동 이름 (예: 플랭크)
  sets: string;   // 횟수 및 세트 (예: 15회 3세트)
  reason: string; // AI가 이 운동을 추천한 이유
}

const AiRecommendSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<ExerciseRecommend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRecommend = async () => {
    setLoading(true);
    
    try {
      /**
       * 2. [필수 수정] 로그인된 사용자 정보 가져오기
       * 지금은 하드코딩되어 있지만, 실제로는 로그인 성공 시 저장해둔
       * Context API, Redux, 또는 LocalStorage의 사용자 정보를 여기 넣어야 합니다.
       */
      const userProfile = {
        name: "문정인", // 로그인한 사용자의 실제 이름 변수
        age: 30,       // 사용자 나이
        gender: "여성", // 사용자 성별
        goal: "코어 강화" // 사용자의 운동 목적 (다이어트, 근력 증강 등)
      };

      /**
       * 3. [추가 권장] 우리 서비스가 보유한 운동 목록
       * Gemini가 엉뚱한 운동을 추천하지 않도록, 우리가 구현해놓은 운동들만 보내주는 게 좋습니다.
       */
      const availableExercises = ["플랭크", "런지", "스쿼트", "푸쉬업"];

      /**
       * 4. [필수 수정] 백엔드 API 주소 및 포트
       * 본인의 Node.js 서버 포트가 5000번이 아니라면 (예: 4000, 8080) 반드시 수정하세요!
       * 배포 후에는 'http://localhost:5000' 대신 실제 서버 주소가 들어갑니다.
       */
      const response = await fetch('http://localhost:5173/workout/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userProfile, 
          availableExercises // 우리 운동 목록도 같이 보냅니다.
        })
      });

      if (!response.ok) throw new Error("서버 응답 에러");

      const data: ExerciseRecommend[] = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("AI 추천 요청 실패:", error);
      alert("AI 코치와 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요!");
    } finally {
      setLoading(false);
    }
  };

  return (
    /**
     * 5. [수정 가능] 디자인/스타일링
     * 현재는 인라인 스타일로 되어 있습니다. 
     * HomeFit 프로젝트에서 사용하는 CSS Module이나 Tailwind 등으로 클래스명을 바꿔주세요.
     */
    <section className="homefit-ai-section" style={{ padding: '2rem', backgroundColor: '#f9f9f9' }}>
      <h2>🤖 HomeFit 맞춤 코칭</h2>
      <p>{/* 사용자 이름 변수를 활용해 보세요 */} 정인님에게 딱 맞는 오늘 루틴을 짜드릴게요.</p>
      
      <button 
        onClick={handleRecommend} 
        disabled={loading}
        className="recommend-btn" // 디자인 시스템에 맞춰 수정
      >
        {loading ? 'AI 코치가 분석 중...' : 'AI 맞춤 추천받기'}
      </button>

      <div className="recommendation-list" style={{ marginTop: '20px' }}>
        {recommendations.length > 0 ? (
          recommendations.map((item, index) => (
            <div key={index} className="exercise-card" style={{ 
              border: '1px solid #ddd', 
              margin: '10px 0', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: 'white' 
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#4A90E2' }}>{item.name}</h3>
              <p><strong>권장 강도:</strong> {item.sets}</p>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>
                ✨ {item.reason}
              </p>
            </div>
          ))
        ) : (
          !loading && <p style={{ color: '#999' }}>아직 추천받은 운동이 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default AiRecommendSection;