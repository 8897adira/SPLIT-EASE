import React, { useState } from "react";
import "../styles/SplitNow.css";
import { calculateSettlements } from "../utils/splitlogic";

const SplitNow = ({ setShowSplitScreen }) => {
  const [expenseName, setExpenseName] = useState("");
  const [members, setMembers] = useState([
  { name: "Me", expenses: [], totalPaid: 0 },
]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [newMember, setNewMember] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  // handle input change
  const handleChange = (i, value) => {
    const updated = [...members];
    updated[i].paid = parseFloat(value) || 0;
    setMembers(updated);
  };

  // handle adding new member
  const handleAddMember = () => {
  if (newMember.trim() === "") return;
  if (members.some((m) => m.name.toLowerCase() === newMember.toLowerCase())) {
    alert("Member already exists!");
    return;
  }

  setMembers([...members, { name: newMember.trim(), expenses: [], totalPaid: 0 }]);
  setNewMember("");
  setAddingMember(false);
};

  //remove member
  const handleRemoveMember = (index) => {
  if (members.length === 1) return alert("You cannot remove all members.");
  const updated = [...members];
  updated.splice(index, 1);
  setMembers(updated);
};

  // handle split calculation
  const handleSplit = () => {
  const memberTotals = members.map((m) => ({
    name: m.name,
    paid: m.totalPaid,
  }));
  const res = calculateSettlements(memberTotals);
  setResult(res);
  setShowResult(true);
};


  const addExpense = (memberIndex) => {
  const updated = [...members];
  updated[memberIndex].expenses.push({ desc: "", amount: 0 });
  setMembers(updated);
};

const updateExpenseDesc = (memberIndex, expenseIndex, value) => {
  const updated = [...members];
  updated[memberIndex].expenses[expenseIndex].desc = value;
  setMembers(updated);
};

const updateExpenseAmount = (memberIndex, expenseIndex, value) => {
  const updated = [...members];
  const numValue = parseFloat(value) || 0;
  updated[memberIndex].expenses[expenseIndex].amount = numValue;

  // Recalculate total
  updated[memberIndex].totalPaid = updated[memberIndex].expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0
  );

  setMembers(updated);
};


  return (
    <div className="split-screen">
      <div className="split-header">
        <button onClick={() => setShowSplitScreen(false)}>←</button>
        <h3>Split Now</h3>
      </div>

        <div className="expense-name">
    <label>Expense Name:</label>
    <input
      type="text"
      placeholder="e.g., Goa Trip, Dinner, etc."
      value={expenseName}
      onChange={(e) => setExpenseName(e.target.value)}
    />
  </div>


      {!showResult ? (
        <>
          <div className="receipt">
            <p>Receipt</p>
            <div className="receipt-info">
              <h4>New Expense</h4>
              <p>Enter who paid what</p>
            </div>
          </div>

          <div className="members">
          {members.map((m, i) => (
            <div key={i} className="member">
              <h4>{m.name}</h4>

              {/* Expense List */}
              <div className="expense-list">
                {m.expenses.map((e, j) => (
                  <div key={j} className="expense-item">
                    <input
                      type="text"
                      value={e.desc}
                      onChange={(ev) => updateExpenseDesc(i, j, ev.target.value)}
                      placeholder="Expense description"
                    />
                    <input
                      type="number"
                      value={e.amount}
                      onChange={(ev) => updateExpenseAmount(i, j, ev.target.value)}
                      placeholder="₹0.00"
                    />
                  </div>
                ))}
              </div>

              {/* Add new expense for this member */}
              <button onClick={() => addExpense(i)}>+ Add Expense</button>

              {/* Show total automatically */}
              <p><strong>Total:</strong> ₹{m.totalPaid.toFixed(2)}</p>

              {/* Remove button */}
              {m.name !== "Me" && (
                <button className="remove-btn" onClick={() => handleRemoveMember(i)}>
                  ✕ Remove Member
                </button>
              )}
            </div>
          ))}

          {/* Add Member Section */}
          {addingMember ? (
            <div className="add-member">
              <input
                type="text"
                placeholder="Enter name"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
              />
              <button onClick={handleAddMember}>Add</button>
            </div>
          ) : (
            <button className="add-btn" onClick={() => setAddingMember(true)}>
              + Add Member
            </button>
          )}
        </div>


          <button className="confirm-btn" onClick={handleSplit}>
            Confirm Split
          </button>
        </>
      ) : (
        <div className="result">
          <h4>Settlement Summary</h4>
          <p>Total Bill: ₹{result.total.toFixed(2)}</p>
          <p>Each Should Pay: ₹{result.fairShare}</p>
          <ul>
            {result.settlements.length === 0 ? (
              <li>Everyone paid equally ✅</li>
            ) : (
              result.settlements.map((s, i) => (
                <li key={i}>
                  {s.from} ➜ {s.to} ₹{s.amount}
                </li>
              ))
            )}
          </ul>
          <button className="confirm-btn" onClick={() => setShowResult(false)}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitNow;
