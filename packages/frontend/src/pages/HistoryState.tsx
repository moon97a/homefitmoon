import { useCallback, useEffect, useState } from "react";
import { createWorkoutChartConfig,createWorkoutChartConfigWithPlan } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { ChartConfig } from "@/components/ui/chart";
import type { WorkoutRecord, ColDesc } from 'shared';

import WdogTable from "@/components/WdogTable";
import WdogChartBar from "@/components/WdogChartBar";
import WdogChartBarStackedWithLegend from "@/components/WdogChartBarStackedWithLegend";
import WdogChartPie from "@/components/WdogChartPie";
import WdogBreadClum from "@/components/WdogBreadClum";
import WdogInputDateTermState from "@/components/WdogInputDateTermState";
import { format, addDays, startOfMonth, endOfMonth } from "date-fns";
import { type DateRange } from 'react-day-picker';

export default function HistoryState() {  
  //================================================================================================================
  // 기준 데이터
  //================================================================================================================
  // 색상 정보 (차트 및 테이블에서 일관되게 사용)
  const colors: string[] = ['bg-table-1', 'bg-table-2', 'bg-table-3', 'bg-table-4', 'bg-table-5'];
  const today = new Date();

  //================================================================================================================
  // 테이블 컬럼 정보 가져오기
  //================================================================================================================
  const [columnsRecord, setColumnsRecord] = useState<ColDesc[]>([]);
  const [columnsAchievement, setColumnsAchievement] = useState<ColDesc[]>([]);
  useEffect(() => {
    // 일별 상세 테이블 
    fetch('http://localhost:3001/api/get_col_descs?table=WorkoutRecord')
      .then(res => res.json())
      .then(data => {
        setColumnsRecord(data.data);  
      });
    // 일별 성취 테이블
    fetch('http://localhost:3001/api/get_col_descs?table=WorkoutAchievement')
      .then(res => res.json())
      .then(data => {
        setColumnsAchievement(data.data);  
      });      
  }, []);

  //================================================================================================================
  // 일별 데이터
  //================================================================================================================
  // 날짜 범위 상태 (초기값: 오늘 기준 7일전부터 오늘까지)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(today, -7), // 7일전
    to: today,  
  });  
  // 운동 기록 데이터 가져오기
  const [records, setRecords] = useState<WorkoutRecord[]>([]);  
  // 차트 데이터 및 설정 가져오기
  const [chartConfigRecord, setChartConfigRecord] = useState<ChartConfig>({});
  const [chartDataRecord, setChartDataRecord] = useState<any[]>([]);
  const [chartConfigAchievement, setChartConfigAchievement] = useState<ChartConfig>({});
  const [chartDataAchievement, setChartDataAchievement] = useState<any[]>([]);
  const [dateDescription, setDateDescription] = useState<string>(`${format(dateRange.from!, 'yyyy-MM-dd')} ~ ${format(dateRange.to!, 'yyyy-MM-dd')}`);
  const handleDateChange = useCallback((dateRange: DateRange) => {
    setDateRange(dateRange);
    setDateDescription(`${format(dateRange.from!, 'yyyy-MM-dd')} ~ ${format(dateRange.to!, 'yyyy-MM-dd')}`);
  }, [])
  useEffect(() => {
    // 그리드 데이터 
    fetch(`http://localhost:3001/api/get_workout_records?memberId=U000001&from=${format(dateRange.from!, 'yyyy-MM-dd')}&to=${format(dateRange.to!, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        setRecords(data.data);  
    });    
    // 차트 데이터 
    fetch(`http://localhost:3001/api/get_workout_pivot?memberId=U000001&from=${format(dateRange.from!, 'yyyy-MM-dd')}&to=${format(dateRange.to!, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        setChartDataRecord(data.data);
        const config = createWorkoutChartConfig(data.columns, colors); 
        setChartConfigRecord(config);

      });
    // 차트 데이터 (성취 : 계획 대비 실적)  
    fetch(`http://localhost:3001/api/get_workout_pivot_with_plan?memberId=U000001&from=${format(dateRange.from!, 'yyyy-MM-dd')}&to=${format(dateRange.to!, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        setChartDataAchievement(data.data);
        const config = createWorkoutChartConfigWithPlan(data.columns, colors); 
        setChartConfigAchievement(config);
      });      
  }, [dateRange]);    
  //================================================================================================================
  // 월별 데이터
  //================================================================================================================
  // 날짜 범위 상태 (초기값: 오늘 기준 -7일부터 +7일까지)
  const [dateRangeMonthly, setDateRangeMonthly] = useState<DateRange>({
    from: startOfMonth(today),
    to: endOfMonth(today),  // 이번 달의 마지막 날
  });  
  // 운동 기록 데이터 가져오기
  const [recordsMonthly, setRecordsMonthly] = useState<WorkoutRecord[]>([]);  
  // 차트 데이터 및 설정 가져오기
  const [chartDataRecordMonthly, setChartDataRecordMonthly] = useState<any[]>([]);
  const [dateDescriptionMonthly, setDateDescriptionMonthly] = useState<string>(`${format(dateRangeMonthly.from!, 'yyyy-MM-dd')} ~ ${format(dateRangeMonthly.to!, 'yyyy-MM-dd')}`);
  const handleDateChangeMonthly = useCallback((dateRange: DateRange) => {
    setDateRangeMonthly(dateRange);
    setDateDescriptionMonthly(`${format(dateRange.from!, 'yyyy-MM-dd')} ~ ${format(dateRange.to!, 'yyyy-MM-dd')}`);
  }, [])
  useEffect(() => {
    // 그리드 데이터 
    fetch(`http://localhost:3001/api/get_workout_records?memberId=U000001&from=${format(dateRangeMonthly.from!, 'yyyy-MM-dd')}&to=${format(dateRangeMonthly.to!, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        setRecordsMonthly(data.data); 
        console.log(data.data); 
    });    
    // 차트 데이터 
    fetch(`http://localhost:3001/api/get_workout_pivot?memberId=U000001&from=${format(dateRangeMonthly.from!, 'yyyy-MM-dd')}&to=${format(dateRangeMonthly.to!, 'yyyy-MM-dd')}`)
      .then(res => res.json())
      .then(data => {
        const mothlyData = data.data.map((item: any) => {
          const { wo_dt, ...rest } = item;  // wo_dt 제외하고 나머지 복사
          return rest;
        });
        setChartDataRecordMonthly(mothlyData);
      });
  }, [dateRangeMonthly]);   
  //================================================================================================================
  // 탭 이벤트 
  //================================================================================================================
  const [curTab, setCurrentTab] = useState<string>("record");    
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <WdogBreadClum page="HistoryState"/> 
      </div>
      <div className="flex gap-5 border p-1 rounded-lg bg-condition border-primary">
         {curTab !== 'monthly' && (
          <WdogInputDateTermState title="운동기간(일)" from_dt={dateRange.from} to_dt={dateRange.to} onDateChange={handleDateChange}/>
         )}
        {curTab === 'monthly' && (
          <WdogInputDateTermState title="운동기간(월)" from_dt={dateRangeMonthly.from} to_dt={dateRangeMonthly.to} onDateChange={handleDateChangeMonthly} />
        )}
      </div>      
      <div>
        <Tabs defaultValue="record" className="w-full" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="record">일별 상세</TabsTrigger>
            <TabsTrigger value="achievement">일별 성취</TabsTrigger>
            <TabsTrigger value="monthly">월별 운동내역</TabsTrigger>            
          </TabsList>
          <TabsContent value="record">  
            <div className="flex gap-4">
              <div className="w-1/2 border rounded-lg p-4 mb-4">
                <WdogTable columns={columnsRecord} records={records} caption="일별 상세" colors={colors}/>
              </div>
              <div className="w-1/2 border rounded-lg p-4 mb-4 ">
                <WdogChartBar 
                  chartData={chartDataRecord} 
                  chartConfig={chartConfigRecord}
                  xAxisKey="wo_dt"
                  title="일별 운동 추이"
                  description={`${dateDescription} : 단위 횟수`}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="achievement">
            <div className="flex gap-4">            
              <div className="w-1/2 border rounded-lg p-4 mb-4">
                <WdogTable columns={columnsAchievement} records={records} caption="일별 성취" colors={colors}/>
              </div>        
              <div className="w-1/2 border rounded-lg p-4 mb-4">
                <WdogChartBarStackedWithLegend 
                  chartData={chartDataAchievement} 
                  chartConfig={chartConfigAchievement}
                  xAxisKey="wo_dt"
                  title="일별 운동 성취"
                  description={`${dateDescription} : 단위 횟수`}
                />
              </div>
            </div>              
          </TabsContent>
          <TabsContent value="monthly">
            <div className="flex gap-4">            
              <div className="w-1/2 border rounded-lg p-4 mb-4">
                <WdogChartPie 
                  chartData={chartDataRecordMonthly} 
                  chartConfig={chartConfigRecord}
                  title="월별 운동 집계"
                  description={`${dateDescriptionMonthly} : 단위 횟수`}
                  circle_detail="총 운동횟수"            
                />                
              </div>        
              <div className="w-1/2 border rounded-lg p-4 mb-4">
                <WdogTable columns={columnsRecord} records={recordsMonthly} caption="월별 상세" colors={colors}/>
              </div>
            </div>              
          </TabsContent>          
        </Tabs>        
      </div>
    </div>
  );
}

