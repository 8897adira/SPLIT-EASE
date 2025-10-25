import React, { useState } from "react";
import "../styles/SplitNow.css";
import { calculateSettlements } from "../utils/splitlogic";

const SplitNow = ({ setShowSplitScreen }) => {
  const [members, setMembers] = useState([{ name: "Me", paid: 0 }]);
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

    setMembers([...members, { name: newMember.trim(), paid: 0 }]);
    setNewMember("");
    setAddingMember(false);
  };

  // handle remove member
  const handleRemoveMember = (index) => {
    if (members.length === 1) return alert("You cannot remove all members.");
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  // handle split calculation
  const handleSplit = () => {
    const res = calculateSettlements(members);
    setResult(res);
    setShowResult(true);
  };

  return (
    <div className="split-screen">
      <div className="split-header">
        <button onClick={() => setShowSplitScreen(false)}>←</button>
        <h3>Split Now</h3>
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
                <span>{m.name}</span>
                <input
                  type="number"
                  value={m.paid}
                  onChange={(e) => handleChange(i, e.target.value)}
                  placeholder="₹0.00"
                />
                {m.name !== "Me" && (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveMember(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Add Member */}
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
