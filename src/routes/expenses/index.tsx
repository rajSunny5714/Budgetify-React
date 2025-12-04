import AddNewEntryBtn from '@/Components/AddNewEntryBtn';
import BackButton from '@/Components/backButton';
import SpendingDashBoard from '@/Components/SpendingDashboard';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import BudgetLists from '@/Components/BudgettLists';

export const Route = createFileRoute('/expenses/')({
  component: ExpensesPage,
});

export type Expense = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
};

export type Income = {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    fetchBudget();
  }, []);

  // Add new entry (called from AddNewEntryBtn via refreshUI)
  const addNewEntry = async (item: Expense | Income, type: string) => {
    const url =
      type.toLowerCase() === 'expense'
        ? 'http://localhost:8080/expenses/addExpense'
        : 'http://localhost:8080/income/addIncomeSource';

    // If item is an empty object (clear action per your Option B) skip POST and just refresh
    if (!item || Object.keys(item).length === 0) {
      // Option B: keep behavior of calling refreshUI with an empty object - mimic adding a new "dummy" entry
      if (type.toLowerCase() === 'expense') {
        // Add a temporary dummy entry locally (so UI shows newly added bar)
        setExpenses(prev => [
          ...prev,
          {
            id: Date.now(),
            name: '',
            category: '',
            amount: 0,
            date: '',
          } as Expense,
        ]);
      } else {
        setIncomes(prev => [
          ...prev,
          {
            id: Date.now(),
            name: '',
            category: '',
            amount: 0,
            date: '',
          } as Income,
        ]);
      }
      // refresh from backend to keep consistent totals (optional)
      fetchBudget();
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        // server returned error — still attempt to refresh UI locally
        console.warn('Add request failed', await response.text());
      } else {
        const savedItem = await response.json();
        if (type.toLowerCase() === 'expense') {
          setExpenses(prev => [...prev, savedItem]);
        } else {
          setIncomes(prev => [...prev, savedItem]);
        }
      }
    } catch (err) {
      console.error('Failed to POST new item', err);
    } finally {
      fetchBudget();
    }
  };

  // Update entry
  const updateEntry = async (item: Expense | Income, type: string) => {
    const url =
      type.toLowerCase() === 'expense'
        ? `http://localhost:8080/expenses/updateExpense/${item.id}`
        : `http://localhost:8080/income/updateIncome`;

    try {
      await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      fetchBudget();
    }
  };

  // Delete entry
  const deleteEntry = async (id: number, type: string) => {
    const url =
      type.toLowerCase() === 'expense'
        ? `http://localhost:8080/expenses/removeExpense/${id}`
        : `http://localhost:8080/income/removeIncome/${id}`;

    try {
      await fetch(url, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      fetchBudget();
    }
  };

  // Fetch all
  const fetchBudget = async () => {
    try {
      const expensesRes = await fetch('http://localhost:8080/expenses');
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);
      }

      const incomesRes = await fetch('http://localhost:8080/income');
      if (incomesRes.ok) {
        const incomesData = await incomesRes.json();
        setIncomes(incomesData);
      }
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <BackButton />
      <h1 className="text-3xl font-bold text-[#0d3a5c] ml-6 mt-9">CURRENT CASH FLOW</h1>

      <section className="flex flex-col lg:flex-row gap-10 ml-5 mb-10">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#0d3a5c] ml-2 my-5">Expenses</h2>
          <BudgetLists
            list={expenses}
            type="expense"
            updateEntry={updateEntry}
            deleteListItem={deleteEntry}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#0d3a5c] my-5">Income</h2>
          <BudgetLists
            list={incomes}
            type="income"
            updateEntry={updateEntry}
            deleteListItem={deleteEntry}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <SpendingDashBoard expenses={expenses} income={incomes} />
        </div>
      </section>

      <section className="flex justify-between items-center">
        {/* Passing addNewEntry (this function will act as "refreshUI") */}
        <AddNewEntryBtn refreshUI={addNewEntry} />
      </section>
    </div>
  );
}