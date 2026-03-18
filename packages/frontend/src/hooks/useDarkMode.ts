import { useEffect, useState } from 'react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return; // 구형 브라우저 지원

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mq.matches);

    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

    // 상태 변경 시 DOM + localStorage 업데이트
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return isDarkMode;
};