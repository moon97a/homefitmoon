import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const RewardAchievementAchievement = () => {
  const rewards = [
    {
      img: "publicPic.png",
      name: "100회 달성",
      description: "100회 달성 시 획득"
    },
    {
      img: "srcPic.png",
      name: "5일 연속 운동",
      description: "5일 연속 운동 시 획득"
    },


  ]


  return (
    <div className="flex gap-2 flex-wrap">
      {rewards?.map((reward, index) => {
        return(
        <Card className="relative mx-auto w-full max-w-sm pt-0">
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src= {reward.img}
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover"
          />
          <CardHeader>
            <CardAction>
              <Badge variant="secondary">Featured</Badge>
            </CardAction>
            <CardTitle>{reward.name}</CardTitle>
            <CardDescription>
              {reward.description}
            </CardDescription>
          </CardHeader>
        </Card>
       )})}
    </div>
  )
}

export default RewardAchievementAchievement;