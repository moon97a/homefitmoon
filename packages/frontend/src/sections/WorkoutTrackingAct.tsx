import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Sparkles, Dumbbell } from "lucide-react"
import { useEffect, useState } from "react"
import type { WorkoutDetail } from "shared"

// 💡 한글 운동 이름을 영어 파일 이름으로 바꿔주는 지도입니다!
const exerciseImageMap: { [key: string]: string } = {
  "플랭크": "plank",
  "스쿼트": "squat",
  "런지": "lunge",
  "푸시업": "pushup",
  "버피테스트": "burpee", // 나중에 추가될 수 있는 것들도 대비!
};

const WorkoutTrackingAct = () => {
  const [workouts, setWorkouts] = useState<WorkoutDetail[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const workoutRecordId = 'WR00001';

  useEffect(() => {
    fetch(`http://localhost:3001/api/get_workout_detail?workoutRecordId=${workoutRecordId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setWorkouts(data.data);
      })
      .catch(err => console.error("데이터 로드 실패:", err));
  }, []);

  const handleAIRecommend = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/recommend-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: { name: "문정인", age: 30, gender: "여성", goal: "코어 및 어깨 강화" },
          availableExercises: ["플랭크", "런지", "스쿼트", "푸시업"]
        })
      });
      const aiData = await response.json();
      const formatted: WorkoutDetail[] = aiData.map((item: any) => ({
        title: item.name || "추천 운동",
        guide: item.reason || "맞춤 추천 운동입니다.",
        target_reps: parseInt(item.sets?.match(/\d+/)?.[0] || "15"),
        target_sets: parseInt(item.sets?.match(/(\d+)세트/)?.[1] || "3"),
        // 💡 item.name이 "플랭크"면 "plank"로 바꿔서 경로 생성
        img: `/workout/${exerciseImageMap[item.name] || 'default'}.png`
      }));
      setWorkouts(formatted);
    } catch (error) {
      console.error("추천 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-extrabold text-gray-800">운동 시작하기</CardTitle>
          <CardDescription className="text-lg text-emerald-600 font-medium">
            AI가 실시간으로 자세를 분석하고 피드백을 제공합니다
          </CardDescription>
        </div>
        <CardAction>
          <Button 
            className={`text-lg font-bold px-6 py-2 rounded-full transition-all border-2 ${
              isLoading ? "bg-gray-100 text-gray-400" : "bg-white text-emerald-600 border-emerald-500 hover:bg-emerald-50"
            }`}
            onClick={handleAIRecommend}
            disabled={isLoading}
          >
            {isLoading ? "AI 분석 중..." : <><Sparkles className="mr-2 h-5 w-5" /> AI추천</>}
          </Button>          
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="text-xl font-bold text-gray-700">오늘의 운동 프로그램</div>
          {!workouts || workouts.length === 0 ? (
            <div className="py-20 text-center text-gray-400 border-2 border-dashed rounded-2xl">
              정보를 불러오는 중입니다...
            </div>
          ) : (
            workouts.map((workout, index) => (
              <div key={index} className="flex gap-4 items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100"> 
                <div className="flex gap-5 items-center">
                  <Badge className="h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold bg-emerald-500 text-white">
                    {index + 1}
                  </Badge>
                  <div> 
                    <div className="text-xl font-bold text-gray-800">{workout.title}</div>
                    <div className="text-gray-500 text-sm max-w-[300px] truncate">{workout.guide}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-2xl font-black text-gray-700"> 
                    {workout.target_reps}회 <span className="text-lg font-normal text-gray-400">/</span> {workout.target_sets}세트
                  </div>
                  
                  {/* 💡 이미지 경로 수정됨! */}
                  <div className="w-20 h-20 bg-white rounded-xl border flex items-center justify-center overflow-hidden">
                    <img 
                      src={workout.img || `/workout/${exerciseImageMap[workout.title]}.png`} 
                      alt={workout.title} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if(parent) parent.innerHTML = '<div class="text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dumbbell"><path d="m6.5 6.5 11 11"/><path d="m10 10 5.5 5.5"/><path d="m3 21 8-8"/><path d="m9 20 2-2"/><path d="m14 14 8-8"/><path d="m15 9 2-2"/><path d="M2.5 13 5 15.5"/><path d="m13 2.5 2.5 2.5"/><path d="m8.5 20 2.5 2.5"/><path d="m20 8.5 2.5 2.5"/></svg></div>';
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full text-3xl py-10 rounded-3xl bg-gray-800 hover:bg-black text-white shadow-xl transition-all">
          운동시작하기 <Play className="ml-4 size-8 fill-white" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default WorkoutTrackingAct;