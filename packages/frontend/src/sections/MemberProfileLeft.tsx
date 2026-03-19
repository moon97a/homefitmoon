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
        <div className="flex flex-col gap-10 p-6 h-screen border-x rounded-lg">
            <div id='footheader' className="flex flex-col justify-center items-center py-8 gap-3">
                {/* 1. flex-col(세로정렬)과 gap-3(이미지와 글자 사이 간격) 추가 */}

                <img
                    src="https://static.nid.naver.com/images/web/user/default.png"
                    width="100"
                    height="100"
                    alt="내 프로필 이미지"
                    className="rounded-full"
                />

                {/* 2. 이미지 바로 아래에 닉네임 추가 */}
                <span className="font-bold text-lg text-[#333]">닉네임</span>
                <div id='footbody'></div>
                <div className="flex flex-col flex-1">
                    <div className="flex flex-col gap-6 mb-6"> {/* gap을 키워 메뉴 간 간격을 넓혔습니다 */}

                        {/* ---- 프로필 시작 ---- */}
                        <div
                            className="group flex items-center gap-3 text-xl cursor-pointer transition-all duration-300"
                            onClick={() => onChildData("profile")}
                        >
                            {/* 아이콘: group-hover 시 회전 효과 */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-user transition-transform duration-500 group-hover:rotate-360">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            {/* 글자: group-hover 시 굵기 및 색상 변경 */}
                            <span className="transition-all duration-300 group-hover:font-bold group-hover:text-[primary]">프로필</span>
                        </div>

                        {/* ---- Premium 관리 시작 ---- */}
                        <div
                            className="group flex items-center gap-3 text-xl cursor-pointer transition-all duration-300"
                            onClick={() => onChildData("premium")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-circle-dollar-sign transition-transform duration-500 group-hover:rotate-360">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                <path d="M12 18V6" />
                            </svg>
                            <span className="transition-all duration-300 group-hover:font-bold group-hover:text-[primary]">Premium 관리</span>
                        </div>

                        {/* ---- 설정 시작 ---- */}
                        <div
                            className="group flex items-center gap-3 text-xl cursor-pointer transition-all duration-300"
                            onClick={() => onChildData("setting")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-settings transition-transform duration-700 group-hover:rotate-360">
                                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span className="transition-all duration-300 group-hover:font-bold group-hover:text-[primary]">설정</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 회원 탈퇴 기능 */}
            <div className="mt-auto flex justify-end ">
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

