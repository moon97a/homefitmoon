import { Link } from "react-router-dom"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Button } from "../components/ui/button"
import { Trash2Icon } from "lucide-react"




const MemberProfileLeft = ({ onChildData }: { onChildData: (data: string) => void }) => {
   

    return (
        <div>
            <div id='footheader'>

            </div>
            <div id='footbody'></div>
            <div className="">
                <div className="flex flex-col gap-4 mb-6">
                    <div className="text-xl" onClick={() => onChildData("profile")}>프로필</div>
                    <div className="text-xl" onClick={() => onChildData("settings")}>설정</div>
                    <div className="text-xl" onClick={() => onChildData("help")}>도움말</div>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">회원 탈퇴</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                <Trash2Icon />
                            </AlertDialogMedia>
                            <AlertDialogTitle>정말 탈퇴 하실건가요? 😢</AlertDialogTitle>
                            <AlertDialogDescription>
                                탈퇴 시 지금까지 기록하신 모든 운동 데이터와 프로필 정보가 즉시 삭제되며, 삭제된 데이터는 다시 복구할 수 없습니다. 정말 탈퇴하시겠어요?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default MemberProfileLeft

