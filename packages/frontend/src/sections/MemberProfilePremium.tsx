import logo from "../../public/logo.svg";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

const MemberProfilePremium = () => {
    const membership = [{ "id": "MS00002", "name": "PREMIUM", "fee": 9900, "funcs": [{ "func_id": "MF00001", "func_name": "광고 제거" }, { "func_id": "MF00003", "func_name": "실시간자세교정" }, { "func_id": "MF00002", "func_name": "1대1식단관리" }] }, { "id": "MS00003", "name": "VIP", "fee": 13900, "funcs": [{ "func_id": "MF00001", "func_name": "광고 제거" }, { "func_id": "MF00004", "func_name": "오프라인매칭" }, { "func_id": "MF00003", "func_name": "실시간자세교정" }, { "func_id": "MF00002", "func_name": "1대1식단관리" }] }]
    const [membership_use, setMembership_use] = useState('MS00003'); // DB 매핑, 현재 fake data임
    
    const planRanks: Record<string, number> = {
        "PREMIUM": 1,
        "VIP": 2
    };

    const currentPlanName = membership.find(m => m.id === membership_use)?.name || "";

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-[#333] mb-6">HomeFit 구독 서비스 관리</h1>
                <span className="self-start bg-[#fff9e6] text-[#ffa800] text-xs font-bold px-2 py-1 rounded-md border border-[#ffeebf]">
                    회원
                </span>
            </div>

            <div className="w-full border-2 border-[#f0f0f0] rounded-lg p-8 flex flex-col items-center justify-center">
                <img
                    src={logo}
                    width="100"
                    height="100"
                    alt="내 프로필 이미지"
                    className="shadow-sm mb-4"
                />

                <div className="w-full border-2 p-6 mt-6">
                    <p className="font-bold mb-4">Premium MemberShip 환영합니다</p>
                    <p>지금 프리미엄 혜택으로 HomeFit의 모든 서비스를 자유롭게 이용중입니다!</p>
                    <p className="text-gray-600 mt-2">다음 결제 예정 금액: <span className="font-bold text-gray-800">₩9,900</span></p>
                </div>
            </div>

            <div className="w-full flex flex-col items-center mt-8 bor border-2 border-[#f0f0f0] rounded-lg p-8">
                <div className="w-full max-w-4xl mb-6">
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest ml-1">Premium Plan</span>
                    <h3 className="text-2xl font-black italic text-gray-900">HOMEFIT PLUS+ </h3>
                </div>

                <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl mx-auto">
                    {membership.map((item) => {
                        const isVip = item.name === "VIP";
                        return (
                            <div 
                                key={item.id} 
                                className={`flex-1 min-w-[320px] max-w-[420px] group relative border-2 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between ${
                                    isVip ? 'border-purple-100 bg-purple-50/10 hover:border-purple-300' : (item.name === "PREMIUM" ? 'border-blue-100 bg-blue-50/20' : 'border-gray-100 bg-white')
                                }`}
                            >
                                <div>
                                    {membership_use === item.id && 
                                        <div className={`absolute top-5 right-5 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-sm ${isVip ? 'bg-purple-600' : 'bg-blue-500'}`}>이용 중</div>
                                    }
                                    <div className={`text-2xl font-black mb-6 italic ${isVip ? 'text-purple-700' : 'text-gray-900'}`}>{item.name}</div>
                                    <ul className="space-y-4 text-gray-600">
                                        {item.funcs.map((func) => (
                                            <li key={func.func_id} className="flex items-center gap-3 font-medium text-sm">
                                                <span className={isVip ? 'text-purple-500' : 'text-blue-500'}>✅</span> {func.func_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="mt-8">
                                    {membership_use === item.id ? (
                                        <button className="w-full py-3 rounded-xl font-bold bg-gray-200 text-gray-500 cursor-default">
                                            현재 혜택 유지 중
                                        </button>
                                    ) : (
                                        planRanks[item.name] > planRanks[currentPlanName] && (
                                            <button 
                                                onClick={() => alert("준비중...")} // ✅ 알림창 기능 추가
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

            <div className="w-full border-2 border-[#f0f0f0] rounded-lg p-6 mt-6">
                <h2 className="font-bold mb-2">결제 수단 관리</h2>
                <p className="text-gray-500 text-sm"> 준비중 ... 
                    <span className="self-start bg-[#1a1f71] text-[#f7b600] text-[8px] font-black px-1.5 py-[2px] rounded border border-[#f7b600] italic tracking-tighter leading-none ml-2">
                        VISA
                    </span>
                </p>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button className="text-[11px] text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors cursor-pointer mt-4 self-end">
                        구독 해지
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon size={20} />
                        </AlertDialogMedia>
                        <AlertDialogTitle>프리미엄 해지</AlertDialogTitle>
                        <AlertDialogDescription>
                            프리미엄 서비스를 해지하시겠습니까? <br />
                            남은 기간 동안 프리미엄 혜택을 계속 이용하실 수 있습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">취소</AlertDialogCancel>
                        <AlertDialogAction variant="destructive">해지</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default MemberProfilePremium

//                          <<<나중에 DB연결시 구현!>>>
// 업그레이드 버튼을 클릭했을 때 DB의 등급을 실제로 업데이트하는 handleUpgrade 함수
/* // 💡 [나중에 구현할 업그레이드 처리 함수]
// 이 함수는 '업그레이드' 버튼의 onClick 에 연결하면 됩니다.
const handleUpgrade = async (newMembershipId: string, planName: string) => {
    // 1. 사용자 확인 (선택 사항)
    const isConfirm = window.confirm(`${planName}으로 업그레이드 하시겠습니까? 결제가 진행됩니다.`);
    if (!isConfirm) return;

    try {
        // 2. 서버 API 호출 (예시)
        const response = await fetch('/api/user/membership/upgrade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${userToken}` // 토큰이 필요한 경우
            },
            body: JSON.stringify({ 
                membership_id: newMembershipId,
                // payment_method_id: 'SHINHAN_1234' // 결제 수단 정보 등
            })
        });

        const data = await response.json();

        // 3. 성공 시 처리 (예시로 바로 상태 변경)
        if (true) { // 나중에는 response.ok 같은 조건으로 변경
            setMembership_use(newMembershipId);
            alert(`${planName}으로 업그레이드되었습니다! 다시 로그인하거나 페이지를 새로고침하면 혜택이 적용됩니다.`);
        }
    } catch (error) {
        console.error("업그레이드 중 오류 발생:", error);
        alert("업그레이드 처리 중 문제가 발생했습니다. 고객센터에 문의해주세요.");
    }
};
 */