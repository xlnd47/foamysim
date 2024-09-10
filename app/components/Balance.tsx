'use client'

import { useState, useEffect } from 'react';
import { getBalance } from '../services/balanceService';

export default function Balance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const data = await getBalance();
        setBalance(data.obj.balance);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch balance');
        setLoading(false);
      }
    }

    fetchBalance();
  }, []);

  if (loading) return <div className="text-sm">Loading balance...</div>;
  if (error) return <div className="text-sm text-red-500">Error: {error}</div>;

  return (
    <div className="text-sm font-semibold">
      Balance: <span className="text-green-500">${(balance! / 10000).toFixed(2)}</span>
    </div>
  );
}