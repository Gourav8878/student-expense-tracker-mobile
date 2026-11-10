
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { Expense, UserProfile} from '../types';
import {
  AppStorageData,
  loadAppData,
  saveAppData,
} from '../services/storageService';

interface AppContextType {
  data: AppStorageData;
  isLoading: boolean;
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  setBudget: (amount: number) => Promise<void>;
  updateProfile: (profile: { name: string }) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  clearData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppStorageData>({
    expenses: [],
    budgets: [],
    savingsGoals: [],
    recurringExpenses: [],
    quickAddPresets: [],
    profile: null,
    darkMode: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      const savedData = await loadAppData();
      setData(savedData);
      setIsLoading(false);
    }

    initialize();
  }, []);

  async function updateData(updatedData: AppStorageData) {
    setData(updatedData);
    await saveAppData(updatedData);
  }

  async function addExpense(expense: Expense) {
    await updateData({
      ...data,
      expenses: [expense, ...data.expenses],
    });
  }

  async function deleteExpense(id: string) {
    await updateData({
      ...data,
      expenses: data.expenses.filter(e => e.id !== id),
    });
  }

  async function updateExpense(expense: Expense) {
    await updateData({
      ...data,
      expenses: data.expenses.map(e =>
        e.id === expense.id ? expense : e
      ),
    });
  }

  async function setBudget(amount: number) {
    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budgets = data.budgets.filter(
      b => b.month !== month || b.year !== year
    );

    budgets.push({
      month,
      year,
      amount,
    } as AppStorageData['budgets'][number]);

    await updateData({
      ...data,
      budgets,
    });
  }

 async function updateProfile(profile: { name: string }) {
  await updateData({
    ...data,
    profile: {
      ...(data.profile ?? {}),
      ...profile,
    } as UserProfile,
  });
}

  async function toggleDarkMode() {
    await updateData({
      ...data,
      darkMode: !data.darkMode,
    });
  }

  async function clearData() {
    await updateData({
      ...data,
      expenses: [],
      budgets: [],
      savingsGoals: [],
      recurringExpenses: [],
      quickAddPresets: [],
    });
  }

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        addExpense,
        deleteExpense,
        updateExpense,
        setBudget,
        updateProfile,
        toggleDarkMode,
        clearData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}
