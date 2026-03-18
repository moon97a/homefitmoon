import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface WdogChartLineProps {
  chartData: Array<Record<string, any>>  // 완전 가변 데이터
  chartConfig: ChartConfig
  xAxisKey: string,  
  title?: string,
  description?: string,
  className?: string
}

const WdogChartLine = ({ 
  chartData, 
  chartConfig, 
  xAxisKey = "x_title",
  title = "",
  description = "",
  className = "h-80 w-full mt-4"
}: WdogChartLineProps) => {
  // chartConfig 키들로 동적 Line 생성 (가변 Legend)
  const legendKeys = Object.keys(chartConfig) as (keyof ChartConfig)[]

  return (
    <Card>     
      <CardHeader className="flex items-center space-y-1.5">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-primary">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">   
        <ChartContainer config={chartConfig} className={className}>
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={true}
              axisLine={true}
              tickMargin={10}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickLine={true}
              axisLine={true}
              tickMargin={10}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            
            {/* 가변 Line: chartConfig 키만큼 자동 생성 */}
            {legendKeys.map((key) => (
              <Line 
                key={key} 
                dataKey={key} 
                type="monotone"  
                strokeWidth={3}
                stroke={chartConfig[key].color}
                dot={{ fill: chartConfig[key].color, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>   
  )
}

export default WdogChartLine
