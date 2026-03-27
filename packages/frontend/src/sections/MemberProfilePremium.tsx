import logo from "../../public/logo.svg";
import { useState, useEffect } from "react";
import axios from 'axios';

interface MemberProfilePremiumProps {
    userData: any;
}

const MemberProfilePremium = ({ userData }: MemberProfilePremiumProps) => {
    // 1. 상태 선언
    const membership_use = userData?.mes_id || "MES00001";

    // 3. 등급 계산 로직
    const planRanks: Record<string, number> = {
        "FREE": 0,
        "PREMIUM": 1,
        "VIP": 2
    };

    // 현재 사용중인 플랜 이름 찾기
    const currentPlan = { mes_id: "MES00001", mes_name: "FREE", mes_fee: 0 };
    const [membershipTemp, setMembershipTemp] = useState<any[]>([]);

    // 💡 [수정] DB 리스트(membershipTemp)에서 현재 내가 쓰고 있는 플랜 정보를 찾습니다.
    const myCurrentPlan = membershipTemp.find(m => m.MES_ID === membership_use) || {
        MES_NAME: "FREE",
        MES_FEE: 0
    };
    useEffect(() => {
        // 내부에서 async 함수를 선언해서 사용합니다.
        const loadData = async () => {            
                await axios.get('http://localhost:3001/api/get_all_memberships')
                    .then(response => { if (response.data.success) setMembershipTemp(response.data.data);
                        console.log(response.data.data);
                        
                     })
                    .catch(error => console.error("멤버십 데이터 로딩 실패!", error));
            };
        loadData();
    }, []); // 빈 배열이므로 컴포넌트가 처음 켜질 때 딱 한 번 실행


    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-[#333] mb-6">HomeFit 구독 서비스 관리</h1>
                <span className="self-start bg-[#fff9e6] text-[#ffa800] text-xs font-bold px-2 py-1 rounded-md border border-[#ffeebf]">
                    회원
                </span>
            </div>

            <div className="w-full border-2 border-[#f0f0f0] rounded-lg p-8 flex flex-col items-center justify-center">
                <img src={logo} width="100" height="100" alt="로고" className="shadow-sm mb-4" />
                <div className="w-full border-2 p-6 mt-6">
                    <p className="font-bold mb-4">{myCurrentPlan.MES_NAME} MemberShip 환영합니다</p>
                    <p>{userData?.nickname || "회원"}님, 지금 {myCurrentPlan.MES_NAME} 혜택으로 서비스를 이용 중입니다!</p>
                    <p className="mt-2 text-gray-600">
                        다음 달 결제 예정 금액은
                        <span className="font-bold text-blue-600 ml-1">
                            {Number(myCurrentPlan.MES_FEE).toLocaleString()}원
                        </span> 입니다.
                    </p>
                </div>
            </div>

            <div className="w-full flex flex-col items-center mt-8 border-2 border-[#f0f0f0] rounded-lg p-8">
                <div className="w-full max-w-4xl mb-6">
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest ml-1">Membership Plan</span>
                    <h3 className="text-2xl font-black italic text-gray-900">HOMEFIT PLUS+ </h3>
                </div>

                <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl mx-auto">
                    {membershipTemp
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
                                            <div className={`
                                                absolute -top-2 -right-2           
                                              text-white text-[11px] px-4 py-1.5 
                                                rounded-full font-black tracking-wider shadow-lg
                                                z-10 animate-bounce-short          
                                                ${isVip
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                }
    `                                       }>
                                                이용 중
                                            </div>
                                        )}
                                        <div className="flex justify-between items-baseline mb-6">
                                            <div className={`text-2xl font-black italic ${isVip ? 'text-purple-700' : 'text-gray-900'}`}>
                                                {item.name}
                                            </div>

                                            {/* 💰 오른쪽 끝에 배치될 가격 */}
                                            <div className="text-right">
                                                <p className={`text-xl font-bold ${isVip ? 'text-purple-600' : 'text-gray-800'}`}>
                                                    {Number(item.fee).toLocaleString()}
                                                </p>
                                                <span className="text-xs ml-1 text-gray-500 font-medium">원/월</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-4 text-gray-600">
                                            {item.funcs.map((func: any) => (
                                                <li key={func.func_id} className="flex items-center gap-3 font-medium text-sm">
                                                    <span className={isVip ? 'text-purple-500' : 'text-blue-500'}>✔️</span>
                                                    {func.func_name}
                                                </li>
                                            ))}
                                        </ul>

                                    </div>

                                    <div className="mt-8">
                                        {isCurrent ? (
                                            <button className="w-full py-3 rounded-xl font-bold bg-gray-200 text-gray-500 cursor-default">현재 혜택 유지 중</button>
                                        ) : (
                                            planRanks[item.name] > planRanks[myCurrentPlan.name] && (
                                                <>
                                                    <button
                                                        onClick={() => alert("준비중...")}
                                                        className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${isVip ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                                    >
                                                        업그레이드
                                                    </button>
                                                </>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default MemberProfilePremium;