import { useState } from 'react';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { format, parse, startOfMonth, endOfMonth, addDays, addMonths } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WdogInputDateTermProps {
  title?: string;
  from_dt?: Date;
  to_dt?: Date;
}

const today = new Date();

const WdogInputDateTerm = ({
  title = '기간',
  from_dt = startOfMonth(today),
  to_dt = endOfMonth(today),
}: WdogInputDateTermProps) => {
  const id = crypto.randomUUID();

  // 최종 확정된 값
  const [date, setDate] = useState<DateRange>({
    from: from_dt,
    to: to_dt,
  });

  // 팝업 내 임시 선택 값 (초기에는 확정값과 동일하게)
  const [tempDate, setTempDate] = useState<DateRange>({
    from: from_dt,
    to: to_dt,
  });

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    `${format(from_dt, 'yyyy-MM-dd')} ~ ${format(to_dt, 'yyyy-MM-dd')}`,
  );

  // 최종 기간 표시
  const rangeDisplay =
    date?.from && date?.to
      ? `${format(date.from, 'yyyy-MM-dd')} ~ ${format(date.to, 'yyyy-MM-dd')}`
      : '';

  // Input 직접 입력 파싱 (YYYY-MM-DD ~ YYYY-MM-DD)
  const handleInputChange = (value: string) => {
    setInputValue(value);

    const match = value.match(
      /(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/,
    );
    if (!match) return;

    const from = parse(match[1], 'yyyy-MM-dd', new Date());
    const to = parse(match[2], 'yyyy-MM-dd', new Date());

    const newRange: DateRange = { from, to };
    // 입력으로도 tempDate와 date를 동시에 업데이트할지,
    // 아니면 tempDate만 바꿀지는 취향인데,
    // 보통 입력은 "확정값"으로 보는 게 자연스러워서 둘 다 업데이트합니다.
    setTempDate(newRange);
    setDate(newRange);
  };

  // 캘린더에서 임시 선택
  const handleTempSelect = (selected: DateRange | undefined) => {
    if (!selected?.from) return;
    setTempDate(selected);
  };

  const handleConfirm = () => {
    // tempDate를 최종 date로 확정
    if (!tempDate?.from || !tempDate?.to) {
      setOpen(false);
      return;
    }

    setDate(tempDate);

    setInputValue(
      `${format(tempDate.from, 'yyyy-MM-dd')} ~ ${format(
        tempDate.to,
        'yyyy-MM-dd',
      )}`,
    );

    setOpen(false);
  };

  const handleCancel = () => {
    // tempDate를 기존 확정된 date로 되돌림
    setTempDate(date);

    if (date?.from && date?.to) {
      setInputValue(
        `${format(date.from, 'yyyy-MM-dd')} ~ ${format(
          date.to,
          'yyyy-MM-dd',
        )}`,
      );
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Input은 Popover 밖 */}
      <div className="w-65">  {/* 전체 컨테이너 너비 */}
        <div className="flex items-center gap-2 w-full h-10">  {/* flex 컨테이너 */}
          <FieldLabel 
            htmlFor={id}
            className="text-sm font-medium whitespace-nowrap min-w-18 shrink-0 px-1"
          >
            {title + ' :'}
          </FieldLabel>
          <div className="flex-1 min-w-55 relative">
            <Input
              id={id}
              placeholder="YYYY-MM-DD ~ YYYY-MM-DD"
              value={inputValue || rangeDisplay}
              onChange={(e) => handleInputChange(e.target.value)}
              className="h-10 pr-10 pl-2 text-sm border rounded-md focus-visible:ring-2 bg-white"
            />
            <PopoverTrigger asChild>
              <CalendarIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                tabIndex={0}
              />
            </PopoverTrigger>
          </div>
        </div>
      </div>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 pb-0">
          <Calendar
            locale={ko}
            mode="range"
            selected={tempDate}
            onSelect={handleTempSelect}
            numberOfMonths={2}
            fixedWeeks
            showOutsideDays={false}
          />
        </div>
        <div className="flex items-center justify-end space-x-2 p-3 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button type="button" size="sm" onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WdogInputDateTerm;
