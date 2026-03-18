import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart"
import { 
  Pie, 
  PieChart, 
  Cell,
} from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface WdogChartPieProps {
  chartData: Array<Record<string, any>>  
  chartConfig: ChartConfig 
  title ?: string,
  description ?: string,
  circle_detail ?: string,
  className?: string
}

const WdogChartPie = ({ 
  chartData, 
  chartConfig, 
  title = "",
  description = "", 
  circle_detail = "",
  className = "h-80 w-140 mt-4 aspect-square [&_.recharts-pie-label-text]:fill-foreground" 
}: WdogChartPieProps) => {
  // 동적 pieData 생성
  const pieData = Object.entries(chartData[0] || {}).map(([key, _]) => ({
    name: key,  // "desktop"
    value: chartData.reduce((sum, row) => sum + (row[key as keyof typeof row] || 0), 0),
  }))
  const total = pieData.reduce((sum, d) => sum + d.value, 0)

  return (
  <Card>
      <CardHeader className="flex items-center space-y-1.5">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className=" text-primary">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        <ChartContainer config={chartConfig} className={className}>
          <PieChart>
            <Pie data={pieData} 
              cx="50%" 
              cy="50%" 
              outerRadius={120} 
              innerRadius={70}  // 도넛 스타일          
              dataKey="value" 
              nameKey="name"
              label
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={(chartConfig as any)[entry.name]?.color || '#888'} 
                />
              ))}
            </Pie>
    {/* 중앙 텍스트 (투명 Pie) */}
            <Pie 
              data={[{ value: 100 }]}  // 더미 데이터
              cx="50%" 
              cy="50%" 
              outerRadius={65}  // innerRadius 안쪽
              dataKey="value"
              cornerRadius={0}
              stroke="none"
            >
              <Cell fill="transparent" />
            </Pie>
            
            {/* 중앙 텍스트 오버레이 */}
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="fill-foreground font-bold text-lg sm:text-xl lg:text-2xl"
              style={{ fontSize: 'clamp(18px, 4vw, 32px)' }}
            >
              {total.toLocaleString()}
            </text>
            <text 
              x="50%" 
              y="58%" 
              textAnchor="middle" 
              className="fill-muted-foreground text-xs sm:text-sm"
            >
            {circle_detail}
            </text>        
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />        
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>  
  )
}

export default WdogChartPie
