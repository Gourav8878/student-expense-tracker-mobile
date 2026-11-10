import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Expense,
  MonthlyBudget,
  SavingsGoal,
  RecurringExpense,
  QuickAddPreset,
  UserProfile,
} from '../types';

const STORAGE_KEY = '@student_expense_tracker_data';

export interface AppStorageData {
  expenses: Expense[];
  budgets: MonthlyBudget[];
  savingsGoals: SavingsGoal[];
  recurringExpenses: RecurringExpense[];
  quickAddPresets: QuickAddPreset[];
  profile: UserProfile | null;
  darkMode: boolean;
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  college: '',
  currency: 'INR',
  currencySymbol: '₹',
  dailyAlertEnabled: false,
  warningThresholdPercent: 80,
};

export const emptyData: AppStorageData = {
  expenses: [],
  budgets: [],
  savingsGoals: [],
  recurringExpenses: [],
  quickAddPresets: [],
  profile: defaultProfile,
  darkMode: false,
};

export async function loadAppData(): Promise<AppStorageData> {
  try {
    const savedData = await AsyncStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return emptyData;
    }

    const parsedData = JSON.parse(savedData);

    return {
      ...emptyData,
      ...parsedData,

      expenses: parsedData.expenses ?? [],
      budgets: parsedData.budgets ?? [],
      savingsGoals: parsedData.savingsGoals ?? [],
      recurringExpenses: parsedData.recurringExpenses ?? [],
      quickAddPresets: parsedData.quickAddPresets ?? [],

      profile: {
        ...defaultProfile,
        ...(parsedData.profile ?? {}),
      },

      darkMode: parsedData.darkMode ?? false,
    };
  } catch (error) {
    console.error('Error loading app data:', error);
    return emptyData;
  }
}

export async function saveAppData(
  data: AppStorageData,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data),
    );
  } catch (error) {
    console.error('Error saving app data:', error);
    throw error;
  }
}

export async function clearAppData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}