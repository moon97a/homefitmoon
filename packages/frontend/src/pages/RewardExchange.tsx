import WdogBreadClum from "@/components/WdogBreadClum";
import MemberExchangeMain from "@/sections/RewardExchangeMain";

export default function RewardExchange() {

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="RewardExchange"/> 
      </div>
      <div className="flex gap-4">
        <MemberExchangeMain />
      </div>  
    </div>
  );
}