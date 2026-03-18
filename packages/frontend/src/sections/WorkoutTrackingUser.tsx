import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { UserRoundPlus  } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Member } from "shared";

const WorkoutTrackingUser = () => {
   const [member, setMember] = useState<Member | null>(null);
   const memberId = 'U000001'; // 예시 회원 ID
   useEffect(() => {
     // 회원 정보 조회
     fetch(`http://localhost:3001/api/get_member?memberId=${memberId}`)
       .then(res => res.json())
       .then(data => {
         setMember(data.data); 
     });    
   }, []);    

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-primary">회원정보 : {member?.lvl} <span className="text-primary">Lvl</span> </CardTitle>
        <CardAction className="flex items-center gap-2">
          {member?.membership === 'V' && <><UserRoundPlus /><Link className="text-md text-focus" to="/member/register">회원가입</Link> </>}
        </CardAction>      
      </CardHeader>
      <CardContent>
        <div className="flex gap-8 text-lg">
          <div>
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={member?.img}
                alt={member?.name}
                className={member?.membership === 'F' ? "grayscale" : ""}            
              />
              <AvatarFallback>사용자</AvatarFallback>
              <AvatarBadge className="w-3 h-3 border-2 border-background bg-green-600 dark:bg-green-800" />         
            </Avatar>
          </div>
          <div className="grid grid-cols-2 grid-rows-5 gap-0">
            <div> ID : </div><div className="text-primary">{member?.id}</div>
            <div> 이름 : </div><div className="text-primary">{member?.name}</div>
            <div> 나이 : </div><div className="text-primary">{member?.age}세</div>
            <div> 성별 : </div><div className="text-primary">{member?.sex}</div>
         </div>
        </div>
        <Separator />        
        <div className="flex justify-between p-1 text-xl">
          <div> 포인트 : <span className="text-primary">{member?.point}점</span></div>
          <div> 구독정보 : <span className="text-primary">{member?.membership_name}</span></div>
        </div> 
        <div className="flex justify-between p-1 text-xl">
          <div> 경험치 : <span className="text-primary">{member?.exp_point}점</span></div>
        </div> 
      </CardContent>
    </Card>
  )
}

export default WorkoutTrackingUser;