import { findShopByNameAndRegion, searchNearbyShops } from '@/lib/geocode';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { 
  Map, 
  MapMarker, 
  Circle, 
  MarkerClusterer,
  useKakaoLoader
} from 'react-kakao-maps-sdk';
import type { MapPosition } from 'shared';

interface WdogMapCircleProps {
  shopName: string;
  region: string;
  zoomLevel?: number;
  radius?: number;
}

const WdogMapCircle: React.FC<WdogMapCircleProps> = ({
  shopName,
  region,
  zoomLevel: initialZoomLevel = 4,
  radius: initialRadius = 0.5,
}) => {
  const [] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY!,
    libraries: ['services', 'clusterer', 'drawing']
  });
  
  const [mapKey, setMapKey] = useState(0);
  // 반경 
  const [currentRadius, setCurrentRadius] = useState(initialRadius);
  // zoomLevel
  const [currentZoomLevel, setCurrentZoomLevel] = useState(initialZoomLevel);
  // 상점 좌표 
  const [position, setPosition] = useState<MapPosition>({ lat: 37.5665, lng: 126.9780 });
  // 상정 주소 
  const [address, setAddress] = useState<string>('');
  // 상점 업종
  const [category, setCategory] = useState<string>('');
  // 반경 내 유사한 업종인 상점들
  const [nearbyShops, setNearbyShops] = useState<MapPosition[]>([]);
  const [showShops, setShowShops] = useState(false);

  // 반경별 zoomLevel 매핑
  const radiusZoomMap: Record<number, number> = {
    0.1: 2, 0.2: 3, 0.5: 4, 1: 5
  };

  const radiusOptions = [
    { value: 0.1, label: '100m' },
    { value: 0.2, label: '200m' },
    { value: 0.5, label: '500m' },
    { value: 1, label: '1km' }
  ];

  const updatePosition = useCallback(async (shopName: string, region?: string) => {
    try {
      const coords = await findShopByNameAndRegion(shopName, region || '');
      if (coords) {
        setPosition(coords.coords);
        setCategory(coords.category);
        setAddress(coords.fullAddress);
        setMapKey(prev => prev + 1);
        if (coords.coords.lat && coords.coords.lng && coords.category) {     
          updateNearbyShops(coords.coords.lat, coords.coords.lng, currentRadius * 1000, coords.category);
        }        
      }
    } catch (err) {
      console.log('주소 찾기 실패');
    }
  }, [shopName, region]);
  const updateNearbyShops = useCallback(async (lat: number, lng: number, radius: number, category: string) => {
    try {
      const shops = await searchNearbyShops(lat, lng, radius, category);
      setNearbyShops(shops);
      setMapKey(prev => prev + 1); // ✅ shops 바뀔 때마다 Map 리마운트      
    } catch (err) {
      console.log('상점 검색 실패');
    }
  }, []);    
  useEffect(() => {
    if (shopName && region) 
      updatePosition(shopName, region);
  }, [shopName, region, updatePosition]);

  const handleRadiusChange = (newRadius: number) => {
    const newZoom = radiusZoomMap[newRadius] || currentZoomLevel;
    setCurrentRadius(newRadius);
    setCurrentZoomLevel(newZoom);
    setMapKey(prev => prev + 1);
    updateNearbyShops(position.lat, position.lng, newRadius * 1000, category);
  };
  const handleNearbyShops = () => {
    if (position.lat && position.lng && category) {
      updateNearbyShops(position.lat, position.lng, currentRadius * 1000, category);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      {/* 상단: 지역  */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm font-semibold">
        <div className="text-primary">주소: {address}</div>
      </div>
      {/* 지도 */}
      <div className="w-full aspect-video relative">
        <Map 
          key={mapKey}
          center={position}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          level={currentZoomLevel}
        >
          <MapMarker position={position} />
          
          <Circle
            center={position}
            radius={currentRadius * 1000}
            strokeWeight={3}
            strokeColor="#009688"
            strokeOpacity={0.8}
            fillColor="#009688"
            fillOpacity={0.1}
          />
          
          {/* 반경 내 상점 마커 (클러스터링) */}
          {showShops && nearbyShops.length > 0 && (
            <MarkerClusterer averageCenter={true} minLevel={10}>
              {nearbyShops.map((shopPos, idx) => (
                <MapMarker
                  key={`shop-${idx}`}
                  position={shopPos}
                  image={{
                    src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM0RkI1RkYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
                    size: { width: 24, height: 24 },
                  }}
                />
              ))}
            </MarkerClusterer>
          )}
        </Map>
      </div>

      {/* 하단: 업종 + 업종검색 버튼 + 반경 선택 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm font-semibold">
        {category && (
          <div className="flex items-center gap-2">
            <span className="p-2 bg-secondary rounded-full text-xs">
              {category}
            </span>
            <Button
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                showShops 
                  ? 'bg-focus text-focus-foreground' 
                  : 'bg-secondary hover:bg-focus text-black'
              }`}
              onClick={() => {
                setShowShops(!showShops);
                if (!showShops) 
                  handleNearbyShops();
              }}
            >
              {showShops ? '동종업종 숨기기' : '동종업종 표시'} ({nearbyShops.length})
            </Button>
          </div>
        )}
        <div className="flex flex-wrap gap-1 bg-white p-2 rounded-lg border shadow-sm flex-1">
          {radiusOptions.map(({ value, label }) => (
            <Button
              key={value}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                currentRadius === value
                  ? 'bg-focus text-focus-foreground shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => handleRadiusChange(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WdogMapCircle;
