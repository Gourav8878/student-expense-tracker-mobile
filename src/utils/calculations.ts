import { Expense, ExpenseCategory, CategoryBudgetDetail, SavingsGoal } from '../types';

/**
 * Format Paise to Indian Rupee (₹) string
 * 1 INR = 100 Paise
 */
export const formatRupee = (paise: number): string => {
  if (isNaN(paise) || paise === null || paise === undefined) return '₹0';
  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = absPaise / 100;

  const formatted = rupees.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
};

/**
 * Convert INR input (e.g. "150.50") to integer Paise (15050)
 */
export const rupeesToPaise = (rupees: number | string): number => {
  const numeric = typeof rupees === 'string' ? parseFloat(rupees) : rupees;
  if (isNaN(numeric) || numeric < 0) return 0;
  return Math.round(numeric * 100);
};

/**
 * Convert Paise (15050) to Rupee number (150.5)
 */
export const paiseToRupees = (paise: number): number => {
  if (isNaN(paise) || paise === null) return 0;
  return paise / 100;
};

export interface BudgetMetrics {
  budgetPaise: number;
  spentPaise: number;
  remainingPaise: number;
  percentage: number;
  remainingDays: number;
  dailyTargetPaise: number;
  dailyTargetType: 'target' | 'exhausted';
  statusMessage: string;
  statusSeverity: 'success' | 'warning' | 'danger';
}

export const calculateBudgetMetrics = (
  budgetPaise: number,
  spentPaise: number,
  selectedMonth: number,
  selectedYear: number,
  warningThresholdPercent: number = 80
): BudgetMetrics => {
  const safeBudget = Math.max(0, budgetPaise || 0);
  const safeSpent = Math.max(0, spentPaise || 0);
  const remainingPaise = safeBudget - safeSpent;

  let percentage = 0;
  if (safeBudget > 0) {
    percentage = Math.round((safeSpent / safeBudget) * 100);
  }

  // Days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const now = new Date();
  let remainingDays = daysInMonth;

  if (now.getFullYear() === selectedYear && now.getMonth() + 1 === selectedMonth) {
    const todayDate = now.getDate();
    remainingDays = Math.max(1, daysInMonth - todayDate + 1);
  } else if (
    selectedYear < now.getFullYear() ||
    (selectedYear === now.getFullYear() && selectedMonth < now.getMonth() + 1)
  ) {
    remainingDays = 0; // Past month
  }

  // Daily target calculation
  // Clearly distinguish a recommended pace from a strict limit
  let dailyTargetPaise = 0;
  let dailyTargetType: 'target' | 'exhausted' = 'target';

  if (remainingPaise > 0 && remainingDays > 0) {
    dailyTargetPaise = Math.round(remainingPaise / remainingDays);
    dailyTargetType = 'target';
  } else {
    dailyTargetPaise = 0;
    dailyTargetType = 'exhausted';
  }

  // Status message & severity
  let statusMessage = "Great job! Your spending is well under budget. 🌟";
  let statusSeverity: 'success' | 'warning' | 'danger' = 'success';

  if (safeBudget === 0) {
    statusMessage = "Set a monthly budget to track your spending limits!";
    statusSeverity = 'warning';
  } else if (remainingPaise < 0) {
    statusMessage = `Warning: Monthly budget exceeded by ${formatRupee(Math.abs(remainingPaise))}! ⚠️`;
    statusSeverity = 'danger';
  } else if (percentage >= 100) {
    statusMessage = "You have exhausted 100% of your allocated monthly budget.";
    statusSeverity = 'danger';
  } else if (percentage >= warningThresholdPercent) {
    statusMessage = `Heads up! You have reached ${percentage}% of your monthly limit.`;
    statusSeverity = 'warning';
  }

  return {
    budgetPaise: safeBudget,
    spentPaise: safeSpent,
    remainingPaise,
    percentage,
    remainingDays,
    dailyTargetPaise,
    dailyTargetType,
    statusMessage,
    statusSeverity,
  };
};

/**
 * Priority 1: Calculate Category-specific Budget details
 */
export const calculateCategoryBudgetDetails = (
  expenses: Expense[],
  categoryBudgets: Partial<Record<ExpenseCategory, number>> = {},
  warningThresholdPercent: number = 80
): CategoryBudgetDetail[] => {
  // Aggregate spent per category
  const spentMap: Partial<Record<ExpenseCategory, number>> = {};
  expenses.forEach((e) => {
    spentMap[e.category] = (spentMap[e.category] || 0) + e.amount;
  });

  const categories: ExpenseCategory[] = [
    'food',
    'snacks',
    'travel',
    'education',
    'shopping',
    'entertainment',
    'hostel',
    'personal',
    'bills',
    'healthcare',
    'other',
  ];

  return categories.map((cat) => {
    const allocatedPaise = categoryBudgets[cat] || 0;
    const spentPaise = spentMap[cat] || 0;
    const remainingPaise = allocatedPaise > 0 ? allocatedPaise - spentPaise : 0;
    const percentage = allocatedPaise > 0 ? Math.round((spentPaise / allocatedPaise) * 100) : 0;
    const isOverBudget = allocatedPaise > 0 && spentPaise > allocatedPaise;
    const isWarning = allocatedPaise > 0 && percentage >= warningThresholdPercent && !isOverBudget;

    return {
      category: cat,
      allocatedPaise,
      spentPaise,
      remainingPaise,
      percentage,
      isOverBudget,
      isWarning,
    };
  });
};

export interface CategorySummary {
  category: ExpenseCategory;
  totalPaise: number;
  count: number;
  percentage: number;
}

export const getCategorySummaries = (expenses: Expense[]): CategorySummary[] => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const map: Record<string, { totalPaise: number; count: number }> = {};

  expenses.forEach((e) => {
    if (!map[e.category]) {
      map[e.category] = { totalPaise: 0, count: 0 };
    }
    map[e.category].totalPaise += e.amount;
    map[e.category].count += 1;
  });

  return Object.entries(map)
    .map(([category, data]) => ({
      category: category as ExpenseCategory,
      totalPaise: data.totalPaise,
      count: data.count,
      percentage: totalSpent > 0 ? Math.round((data.totalPaise / totalSpent) * 100) : 0,
    }))
    .sort((a, b) => b.totalPaise - a.totalPaise);
};

export const getWeeklyBreakdown = (expenses: Expense[], month: number, year: number): number[] => {
  const weeks = [0, 0, 0, 0];
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;

  expenses.forEach((e) => {
    if (e.date.startsWith(prefix)) {
      const day = parseInt(e.date.split('-')[2], 10);
      if (day <= 7) weeks[0] += e.amount;
      else if (day <= 14) weeks[1] += e.amount;
      else if (day <= 21) weeks[2] += e.amount;
      else weeks[3] += e.amount;
    }
  });

  return weeks;
};

/**
 * Priority 2: Smart Financial Insights Generator
 * Uses actual stored data, computes month-over-month differences, category spikes, and daily trends.
 */
export interface SmartInsight {
  id: string;
  type: 'increase' | 'decrease' | 'top_category' | 'daily_pace' | 'savings_tip';
  title: string;
  message: string;
  sentiment: 'positive' | 'warning' | 'neutral';
}

export const generateSmartInsights = (
  currentExpenses: Expense[],
  previousExpenses: Expense[],
  metrics: BudgetMetrics,
  categoryDetails: CategoryBudgetDetail[]
): SmartInsight[] => {
  const insights: SmartInsight[] = [];
  const currentTotal = currentExpenses.reduce((s, e) => s + e.amount, 0);
  const previousTotal = previousExpenses.reduce((s, e) => s + e.amount, 0);

  // 1. Minimum Data Check: only generate when at least 2 current transactions exist
  if (currentExpenses.length < 2) {
    return [
      {
        id: 'need_more_data',
        type: 'savings_tip',
        title: 'Insights Building Up',
        message: 'Log a few more daily campus expenses to unlock AI-powered spending trends and category comparison.',
        sentiment: 'neutral',
      },
    ];
  }

  // 2. Highest Spending Category
  const catSummaries = getCategorySummaries(currentExpenses);
  if (catSummaries.length > 0) {
    const top = catSummaries[0];
    insights.push({
      id: 'top_category',
      type: 'top_category',
      title: 'Primary Spending Category',
      message: `${top.category.charAt(0).toUpperCase() + top.category.slice(1)} is your highest expenditure this month at ${formatRupee(top.totalPaise)} (${top.percentage}% of all expenses).`,
      sentiment: top.percentage > 45 ? 'warning' : 'neutral',
    });
  }

  // 3. Month-over-Month Total Spend Comparison
  if (previousExpenses.length > 0 && previousTotal > 0) {
    const diffPaise = currentTotal - previousTotal;
    const percentChange = Math.round((Math.abs(diffPaise) / previousTotal) * 100);

    if (diffPaise > 0) {
      insights.push({
        id: 'mom_increase',
        type: 'increase',
        title: 'Month-over-Month Increase',
        message: `Your spending is ${percentChange}% higher (${formatRupee(diffPaise)} more) compared to last month (${formatRupee(previousTotal)}).`,
        sentiment: 'warning',
      });
    } else if (diffPaise < 0) {
      insights.push({
        id: 'mom_decrease',
        type: 'decrease',
        title: 'Spending Cut Achieved',
        message: `You've spent ${percentChange}% less (${formatRupee(Math.abs(diffPaise))} saved) compared to last month at this stage!`,
        sentiment: 'positive',
      });
    }

    // 4. Category-level Month-over-Month Shifts
    const prevCatMap: Partial<Record<ExpenseCategory, number>> = {};
    previousExpenses.forEach((e) => {
      prevCatMap[e.category] = (prevCatMap[e.category] || 0) + e.amount;
    });

    for (const curCat of catSummaries) {
      const prevCatSpend = prevCatMap[curCat.category] || 0;
      if (prevCatSpend > 0) {
        const catDiff = curCat.totalPaise - prevCatSpend;
        if (catDiff > 100000) {
          // ₹1,000+ increase
          insights.push({
            id: `cat_spike_${curCat.category}`,
            type: 'increase',
            title: `${curCat.category.charAt(0).toUpperCase() + curCat.category.slice(1)} Surge`,
            message: `Spending on ${curCat.category} jumped by ${formatRupee(catDiff)} compared to last month.`,
            sentiment: 'warning',
          });
          break; // Show at most one category spike to avoid clutter
        }
      }
    }
  }

  // 5. Daily Spending Target Pace Insight
  if (metrics.dailyTargetType === 'target' && metrics.dailyTargetPaise > 0) {
    insights.push({
      id: 'daily_pace',
      type: 'daily_pace',
      title: 'Safe Daily Spending Pace',
      message: `Keeping non-essential expenses under ${formatRupee(metrics.dailyTargetPaise)}/day for the remaining ${metrics.remainingDays} days ensures you finish the month with a surplus.`,
      sentiment: 'positive',
    });
  } else if (metrics.remainingPaise < 0) {
    insights.push({
      id: 'budget_exhausted',
      type: 'daily_pace',
      title: 'Target Limit Reached',
      message: `Your budget is exhausted by ${formatRupee(Math.abs(metrics.remainingPaise))}. Recommended discretionary spending is ₹0/day until next month.`,
      sentiment: 'warning',
    });
  }

  // 6. Category Budget Warning Insights
  const warnedCategories = categoryDetails.filter((cd) => cd.isOverBudget || cd.isWarning);
  if (warnedCategories.length > 0) {
    const firstWarn = warnedCategories[0];
    insights.push({
      id: `cat_warn_${firstWarn.category}`,
      type: 'savings_tip',
      title: `${firstWarn.category.toUpperCase()} Budget Alert`,
      message: firstWarn.isOverBudget
        ? `${firstWarn.category} exceeded allocated budget by ${formatRupee(firstWarn.spentPaise - firstWarn.allocatedPaise)}.`
        : `${firstWarn.category} has reached ${firstWarn.percentage}% of its allocated target.`,
      sentiment: 'warning',
    });
  }

  return insights;
};

/**
 * Priority 4: Calculate Savings Goal Metrics
 */
export const calculateSavingsGoalMetrics = (goal: SavingsGoal) => {
  const target = Math.max(0, goal.targetAmount);
  const saved = Math.max(0, goal.savedAmount);
  const remaining = Math.max(0, target - saved);
  const percentage = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 100;
  const isCompleted = saved >= target;

  let daysRemaining: number | null = null;
  if (goal.targetDate) {
    const targetTime = new Date(goal.targetDate).getTime();
    const nowTime = new Date().getTime();
    const diffDays = Math.ceil((targetTime - nowTime) / (1000 * 60 * 60 * 24));
    daysRemaining = diffDays;
  }

  return {
    target,
    saved,
    remaining,
    percentage,
    isCompleted,
    daysRemaining,
  };
};
