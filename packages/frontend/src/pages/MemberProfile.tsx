import WdogBreadClum from "@/components/WdogBreadClum";
import MemberProfileLeft from "@/sections/MemberProfileLeft";
import MemberProfileMain from "@/sections/MemberProfileMain";
import MemberProfilePremium from "@/sections/MemberProfilePremium";
import MemberProfileSetting from "@/sections/MemberProfileSetting";
import { useEffect, useState } from "react";



export default function MemberProfile() {

  const [part, setPart] = useState<string>("profile");
  const [userData, setUserData] = useState<any>(null);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loginId = localStorage.getItem('userId') || 'U000002';
        const response = await fetch(`http://localhost:3001/api/get_member?memberId=${loginId}`);
        const result = await response.json();

        if (result.success) {
          setUserData(result.data);
          console.log(result.data);
        }



      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchUserData();
  }, []);


  const handleChildData = (data: string) => { setPart(data); };

  const renderContent = () => {

    if (!userData) return <div className="p-10 text-center">프로필 데이터를 불러오는 중...</div>;

    switch (part) {
      case "profile":
        return <MemberProfileMain userData={userData} />;

      case "premium":
        return <MemberProfilePremium userData={userData} />;

      case "setting":
        return <MemberProfileSetting />;

      default:
        return <MemberProfileMain userData={userData} />;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 mb-6">
        <WdogBreadClum page="MemberProfile" />
      </div>
      <div className="flex gap-10">
        <div className="w-2/7">
          <MemberProfileLeft onChildData={handleChildData} userData={userData} />
        </div>
        <div className="w-5/7">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}