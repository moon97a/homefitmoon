import { findShopByNameAndRegion } from '@/lib/geocode';
import React, { useEffect, useState, useCallback } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { MapPosition } from 'shared';

interface WdogMapProps {
  shopName: string;
  region: string;
  zoomLevel?: number;
  radius?: number;
}

const WdogMap: React.FC<WdogMapProps> = ({
  shopName,
  region,
  zoomLevel: initialZoomLevel = 4
}) => {
  const [] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY!,
    libraries: ['services', 'clusterer', 'drawing']
  });
  
  const [mapKey, setMapKey] = useState(0);
  // 상점 좌표 
  const [position, setPosition] = useState<MapPosition>({ lat: 37.5665, lng: 126.9780 });
  // 상정 주소 
  const [address, setAddress] = useState<string>('');

  const updatePosition = useCallback(async (shopName: string, region?: string) => {
    try {
      const coords = await findShopByNameAndRegion(shopName, region || '');
      if (coords) {
        setPosition(coords.coords);
        setAddress(coords.fullAddress);
        setMapKey(prev => prev + 1);
      }
    } catch (err) {
      console.log('주소 찾기 실패');
    }
  }, [shopName, region]);
  useEffect(() => {
    if (shopName && region) 
      updatePosition(shopName, region);
  }, [shopName, region, updatePosition]);

  return (
    <div className="flex flex-col gap-2">
      {/* 상단: 지역  */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm font-semibold">
        <div className="text-primary">주소: {address}</div>
      </div>
      {/* 지도 */}
      <div className="w-full aspect-video relative"> {/* 부모 컨테이너에 aspect-ratio 적용 */}
        <Map 
          key={mapKey}
          center={position}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          level={initialZoomLevel}
        >
          <MapMarker position={position} />
        </Map>
      </div>
    </div>
  );
};

export default WdogMap;
