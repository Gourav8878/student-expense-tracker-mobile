import { Expense } from '../types';
import { paiseToRupees } from './calculations';

export const exportTransactionsToCSV = (transactions: Expense[]): { success: boolean; error?: string } => {
  try {
    if (!transactions || transactions.length === 0) {
      return { success: false, error: 'No transactions found to export.' };
    }

    const headers = ['ID', 'Date', 'Title', 'Category', 'Amount (INR)', 'Payment Method', 'Notes'];

    const escapeCSV = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = transactions.map((t) => [
      escapeCSV(t.id),
      escapeCSV(t.date),
      escapeCSV(t.title),
      escapeCSV(t.category),
      escapeCSV(paiseToRupees(t.amount).toFixed(2)),
      escapeCSV(t.paymentMethod || 'N/A'),
      escapeCSV(t.notes || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `Student_Expenses_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to export CSV' };
  }
};
