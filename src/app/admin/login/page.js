/**
 * 📚 LEARNING NOTE: Admin Login Page
 * 
 * This is a standalone login page for admin access.
 * For now it uses a simple password check. When we connect
 * Supabase, it will use proper email/password authentication.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

/* Temporary admin password — will be replaced with Supabase Auth */
const ADMIN_PASSWORD = "peekapack2026";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("peekapack-admin", "true");
      router.push("/admin");
    } else {
      setError("Wrong password! Ask Mom or Dad for the admin password 🔐");
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🎁</div>
        <h1 className={styles.title}>Peek-a-Pack Admin</h1>
        <p className={styles.subtitle}>Enter the secret password to manage your shop!</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className="input-group">
            <label htmlFor="admin-password">Secret Password 🔑</label>
            <input
              id="admin-password"
              type="password"
              className={`input ${error ? styles.inputError : ""}`}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${styles.loginBtn}`}
            disabled={loading}
          >
            {loading ? "Checking... 🔍" : "Enter Shop Admin 🚀"}
          </button>
        </form>

        <p className={styles.hint}>
          💡 Hint: The password is <code>peekapack2026</code>
        </p>
      </div>
    </div>
  );
}
