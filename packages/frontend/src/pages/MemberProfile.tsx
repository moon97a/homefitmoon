import WdogBreadClum from "@/components/WdogBreadClum";
import MemberProfileLeft from "@/sections/MemberProfileLeft";
import MemberProfileMain from "@/sections/MemberProfileMain";
import { useState } from "react";

export default function MemberProfile() {
  const [part, setPart] = useState<string>("profile");

  const handleChildData = (data: string) => {
    setPart(data);
  };



  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-4">
        <WdogBreadClum page="MemberProfile" />


      </div>
      <div className="flex gap-10">
        <div className="w-2/6">
          <MemberProfileLeft onChildData={handleChildData} />
        </div>
        <div className="w-4/6">
          <MemberProfileMain data={part} />
        </div>
      </div>
    </div>
  );
}