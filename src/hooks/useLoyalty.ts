import { useState, useCallback } from 'react';

export function useLoyalty() {
  const [points, setPoints] = useState(0);
  const [stamps, setStamps] = useState(0);

  const addPoints = useCallback((amount: number) => {
    setPoints((prev) => {
      const newPoints = prev + Math.floor(amount);
      // Every 100 points = 1 Free Slice (simulated by stamps for now)
      if (newPoints >= 100) {
        setStamps((s) => Math.min(s + 1, 10));
        return newPoints - 100;
      }
      return newPoints;
    });
  }, []);

  const resetStamps = useCallback(() => setStamps(0), []);

  return { points, stamps, addPoints, resetStamps };
}
