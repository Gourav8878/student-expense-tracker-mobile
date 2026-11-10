export type ExpenseCategory =
  | 'food'
  | 'snacks'
  | 'travel'
  | 'education'
  | 'shopping'
  | 'entertainment'
  | 'hostel'
  | 'personal'
  | 'bills'
  | 'healthcare'
  | 'other';

export type PaymentMethod =
  | 'UPI'
  | 'Cash'
  | 'Debit Card'
  | 'Credit Card'
  | 'Net Banking'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number; // in Paise (1 INR = 100 Paise)
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyBudget {
  id: string;
  month: number; // 1-12
  year: number;
  amount: number; // in Paise
  categoryBudgets?: Partial<Record<ExpenseCategory, number>>; // in Paise per category
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBudgetDetail {
  category: ExpenseCategory;
  allocatedPaise: number;
  spentPaise: number;
  remainingPaise: number;
  percentage: number;
  isOverBudget: boolean;
  isWarning: boolean;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number; // in Paise
  savedAmount: number; // in Paise
  targetDate?: string; // YYYY-MM-DD
  category?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringExpense {
  id: string;
  title: string;
  amount: number; // in Paise
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  dueDay: number; // 1-31 of each month
  frequency: 'monthly' | 'weekly';
  notes?: string;
  lastPaidMonthYear?: string; // e.g. "2026-10" to prevent duplicate payment in the same cycle
  active: boolean;
  createdAt: string;
}

export interface QuickAddPreset {
  id: string;
  title: string;
  category: ExpenseCategory;
  amountPaise: number;
}

export interface UserProfile {
  name: string;
  email: string;
  college: string;
  currency: string;
  currencySymbol: string;
  dailyAlertEnabled: boolean;
  warningThresholdPercent: number; // e.g. 80%
}

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export type ActiveTab = 'home' | 'analytics' | 'add' | 'transactions' | 'settings';
