import WdogImage from '@/components/WdogImage'

export default function Home() {
  const wdogImage = {
    src : "home.jpg",
    title : "오늘 첫걸음, 내일의 나를 바꾼다!.",
    titleSize : "3xl",
    description : "집에서 15분 홈트로 몸매 UP, 자신감 UP! 오늘 첫걸음이 내일의 멋진 나를 만든다!"
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4">
        <div className="w-3/5">
          <WdogImage wdogImage={wdogImage}/>
        </div>
        <div className="w-2/5 max-w-2xl mx-auto p-8 rounded-xl shadow-xl border">
          {/* 헤더 */}
          <div className="w-full  border-gray-200 flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="font-bold text-2xl mb-1">홈트레이닝 성공 파트너</div>
            <div className="text-primary font-semibold">집에서 운동하는 당신을 위한 맞춤 가이드</div>
          </div>
      
          {/* 본문 */}
          <div className="space-y-4 leading-relaxed">
            <p className="text-primary text-lg">
              운동 시간, 부위별 효과, 칼로리 소모량, 진행 추적 데이터를 실시간 분석하여 
              <span className="font-bold"> 최적의 루틴과 목표 설정</span>을 추천합니다.
            </p>
            
            {/* 기능 하이라이트 */}
            <div className="flex gap-4 p-4 rounded-2xl border">
              <div className="flex items-start gap-3 p-3  rounded-xl">
                <div className="w-50">
                  <img src="routine.png" alt="설명" className="w-40 object-contain rounded-lg " />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">루틴 추천</h4>
                  <p className="text-primary text-sm">상체/하체/코어 맞춤 15분 프로그램</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 rounded-xl">
                <div className="w-50">
                  <img src="progress.png" alt="설명" className="w-40 object-contain rounded-lg " />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">진행 분석</h4>
                  <p className="text-primary text-sm">운동량, 근력 증가, 체지방 감소 예측</p>
                </div>
              </div>
            </div>

            <p className="text-xl">
              매일 15분, 꾸준한 홈트로 건강한 몸과 자신감을 키워보세요!
            </p>
        </div>
        </div>
      </div>
      <div>
        <img src="bottom.jpg" alt="설명" className="w-full h-40 object-contain rounded-lg " />
      </div>
    </div>
  );
}