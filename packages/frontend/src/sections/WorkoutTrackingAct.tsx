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
import { Play } from "lucide-react"
import { useEffect, useState } from "react"
import type { WorkoutDetail } from "shared"

const WorkoutTrackingAct = () => {
   const [workouts, setWorkouts] = useState<WorkoutDetail[] | null>(null);
   const workoutRecordId = 'WR00001'; // 예시 운동 기록 ID
   useEffect(() => {
     // 회원 정보 조회
     fetch(`http://localhost:3001/api/get_workout_detail?workoutRecordId=${workoutRecordId}`)
       .then(res => res.json())
       .then(data => {
         setWorkouts(data.data); 
     });    
   }, []);   

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">운동 시작하기</CardTitle>
        <CardDescription className="text-lg text-primary">
          AI가 실시간으로 자세를 분석하고 피드백을 제공합니다
        </CardDescription>
        <CardAction>
          <Button className="text-lg border-2 shadow-lg">AI추천</Button>          
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            오늘의 운동 프로그램
          </div>
          {workouts?.map((workout, index) => {
            return (
              <div className="flex gap-3 items-start justify-between bg-gray-100 p-4 h-20" id={`workout-${index}`}> 
                <div className="flex gap-3">
                  <Badge className="h-13 w-13 rounded-full p-0 flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </Badge>
                  <div> 
                      <div className="text-xl font-bold">
                        {workout.title}
                      </div>
                      <div className="text-primary"> 
                        {workout.guide}
                      </div>
                  </div>
                  <div>
                    <img 
                      src={workout.img}  // 새 투명 PNG 사용
                      alt={workout.title} 
                      className="w-20 h-20 object-contain hover:animate-heartbeat hover:scale-140 hover:ring-4 hover:ring-emerald-400/50 transition-all duration-700 bg-linear-to-br rounded-xl" 
                    />                  
                  </div>  
                </div>
                <div className="text-2xl"> 
                  {workout.target_reps}회&nbsp;{workout.target_sets}세트  
                </div>
              </div>
            )})}
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full text-3xl mt-8 py-8 rounded-2xl shadow-lg">
          운동시작하기
          <Play className="size-8" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default WorkoutTrackingAct;