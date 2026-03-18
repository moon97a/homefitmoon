import WdogBreadClum from "@/components/WdogBreadClum";
import WdogInputDateTerm from "@/components/WdogInputDateTerm";

export default function HistoryContent() {
  return (
        
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="HistoryContent"/> 
      </div>
      <div className="flex gap-4 border p-1 rounded-lg bg-condition border-primary">
        <WdogInputDateTerm title="운동기간"/>
      </div>        
    </div>
  );
}