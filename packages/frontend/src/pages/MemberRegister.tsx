import WdogBreadClum from "@/components/WdogBreadClum";
import MemberRegisterForm from "@/sections/MemberRegisterForm";

export default function MemberRegister() {

  return (
    <div className="flex flex-col gap-3">
      <div>
        <WdogBreadClum page="MemberRegister"/> 
      </div>
      <div>
        <MemberRegisterForm member={null} />
      </div>
    </div>
  );
}