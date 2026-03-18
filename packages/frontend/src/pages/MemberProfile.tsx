import WdogBreadClum from "@/components/WdogBreadClum";
import MemberProfileMain from "@/sections/MemberProfileMain";

export default function MemberProfile() {

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="MemberProfile"/> 
      </div>
      <div className="flex gap-4">
        <MemberProfileMain />
      </div>
    </div>
  );
}