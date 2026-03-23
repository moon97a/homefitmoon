import logo from "../../public/logo.svg";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { useState, useEffect } from "react";

interface MemberProfilePremiumProps {
    userData: any;
}

const MemberProfilePremium = ({ userData }: MemberProfilePremiumProps) => {
    // 1. 상태 선언
    const [membershipList, setMembershipList] = useState<any[]>([]);
    const [membership_use, setMembership_use] = useState(userData?.membership || "MS00001");

    // 2. DB에서 멤버십 리스트 가져오기
    useEffect(() => {
        fetch('http://localhost:3001/api/get_all_memberships')
            .then(res => res.json())
            .then(result => {
                if (result.success) setMembershipList(result.data);
            });
    }, [userData?.membership]);

    // 3. 등급 계산 로직
    const planRanks: Record<string, number> = {
        "FREE": 0,
        "PREMIUM": 1,
        "VIP": 2
    };

    // 현재 사용중인 플랜 이름 찾기
    const currentPlan = membershipList.find((m: any) => m.id === membership_use);
    const currentPlanName = currentPlan?.name || "FREE";

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-[#333] mb-6">HomeFit 구독 서비스 관리</h1>
                <span className="self-start bg-[#fff9e6] text-[#ffa800] text-xs font-bold px-2 py-1 rounded-md border border-[#ffeebf]">
                    {userData?.nickname || "회원"}
                </span>
            </div>

            <div className="w-full border-2 border-[#f0f0f0] rounded-lg p-8 flex flex-col items-center justify-center">
                <img src={logo} width="100" height="100" alt="로고" className="shadow-sm mb-4" />
                <div className="w-full border-2 p-6 mt-6">
                    <p className="font-bold mb-4">{currentPlanName} MemberShip 환영합니다</p>
                    <p>{userData?.nickname || "회원"}님, 지금 {currentPlanName} 혜택으로 서비스를 이용 중입니다!</p>
                </div>
            </div>

            <div className="w-full flex flex-col items-center mt-8 border-2 border-[#f0f0f0] rounded-lg p-8">
                <div className="w-full max-w-4xl mb-6">
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest ml-1">Membership Plan</span>
                    <h3 className="text-2xl font-black italic text-gray-900">HOMEFIT PLUS+ </h3>
                </div>

                <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl mx-auto">
                    {membershipList
                        .filter((item: any) => item.name !== "FREE")
                        .map((item: any) => {
                            const isVip = item.name === "VIP";
                            const isCurrent = membership_use === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className={`flex-1 min-w-[320px] max-w-[420px] group relative border-2 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between ${isVip ? 'border-purple-100 bg-purple-50/10 hover:border-purple-300' : (item.name === "PREMIUM" ? 'border-blue-100 bg-blue-50/20' : 'border-gray-100 bg-white')
                                        }`}
                                >
                                    <div>
                                        {isCurrent && (
                                            <div className={`absolute top-5 right-5 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm ${isVip ? 'bg-purple-600' : 'bg-blue-500'}`}>이용 중</div>
                                        )}
                                        <div className={`text-2xl font-black mb-6 italic ${isVip ? 'text-purple-700' : 'text-gray-900'}`}>{item.name}</div>
                                        <ul className="space-y-4 text-gray-600">
                                            {item.funcs.map((func: any) => (
                                                <li key={func.func_id} className="flex items-center gap-3 font-medium text-sm">
                                                    <span className={isVip ? 'text-purple-500' : 'text-blue-500'}>✅</span> {func.func_name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-8">
                                        {isCurrent ? (
                                            <button className="w-full py-3 rounded-xl font-bold bg-gray-200 text-gray-500 cursor-default">현재 혜택 유지 중</button>
                                        ) : (
                                            planRanks[item.name] > planRanks[currentPlanName] && (
                                                <button
                                                    onClick={() => alert("준비중...")}
                                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${isVip ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                                >
                                                    업그레이드
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* 결제 수단 및 해지 로직 생략 (기본 구조 유지됨) */}
        </div>
    );
};

export default MemberProfilePremium;