import WorkoutTrackingAct from "@/sections/WorkoutTrackingAct";
import WorkoutTrackingUser from "@/sections/WorkoutTrackingUser";
import WdogBreadClum from "@/components/WdogBreadClum";
import WorkoutTrackingHis from "@/sections/WorkoutTrackingHis";

export default function WorkoutTracking() {

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="WorkoutTracking"/> 
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-3/4">
          <WorkoutTrackingAct />      
        </div>
        <div className="flex flex-col gap-2 w-1/4">
          <WorkoutTrackingUser />     
          <WorkoutTrackingHis /> 
        </div>
      </div>     
    </div>
  );
}