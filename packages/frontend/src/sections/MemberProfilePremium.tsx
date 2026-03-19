import React from 'react'
import logo from "../../public/logo.svg";

const MemberProfilePremium = () => {
  return (
<div className="flex flex-col w-full"> 
    {/* 1. 제목 (왼쪽 정렬 유지 혹은 text-center 추가 가능) */}
    <h1 className="text-2xl font-bold text-[#333] mb-6">HomeFit 구독 서비스 관리</h1>

    {/* 2. 멤버십 카드 (가로로 꽉 차는 박스) */}
    <div className="w-full border-2 border-[#f0f0f0] rounded-lg p-8 flex flex-col items-center justify-center">
        {/* 내부에서 flex-col items-center를 주어 이미지와 글자만 중앙 세로 정렬 */}
        <img 
            src={logo}
            width="100" 
            height="100" 
            alt="내 프로필 이미지" 
            className="shadow-sm mb-4" 
        />
        <div className="w-full border-2 p-6 mt-6">
            <p className="font-bold mb-4">Premium MemberShip 환영합니다</p>
            <p className=" text-gray-600">다음 결제 예정일은 00월 00일 입니다</p>
        </div>
    </div>

    {/* 3. 새로운 박스를 추가할 때마다 이 구조를 쓰면 자동으로 아래에 꽉 차게 쌓입니다 */}
    <div className="w-full border-2 border-[#f0f0f0] rounded-lg p-6 mt-6">
        <h2 className="font-bold mb-2">다음 결제 예정일</h2>
        <p className="text-gray-600">2000년 12월 12일</p>
    </div>

    <div className="w-full border-2 border-[#f0f0f0] rounded-lg p-6 mt-6">
        <h2 className="font-bold mb-2">결제 수단 관리</h2>
        <p className="text-gray-600">신한카드 (1234)</p>
    </div>
</div>
  )
}

export default MemberProfilePremium