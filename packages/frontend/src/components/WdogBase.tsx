import { useState } from 'react';
import { Button } from "@/components/ui/button"

interface WgodBaseProps {
  initialCount?: number;
}

const WgodBase = (
{ 
  initialCount = 0 
}: WgodBaseProps) => 
{
  // 카운트 상태를 관리합니다.
  const [count, setCount] = useState<number>(initialCount);

  const increment = () => {
    setCount(count + 1);
  };
  const decrement = () => {
    setCount(count - 1);
  };  

  return (
    <div>
      <p>Count: {count}</p>
      <div className='flex items-center justify-center gap-4'>
        <Button onClick={increment}>Increase</Button>
        <Button onClick={decrement}>Decrease</Button>
      </div>
    </div>
  );
};

export default WgodBase;