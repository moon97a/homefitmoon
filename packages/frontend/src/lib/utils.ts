import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ChartConfig } from "@/components/ui/chart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const lang = navigator.language || 'ko-KR';
let currency = 'KRW';

const currencyFormatter = new Intl.NumberFormat(lang, {
  currency: currency,
  style: 'currency',
  currencyDisplay: 'narrowSymbol'  // $만 표시
});
const numberFormatter = new Intl.NumberFormat(lang, {
  style: 'decimal'
});
let dateFormatter = new Intl.DateTimeFormat(lang);
switch (currency) {
  case 'USD':
    dateFormatter = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    break;
  default:
    dateFormatter = new Intl.DateTimeFormat('sv');
    break;
}
const timeFormatter = new Intl.DateTimeFormat(lang, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

export const formatCurrency = (value: number) => 
  currencyFormatter.format(value)

export const formatNumber = (value: number) => 
  numberFormatter.format(value) 

export const formatPrice = (value: number) => 
  currencyFormatter.format(value)

export const formatDate = (value: Date | number | string) => {
  const dateValue = new Date(value);
  return dateFormatter.format(dateValue);
};

export const formatTime = (value: Date | number | string) => {
  const dateValue = new Date(value);
  return timeFormatter.format(dateValue);
};  

export const createWorkoutChartConfig = (columns: Array<{id: string, name: string}>, colors: string[]): ChartConfig => {
  return columns.reduce((config, col, index) => {
    config[col.id] = {
      label: col.name,
      color: colors ? `var(${colors[index % colors.length].replace('bg', '-')})` : `var(--chart-${(index % 5) + 1})`
    };
    return config;
  }, {} as ChartConfig);
};
export const createWorkoutChartConfigWithPlan = (
  columns: Array<{id: string, name: string}>, 
  colors: string[]
): ChartConfig => {
  return columns.reduce((config, col, index) => {
    const baseColor = colors?.[index % colors.length] || `--chart-${(index % 5) + 1}`;
    // 실제값
    config[col.id] = {
      label: col.name,
      color: `var(${baseColor.replace('bg', '-')})`
    };
    
    // 계획값 (_P)
    config[col.id + '_P'] = {
      //label: `${col.name}(잔여횟수)`,
      label: `잔여횟수`,
      //color: `var(${baseColor.replace('bg-table', '--warning')})`
      color: `var(--unreached)`
    };
    
    return config;
  }, {} as ChartConfig);
};


export type ChartIconMap = Record<string, React.ComponentType<{ className?: string }>>;

export const addIconsToConfig = (
  config: ChartConfig, 
  iconMap: ChartIconMap
): ChartConfig => {
  return Object.fromEntries(
    Object.entries(config).map(([key, value]) => [
      key,
      {
        ...value,
        icon: iconMap[key] || iconMap.default
      } 
    ])
  ) as ChartConfig;  // 타입 단언 최소화
};
