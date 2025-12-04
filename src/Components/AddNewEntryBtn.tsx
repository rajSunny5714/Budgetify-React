import { useState } from "react";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Expense, Income } from "@/routes/expenses";

type AddEntryProps = {
  refreshUI: (item: Expense | Income | null, type: "income" | "expense") => void;
};

const AddNewEntryBtn = ({ refreshUI }: AddEntryProps) => {
  const [displayForm, setFormDisplay] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState<"income" | "expense">(
    "income"
  );

  // ----------------------------
  // CLEAR BUTTONS FIXED
  // ----------------------------
  const clearIncome = async () => {
    await fetch("http://localhost:8080/income/clearAll", { method: "DELETE" });

    // ⛔ DO NOT push empty element – just reset state in parent
    refreshUI(null, "income");
  };

  const clearExpense = async () => {
    await fetch("http://localhost:8080/expenses/clearAll", {
      method: "DELETE",
    });

    refreshUI(null, "expense");
  };

  const clearAll = async () => {
    await fetch("http://localhost:8080/income/clearAll", { method: "DELETE" });
    await fetch("http://localhost:8080/expenses/clearAll", {method: "DELETE",}
    );

    refreshUI(null, "income");
    refreshUI(null, "expense");
  };

  // ----------------------------
  // ADD NEW ENTRY
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("title") as string,
      category: formData.get("category") as string,
      amount: Number(formData.get("amount")),
      date: formData.get("date") as string,
    };

    const type = selectedBtn;

    const url =
      type === "income"
        ? "http://localhost:8080/income/addIncomeSource"
        : "http://localhost:8080/expenses/addExpense";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const savedItem = await response.json();

    setFormDisplay(false);
    refreshUI(savedItem, type);
  };

  return (
    <section className="flex flex-col items-center gap-5">
      {displayForm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
          <form
            className="flex flex-col gap-5 bg-white p-6 rounded-3xl shadow-lg w-full max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            <h2 className="text-3xl font-bold text-gray-800 flex justify-between items-center">
              <span>
                Add New {selectedBtn.charAt(0).toUpperCase() + selectedBtn.slice(1)}
              </span>
              <CancelIcon
                sx={{ color: "#DF3A3A", cursor: "pointer" }}
                onClick={() => setFormDisplay(false)}
              />
            </h2>

            {/* SELECT TYPE */}
            <label className="text-lg font-semibold text-gray-700">
              Select type:
            </label>

            <RadioGroup
              name="budget-type"
              value={selectedBtn}
              onChange={(e) =>
                setSelectedBtn(e.target.value as "income" | "expense")
              }
            >
              <div className="flex items-center gap-4">
                <FormControlLabel
                  value="income"
                  control={<Radio color="warning" />}
                  label="Income"
                />
                <FormControlLabel
                  value="expense"
                  control={<Radio color="warning" />}
                  label="Expense"
                />
              </div>
            </RadioGroup>

            {/* INPUTS */}
            <input
              type="text"
              required
              name="title"
              placeholder="Title"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-2"
            />

            <input
              type="text"
              required
              name="category"
              placeholder="Category"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-2"
            />

            <input
              type="number"
              required
              name="amount"
              placeholder="Amount"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-2"
            />
            
            <input
              type="date"
              required
              name="date"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-2"
              max={new Date().toISOString().split("T")[0]} // restrict future dates
            />

            <button
              type="submit"
              className="w-full border-4 text-2xl bg-[#f3de2c] rounded-3xl px-5 py-2 font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {!displayForm && (
        <button
          className="w-sm border-4 text-2xl bg-[#f3de2c] rounded-3xl px-5 py-2 font-semibold"
          onClick={() => setFormDisplay(true)}
        >
          ADD NEW ENTRY
        </button>
      )}

      {/* CLEAR BUTTONS */}
      <div className="flex flex-col md:flex-row gap-3 mt-4">
        <button
          onClick={clearIncome}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-600"
        >
          Clear Income Only
        </button>

        <button
          onClick={clearExpense}
          className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-600"
        >
          Clear Expense Only
        </button>

        <button
          onClick={clearAll}
          className="bg-black text-white px-4 py-2 rounded-xl shadow-md hover:bg-gray-800"
        >
          Clear All
        </button>
      </div>
    </section>
  );
};

export default AddNewEntryBtn;
