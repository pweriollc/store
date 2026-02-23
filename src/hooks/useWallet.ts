import { useState, useCallback, useEffect } from 'react';

export function useWallet(initialBalance: number = 0) {
  const [balance, setBalance] = useState(initialBalance);

  useEffect(() => {
    setBalance(initialBalance);
  }, [initialBalance]);

  const calculateBonus = (amount: number) => {
    if (amount >= 200) return amount * 0.15;
    if (amount >= 100) return amount * 0.10;
    if (amount >= 50) return amount * 0.05;
    return 0;
  };

  const topUp = useCallback((amount: number) => {
    const bonus = calculateBonus(amount);
    setBalance((prev) => prev + amount + bonus);
  }, []);

  const pay = useCallback((amount: number) => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      return true;
    }
    return false;
  }, [balance]);

  return { balance, topUp, pay, calculateBonus };
}
