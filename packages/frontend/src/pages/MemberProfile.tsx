import WdogBreadClum from "@/components/WdogBreadClum";
import MemberProfileLeft from "@/sections/MemberProfileLeft";
import MemberProfileMain from "@/sections/MemberProfileMain";
import MemberProfilePremium from "@/sections/MemberProfilePremium"; // 새로 만들 파일
import MemberProfileSetting from "@/sections/MemberProfileSetting"; // 새로 만들 파일
import { useState } from "react";

export default function MemberProfile() {
  const [part, setPart] = useState<string>("profile");

  const handleChildData = (data: string) => {
    setPart(data);
  };

  // 현재 탭(part)에 따라 보여줄 컴포넌트를 결정하는 함수
  const renderContent = () => {
    switch (part) {
      case "profile":
        return <MemberProfileMain data={part} />;
      case "premium":
        return <MemberProfilePremium />;
      case "setting":
        return <MemberProfileSetting />;
      default:
        return <MemberProfileMain data={part} />;
    }
  };

  return (
    <div className="profileArea p-8">
      <div className="flex gap-4 mb-6">
        <WdogBreadClum page="MemberProfile" />
      </div>
      
      <div className="flex gap-10">
        {/* 왼쪽 사이드바 (메뉴 선택) */}
        <div className="w-2/7">
          <MemberProfileLeft onChildData={handleChildData} />
        </div>
        
        {/* 오른쪽 메인 콘텐츠 (선택된 탭에 따라 변경) */}
        <div className="w-5/7">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}