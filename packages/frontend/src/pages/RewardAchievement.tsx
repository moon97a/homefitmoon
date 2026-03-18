import WdogBreadClum from "@/components/WdogBreadClum";
import RewardAchievementAchievement from "@/sections/RewardAchievementAchievement";

import WorkoutTrackingUser from "@/sections/WorkoutTrackingUser";


export default function RewardAchievement() {

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="RewardAchievement"/> 
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-2/3"><RewardAchievementAchievement/></div>
        <div className="w-1/3"><WorkoutTrackingUser/></div>
      </div>     
    </div>

  );
}