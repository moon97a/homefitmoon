/*=======================================================================================================
  메뉴
=======================================================================================================*/
export interface NavSubItem {
  id: string,
  title: string;
  href: string,  
  description: string;
}
export interface NavItem {
  id: string,
  title: string;
  img: string;
  description: string;
  sub_menus: NavSubItem[];
}
/*=======================================================================================================
  테이블 관련 
=======================================================================================================*/
export interface ColDesc {
  id: string;
  title: string;
  type: string;
  width?: number;
  summary?: string;
  aggregate?: number;
}
/*=======================================================================================================
  회원정보
=======================================================================================================*/
export interface Member {
    id: string;
    name: string;
    img: string;
    sex: string;
    age: number;
    point: number;
    exp_point: number;   //
    lvl: number;         //
    membership : string;
    membership_name: string;
}
/*=======================================================================================================
  홈 트레이닝 관련
=======================================================================================================*/
export interface WorkoutRecord {
  id: string;
  workout_id: string;
  wo_dt: Date;
  title: string;
  title_color: string;
  target_reps: number;
  target_sets: number;
  count_p: number;
  count: number;
  count_s: number;
  point: number;
  description?: string;
}
export interface WorkoutHistory {
  wo_dt: string;
  status: string;
}
export interface WorkoutDetail {
  title: string;
  guide: string;
  img: string;
  target_reps: number;
  target_sets: number;
}

/*=======================================================================================================
  메뉴 관련
=======================================================================================================*/
export interface MenuPosSibling {
  id: string,
  title: string;
  href: string;
}
export interface MenuPos {
  id: string;
  parent_title: string;
  title: string;
  siblings: MenuPosSibling[];
}
export interface ChartData {
  columns: Record<string, any>;
  data: Record<string, any>;
}
/*=======================================================================================================
  우편번호 
=======================================================================================================*/
export interface Postcode {
  postcode: string;
  address: string;
  roadAddress: string;
}
/*=======================================================================================================
  카카오지도  
=======================================================================================================*/
export interface MapPosition {
  lat: number;
  lng: number;
}
export interface BusinessTypeResult {
  name: string;
  fullCategory: string;        // 전체: "음식점 > 한식 > 김밥"
  leafCategory: string;        // 최종 말단: "김밥"
  mainCategory: string;        // 메인: "음식점"
  subCategory: string;         // 중분류: "한식"
}
export interface ShopLocation {
  name: string;
  fullAddress: string;
  coords: { lat: number; lng: number };
  category: string;
  matchScore: number; // 일치도 점수 (0-100)
}
