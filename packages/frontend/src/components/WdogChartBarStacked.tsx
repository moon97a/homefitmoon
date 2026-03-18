import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface WdogChartBarStackedProps {
  chartData: Array<Record<string, any>>  // 완전 가변 데이터
  chartConfig: ChartConfig
  xAxisKey: string,  
  title ?: string,
  description ?: string,
  className?: string
}

const WdogChartBarStacked = ({ 
  chartData, 
  chartConfig, 
  xAxisKey = "x_title",
  title = "",
  description = "",
  className = "h-80 w-full mt-4"
}: WdogChartBarStackedProps) => {
const legendKeys = Object.keys(chartConfig) as (keyof ChartConfig)[]
  return (
     <Card className="p-4">
      <CardHeader className="flex items-center space-y-1.5">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className=" text-primary">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">         
        <ChartContainer config={chartConfig} className={className}>
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent />} />            
            <ChartLegend content={<ChartLegendContent />} />          
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
            {/* Stacked Bar: stackId 동일하게 */}
            {legendKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="workout"
                fill={chartConfig[key].color}
                radius={index === 0 ? [4, 4, 0, 0] : index === legendKeys.length - 1 ? [0, 0, 4, 4] : undefined}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default WdogChartBarStacked;