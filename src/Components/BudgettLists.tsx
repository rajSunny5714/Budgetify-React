import { useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditNoteIcon from '@mui/icons-material/EditNote';
import type { Expense, Income } from '@/routes/expenses';

type BudgetListsProps = {
  list: Expense[] | Income[];
  type: string;
  updateEntry: (item: Expense | Income, type: string) => void;
  deleteListItem: (id: number, type: string) => void;
};

const BudgetLists = ({ list, updateEntry, type, deleteListItem }: BudgetListsProps) => {
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {(!list || list.length === 0) ? (
        <p className="text-center text-gray-500">No records yet.</p>
      ) : (
        list.map((item) => {
          // safe key: use id if present, otherwise fallback to random with type prefix
          const key = `${type}-${(item as any).id ?? Math.random().toString(36).slice(2)}`;

          return (
            <div
              key={key}
              className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-gray-200 rounded-xl p-4 w-full shadow-sm hover:shadow-md transition-shadow"
            >
              {editingMode && editingId === (item as any).id ? (
                // EDIT MODE
                <div className="flex flex-wrap gap-2 w-full items-center">
                  <input
                    type="text"
                    defaultValue={item.name}
                    className="border-b border-gray-300 px-1 py-0.5 w-24 text-sm"
                    onChange={(e) => (item.name = e.target.value)}
                  />
                  <input
                    type="text"
                    defaultValue={item.category}
                    className="border-b border-gray-300 px-1 py-0.5 w-24 text-sm"
                    onChange={(e) => (item.category = e.target.value)}
                  />
                  <input
                    type="number"
                    defaultValue={item.amount as any}
                    className="border-b border-gray-300 px-1 py-0.5 w-20 text-sm"
                    onChange={(e) => (item.amount = Number(e.target.value))}
                  />
                  <input
                    type="date"
                    defaultValue={item.date ? item.date.split('T')[0] : ''}
                    className="border-b border-gray-300 px-1 py-0.5 w-32 text-sm"
                    onChange={(e) => (item.date = e.target.value)}
                  />
                  <button
                    className="text-green-500 hover:text-green-700 text-sm px-2 py-1"
                    onClick={() => {
                      updateEntry(item, type);
                      setEditingMode(false);
                      setEditingId(null);
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
                    onClick={() => {
                      setEditingMode(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // VIEW MODE
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="font-semibold text-gray-800 w-32 md:w-auto">{item.name}</span>
                    <span className="text-gray-600 w-32 md:w-auto">{item.category}</span>
                    <span className="text-gray-800 font-medium">${item.amount}</span>
                    <span className="text-gray-500">{item.date ? item.date.split('T')[0] : ''}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    <button
                      className="text-amber-400 hover:text-blue-700"
                      onClick={() => {
                        setEditingMode(true);
                        setEditingId((item as any).id ?? null);
                      }}
                    >
                      <EditNoteIcon />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteListItem((item as any).id, type)}
                    >
                      <HighlightOffIcon />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default BudgetLists;