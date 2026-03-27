import WdogBreadClum from "@/components/WdogBreadClum";
import MemberPlans from "@/sections/MemberPlans";



export default function MemberPlan() {

  return (
    <div className="flex flex-col gap-3">
      <div>
        <WdogBreadClum page="MemberPlan"/> 
      </div>
      <div>
       <MemberPlans/>
      </div>
    </div>
  );
} 
