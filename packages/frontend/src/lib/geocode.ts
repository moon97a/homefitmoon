import type { BusinessTypeResult, MapPosition, ShopLocation } from "shared";

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY!;

// 주소로부터 좌표를 가져오는 함수
export const getCoordsFromAddress = async (address: string) => {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`
    }
  });
  
  const data = await response.json();
  if (data.documents.length > 0) {
    return {
      lat: parseFloat(data.documents[0].y),
      lng: parseFloat(data.documents[0].x),
      fullAddress: data.documents[0].address_name
    };
  }
  throw new Error('주소 검색 실패');
};

// 상점 이름으로부터 업종을 가져오는 함수
export const getBusinessType = async (shopName: string): Promise<BusinessTypeResult> => {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(shopName)}`;
  
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` }
  });

  if (!response.ok) throw new Error('Kakao API 오류');

  const data = await response.json();
  
  if (data.documents?.[0]) {
    const doc = data.documents[0];
    const categoryParts = doc.category_name.split(' > ').filter(Boolean);
    
    return {
      name: doc.place_name,
      fullCategory: doc.category_name,
      leafCategory: categoryParts[categoryParts.length - 1], // 최종 말단
      mainCategory: categoryParts[0] || '기타', // 대분류  
      subCategory: categoryParts[1] || '기타' // 중분류  
    };
  }
  
  throw new Error('상점을 찾을 수 없습니다.');
}

// 유사한 업종을 찾아주는 함수 자기 자신은 제외 
export const searchNearbyShops = async (
  inputLat: number, 
  inputLng: number, 
  radius: number, 
  category: string
): Promise<MapPosition[]> => {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?` +
    `x=${inputLng}&y=${inputLat}&radius=${radius}&` +
    `query=${encodeURIComponent(category)}&sort=distance&size=15`;
  
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY!}` }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kakao API 오류: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.documents || data.documents.length === 0) {
    return [];
  }

  // 입력한 **정확한 lat/lng 좌표와 일치하는 결과만 제외**
  const filteredShops = data.documents
    .filter((doc: any) => {
      const shopLat = parseFloat(doc.y);
      const shopLng = parseFloat(doc.x);
      
      // **정확히 같은 좌표만 제외** (부동소수점 오차 고려)
      const latMatch = Math.abs(shopLat - inputLat) < 0.000001;  // ~0.1m
      const lngMatch = Math.abs(shopLng - inputLng) < 0.000001;  // ~0.1m
      
      return !(latMatch && lngMatch);
    })
    .map((doc: any) => ({
      lat: parseFloat(doc.y),
      lng: parseFloat(doc.x)
    }));
  return filteredShops;
};

export const findShopByNameAndRegion = async (
  shopName: string,
  region: string
): Promise<ShopLocation | null> => {
  // 1. 지역 + 상점명으로 검색
  const query = `${region} ${shopName}`.trim();
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?` +
    `query=${encodeURIComponent(query)}&` +
    `sort=accuracy&size=10`;
  
  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY!}` }
  });
  
  const data = await response.json();
  
  // 2. 상점명 포함도 + 카테고리 일치도로 정렬
  const candidates = data.documents
    ?.map((doc: any) => {
      const nameMatch = doc.place_name.includes(shopName) ? 100 : 50;
      const regionMatch = doc.address_name.includes(region) ? 30 : 0;
      return {
        name: doc.place_name,
        fullAddress: doc.address_name,
        coords: { lat: parseFloat(doc.y), lng: parseFloat(doc.x) },
        category: doc.category_name.split(' > ')[1] || doc.category_name,
        matchScore: nameMatch + regionMatch
      };
    })
    .sort((a: any, b: any) => b.matchScore - a.matchScore) || [];
  
  return candidates[0] || null;
};
