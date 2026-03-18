import { useState } from "react";
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { ko } from 'date-fns/locale'  // 한국어 locale

const WdogCalendarRange = () => 
{
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(new Date().getFullYear(), 0, 12),
      to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
    })
  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          locale={ko}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </CardContent>
    </Card>
  )
};
export default WdogCalendarRange;