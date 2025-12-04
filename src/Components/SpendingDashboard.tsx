import type { Expense, Income } from '@/routes/expenses';

type SpendingDashBoardProps = {
  expenses: Expense[];
  income: Income[];
};

export default function SpendingDashBoard({ expenses, income }: SpendingDashBoardProps) {
  const totalExpenses = (expenses || []).reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalIncome = (income || []).reduce((sum, inc) => sum + (inc.amount || 0), 0);
  const remainingMoney = totalIncome - totalExpenses;
  const overspending = remainingMoney < 0; // negative remaining = overspending
  const lowMoneyThreshold = 101;

  return (
    <div className="max-w-full p-4 rounded-lg">
      {/* Summary */}
      <div className="mb-6 p-6 rounded-lg text-[#0d3a5c] bg-white shadow-md">
        <div className="text-center space-y-2">
          <p className="text-xl font-bold">
            Total Income: <span className="text-emerald-400">${totalIncome}</span>
          </p>
          <p className="text-xl font-bold">
            Total Expenses: <span className="text-red-500">${totalExpenses}</span>
          </p>
          <p className="text-xl font-bold">
            Remaining Money:{' '}
            <span className={remainingMoney >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${remainingMoney}
            </span>
          </p>
        </div>
      </div>

      <div className="text-center space-y-2">
        {overspending ? (
          <p className="text-red-600 font-semibold">Overspending! Time to cut expenses.</p>
        ) : remainingMoney < lowMoneyThreshold ? (
          <p className="text-yellow-600 font-semibold">
            Money is low! Try earning fast.
          </p>
        ) : (
          <p className="text-green-600 font-semibold">Within Budget. Doing Great!</p>
        )}

        <div className="mt-5 flex justify-center">
          <img
            alt="budget line"
            className="w-48"
            src={overspending ? 'wallet.svg' : 'coin-stack.svg'}
          />
        </div>
      </div>
    </div>
  );
}