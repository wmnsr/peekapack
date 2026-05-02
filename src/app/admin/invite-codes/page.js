/**
 * 📚 LEARNING NOTE: Admin Invite Codes Page
 * 
 * Invite codes prevent random people from placing fake orders.
 * Only people who know the code (shared privately) can order.
 * The admin can create, view, and deactivate codes here.
 */

"use client";

import { useState } from "react";
import styles from "./codes-admin.module.css";

const INITIAL_CODES = [
  { id: 1, code: "SUNSHINE2026", label: "Society WhatsApp Group", isActive: true, timesUsed: 5, createdAt: "1 May 2026" },
  { id: 2, code: "PEEKAPACK", label: "General Code", isActive: true, timesUsed: 8, createdAt: "1 May 2026" },
  { id: 3, code: "FAMILYFUN", label: "Relatives", isActive: true, timesUsed: 3, createdAt: "1 May 2026" },
];

export default function AdminInviteCodesPage() {
  const [codes, setCodes] = useState(INITIAL_CODES);
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const addCode = (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCodes(prev => [...prev, {
      id: Date.now(),
      code: newCode.trim().toUpperCase(),
      label: newLabel.trim() || "New Code",
      isActive: true,
      timesUsed: 0,
      createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    }]);
    setNewCode("");
    setNewLabel("");
  };

  const toggleCode = (id) => {
    setCodes(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCode = (id) => {
    if (confirm("Delete this invite code?")) {
      setCodes(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className={styles.page}>
      <p className={styles.desc}>
        Share these codes privately with society members and relatives. 
        Buyers need a valid code to place orders — this prevents fake orders! 🔐
      </p>

      {/* Add New Code */}
      <form className={styles.addForm} onSubmit={addCode}>
        <div className="input-group">
          <label>New Code *</label>
          <input
            className="input"
            value={newCode}
            onChange={e => setNewCode(e.target.value.toUpperCase())}
            placeholder="e.g., SUMMER2026"
            required
            style={{ textTransform: "uppercase" }}
          />
        </div>
        <div className="input-group">
          <label>Label (who is this for?)</label>
          <input
            className="input"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="e.g., Society Group B"
          />
        </div>
        <button type="submit" className="btn btn-primary">+ Add Code</button>
      </form>

      {/* Codes List */}
      <div className={styles.codesList}>
        {codes.map(code => (
          <div key={code.id} className={`${styles.codeCard} ${!code.isActive ? styles.codeInactive : ""}`}>
            <div className={styles.codeMain}>
              <span className={styles.codeValue}>{code.code}</span>
              <span className={styles.codeLabel}>{code.label}</span>
            </div>
            <div className={styles.codeMeta}>
              <span>Used {code.timesUsed} times</span>
              <span>Created {code.createdAt}</span>
            </div>
            <div className={styles.codeActions}>
              <button
                className={`${styles.toggleBtn} ${code.isActive ? styles.toggleActive : styles.toggleInactive}`}
                onClick={() => toggleCode(code.id)}
              >
                {code.isActive ? "✅ Active" : "⛔ Disabled"}
              </button>
              <button className={styles.deleteBtn} onClick={() => deleteCode(code.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
