export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', emoji: '💼' },
  { id: 'freelance', name: 'Freelance', emoji: '🖥️' },
  { id: 'investment', name: 'Investment', emoji: '📈' },
  { id: 'gift', name: 'Gift', emoji: '🎁' },
  { id: 'other-income', name: 'Other', emoji: '📌' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'housing', name: 'Housing', emoji: '🏠' },
  { id: 'food', name: 'Food', emoji: '🍜' },
  { id: 'transport', name: 'Transport', emoji: '🚗' },
  { id: 'health', name: 'Health', emoji: '💊' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️' },
  { id: 'utilities', name: 'Utilities', emoji: '⚡' },
  { id: 'other-expense', name: 'Other', emoji: '📌' },
];

export type View = 'overview' | 'add' | 'history' | 'account';
export type AppView = 'landing' | 'app';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}
