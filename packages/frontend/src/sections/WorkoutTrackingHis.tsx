
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom";
import { ChartNoAxesCombined  } from 'lucide-react';
import { useEffect, useState } from "react";
import type { WorkoutHistory } from "shared";

const WorkoutTrackingHis = () => {
   const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
   const memberId = 'U000001'; // 예시 회원 ID
   useEffect(() => {
     // 그리드 데이터 
     fetch(`http://localhost:3001/api/get_workout_history?memberId=${memberId}`)
       .then(res => res.json())
       .then(data => {
         setWorkoutHistory(data.data);  
     });    
   }, []);    
  
  const unregisterd = true; // 예시로 등록 여부를 나타내는 변수
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">운동 기록</CardTitle>
        <CardDescription className="text-lg text-primary">
          일주일간의 운동 기록을 확인합니다.
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          {unregisterd && <><ChartNoAxesCombined /><Link className="text-md text-focus" to="/history/state">운동내역</Link> </>}
        </CardAction>        
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {workoutHistory.map((workout, index) => (
            <StampItem
              key={index}
              status={workout.status === 'G' ? 'good' : 'bad'}
              date={workout.wo_dt}
            />
          ))}
        </div>  
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}

const StampItem = ({ status, date }: { status: 'good' | 'bad', date?: string }) => {
  const imgSrc = status === 'good' ? '/good.png' : '/bad.png';
  const isBad = status === 'bad';
  
  return (
    <div className="flex flex-col items-center gap-1">
      <img 
        src={imgSrc} 
        alt="운동 기록" 
        className={`w-20 h-20 object-cover bg-linear-to-br ${isBad ? 'grayscale' : ''}`} 
      />
      {date && <p className="text-sm text-primary font-bold">{date}</p>}
    </div>
  );
};

export default WorkoutTrackingHis;