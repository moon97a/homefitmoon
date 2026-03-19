import { da } from "date-fns/locale"


const MemberProfileMain = ({ data }: { data: string }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 1번 div 시작 */}
      <div className="h-2/5 border-2 rounded-lg">{data}</div>
      {/* 2번 div 시작 */}
      <div className="h-1/5 border-2 rounded-lg">section 2</div>
      {/* 3번 div 시작 */}
      <div className="h-2/5 border-2 rounded-lg">section 3</div>
    </div>
  )
}

export default MemberProfileMain
