import { ExpenseCategory, PaymentMethod } from '../types';

export interface CategoryMeta {
  id: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
  bgLight: string;
  bgDark: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'food',
    label: 'Food & Mess',
    icon: 'UtensilsCrossed',
    color: '#F59E0B',
    bgLight: '#FEF3C7',
    bgDark: '#78350F',
    description: 'Mess bills, canteen meals, lunch thalis'
  },
  {
    id: 'snacks',
    label: 'Snacks & Cafe',
    icon: 'Coffee',
    color: '#D97706',
    bgLight: '#FDE68A',
    bgDark: '#451A03',
    description: 'Chai, coffee, puffs, late-night Maggie'
  },
  {
    id: 'travel',
    label: 'Travel & Transit',
    icon: 'Bus',
    color: '#3B82F6',
    bgLight: '#DBEAFE',
    bgDark: '#1E3A8A',
    description: 'Bus passes, metro cards, autos, trains home'
  },
  {
    id: 'education',
    label: 'Education & Stationery',
    icon: 'GraduationCap',
    color: '#8B5CF6',
    bgLight: '#EDE9FE',
    bgDark: '#4C1D95',
    description: 'Textbooks, exam fees, notebooks, printing'
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: 'ShoppingBag',
    color: '#EC4899',
    bgLight: '#FCE7F3',
    bgDark: '#831843',
    description: 'Clothing, college accessories, footwear'
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: 'Film',
    color: '#10B981',
    bgLight: '#D1FAE5',
    bgDark: '#064E3B',
    description: 'Movies, gaming, outings with friends'
  },
  {
    id: 'hostel',
    label: 'Hostel & Rent',
    icon: 'Home',
    color: '#6366F1',
    bgLight: '#E0E7FF',
    bgDark: '#312E81',
    description: 'Hostel rent, PG maintenance, laundry'
  },
  {
    id: 'personal',
    label: 'Personal Care',
    icon: 'Sparkles',
    color: '#14B8A6',
    bgLight: '#CCFBF1',
    bgDark: '#134E4A',
    description: 'Toiletries, haircut, grooming essentials'
  },
  {
    id: 'bills',
    label: 'Bills & Subscriptions',
    icon: 'Receipt',
    color: '#F43F5E',
    bgLight: '#FFE4E6',
    bgDark: '#881337',
    description: 'Mobile recharge, Wi-Fi share, streaming'
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Meds',
    icon: 'HeartPulse',
    color: '#EF4444',
    bgLight: '#FEE2E2',
    bgDark: '#7F1D1D',
    description: 'Doctor visits, medicines, first-aid'
  },
  {
    id: 'other',
    label: 'Other Miscellaneous',
    icon: 'MoreHorizontal',
    color: '#64748B',
    bgLight: '#F1F5F9',
    bgDark: '#1E293B',
    description: 'Borrowings, fines, emergency expenses'
  }
];

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: 'QrCode' },
  { id: 'Cash', label: 'Cash', icon: 'Banknote' },
  { id: 'Debit Card', label: 'Debit Card', icon: 'CreditCard' },
  { id: 'Credit Card', label: 'Credit Card', icon: 'CreditCard' },
  { id: 'Net Banking', label: 'Net Banking', icon: 'Building2' },
  { id: 'Other', label: 'Other', icon: 'CircleDollarSign' }
];

export const getCategoryMeta = (categoryId: ExpenseCategory): CategoryMeta => {
  const found = CATEGORIES.find(c => c.id === categoryId);
  return found || CATEGORIES[CATEGORIES.length - 1];
};
