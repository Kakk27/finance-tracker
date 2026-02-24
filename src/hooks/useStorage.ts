import { useState, useEffect, useCallback } from 'react';
import type { Transaction } from '@/types';

export function useStorage(userId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const getStorageKey = () => `transactions:${userId || 'anonymous'}`;

  // Load transactions from storage on mount or when userId changes
  useEffect(() => {
    const loadTransactions = () => {
      if (!userId) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }

      try {
        const stored = localStorage.getItem(getStorageKey());
        if (stored) {
          const parsed = JSON.parse(stored);
          setTransactions(parsed);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [userId]);

  // Save transactions to storage
  const saveTransactions = useCallback(async (newTransactions: Transaction[]) => {
    if (!userId) return;
    
    setIsSaving(true);
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Failed to save transactions:', error);
    } finally {
      setIsSaving(false);
    }
  }, [userId]);

  // Add a new transaction
  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    const updated = [newTransaction, ...transactions];
    await saveTransactions(updated);
    return newTransaction;
  }, [transactions, saveTransactions]);

  // Delete a transaction
  const deleteTransaction = useCallback(async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    await saveTransactions(updated);
  }, [transactions, saveTransactions]);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Get top spending categories
  const getTopSpending = useCallback(() => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return {
    transactions,
    isLoading,
    isSaving,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
    netBalance,
    getTopSpending,
    recentTransactions,
  };
}
