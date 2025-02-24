import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const IntervalTimer = () => {
  const [count, setCount] = useState(0);
  const [lastReset, setLastReset] = useState(new Date());

  const resetTimer = useCallback(() => {
    setCount(0);
    setLastReset(new Date());
  }, []);

  useEffect(() => {
    // Set up the interval
    const intervalId = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    // Add click event listener to document
    document.addEventListener('click', resetTimer);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('click', resetTimer);
    };
  }, [resetTimer]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Interval Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold">{count}</p>
          <p className="text-sm text-gray-500">seconds since last reset</p>
        </div>
        <div className="text-sm text-gray-500">
          Last reset: {lastReset.toLocaleTimeString()}
        </div>
        <p className="text-sm text-gray-500">
          Click anywhere on the page to reset the timer
        </p>
      </CardContent>
    </Card>
  );
};

export default IntervalTimer;
