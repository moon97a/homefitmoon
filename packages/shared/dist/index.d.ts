export interface NavSubItem {
    id: string;
    title: string;
    href: string;
    description: string;
}
export interface NavItem {
    id: string;
    title: string;
    img: string;
    description: string;
    sub_menus: NavSubItem[];
}
export interface ColDesc {
    id: string;
    title: string;
    type: string;
    width?: number;
    summary?: string;
    aggregate?: number;
}
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
export interface MenuPosSibling {
    id: string;
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
export interface Postcode {
    postcode: string;
    address: string;
    roadAddress: string;
}
export interface MapPosition {
    lat: number;
    lng: number;
}
export interface BusinessTypeResult {
    name: string;
    fullCategory: string;
    leafCategory: string;
    mainCategory: string;
    subCategory: string;
}
export interface ShopLocation {
    name: string;
    fullAddress: string;
    coords: {
        lat: number;
        lng: number;
    };
    category: string;
    matchScore: number;
}
