/**
 * 📚 LEARNING NOTE: Admin Products Page
 * 
 * This is where the kids manage their blind bag products.
 * They can add new products, edit existing ones, and control stock.
 * For now we use mock data — later it connects to Supabase.
 */

"use client";

import { useState } from "react";
import { PRODUCTS, THEMES } from "@/lib/mockData";
import styles from "./products-admin.module.css";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "", description: "", theme: "animals", hints: "",
    is_featured: false, is_active: true,
    small_price: 50, small_stock: 0,
    medium_price: 75, medium_stock: 0,
    large_price: 100, large_stock: 0,
  });

  const resetForm = () => {
    setForm({
      name: "", description: "", theme: "animals", hints: "",
      is_featured: false, is_active: true,
      small_price: 50, small_stock: 0,
      medium_price: 75, medium_stock: 0,
      large_price: 100, large_stock: 0,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    const sv = product.variants.find(v => v.size === "small") || {};
    const mv = product.variants.find(v => v.size === "medium") || {};
    const lv = product.variants.find(v => v.size === "large") || {};
    setForm({
      name: product.name, description: product.description,
      theme: product.theme, hints: product.hints,
      is_featured: product.is_featured, is_active: product.is_active,
      small_price: sv.price || 50, small_stock: sv.stock_count || 0,
      medium_price: mv.price || 75, medium_stock: mv.stock_count || 0,
      large_price: lv.price || 100, large_stock: lv.stock_count || 0,
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => {
        if (p.id !== editingProduct.id) return p;
        return {
          ...p, name: form.name, description: form.description,
          theme: form.theme, hints: form.hints,
          is_featured: form.is_featured, is_active: form.is_active,
          variants: [
            { ...p.variants[0], size: "small", price: Number(form.small_price), stock_count: Number(form.small_stock) },
            { ...p.variants[1], size: "medium", price: Number(form.medium_price), stock_count: Number(form.medium_stock) },
            { ...p.variants[2], size: "large", price: Number(form.large_price), stock_count: Number(form.large_stock) },
          ],
        };
      }));
    } else {
      const newId = "prod-" + Date.now();
      setProducts(prev => [...prev, {
        id: newId, name: form.name, description: form.description,
        theme: form.theme, hints: form.hints, images: [],
        is_featured: form.is_featured, is_active: form.is_active,
        variants: [
          { id: `var-${newId}-s`, size: "small", price: Number(form.small_price), stock_count: Number(form.small_stock) },
          { id: `var-${newId}-m`, size: "medium", price: Number(form.medium_price), stock_count: Number(form.medium_stock) },
          { id: `var-${newId}-l`, size: "large", price: Number(form.large_price), stock_count: Number(form.large_stock) },
        ],
      }]);
    }
    resetForm();
  };

  const toggleActive = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h3>{products.length} Products</h3>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Add New Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={resetForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? "Edit Product" : "Add New Product"} 🎁</h3>
            <form onSubmit={handleSave} className={styles.form}>
              <div className="input-group">
                <label>Product Name *</label>
                <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g., Ocean Friends" />
              </div>
              <div className="input-group">
                <label>Description *</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="What makes this bag special?" />
              </div>
              <div className={styles.formRow}>
                <div className="input-group">
                  <label>Theme</label>
                  <select className="input" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})}>
                    {THEMES.filter(t => t.id !== "all").map(t => (
                      <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Hints (what might be inside)</label>
                  <input className="input" value={form.hints} onChange={e => setForm({...form, hints: e.target.value})} placeholder="🐠 Something fishy..." />
                </div>
              </div>

              {/* Size Variants */}
              <h4 className={styles.variantsTitle}>Size Variants & Pricing</h4>
              <div className={styles.variantsGrid}>
                {["small", "medium", "large"].map(size => (
                  <div key={size} className={styles.variantCard}>
                    <span className={styles.variantSize}>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
                    <div className={styles.variantFields}>
                      <div className="input-group">
                        <label>Price (₹)</label>
                        <input type="number" className="input" value={form[`${size}_price`]} onChange={e => setForm({...form, [`${size}_price`]: e.target.value})} min="1" />
                      </div>
                      <div className="input-group">
                        <label>Stock</label>
                        <input type="number" className="input" value={form[`${size}_stock`]} onChange={e => setForm({...form, [`${size}_stock`]: e.target.value})} min="0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkbox}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
                  ⭐ Featured Product
                </label>
                <label className={styles.checkbox}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                  ✅ Active (visible in shop)
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "Save Changes" : "Add Product"} 🎁
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Product</span><span>Theme</span><span>Sizes</span>
          <span>Total Stock</span><span>Status</span><span>Actions</span>
        </div>
        {products.map(product => {
          const totalStock = product.variants.reduce((s, v) => s + v.stock_count, 0);
          return (
            <div key={product.id} className={`${styles.tableRow} ${!product.is_active ? styles.rowInactive : ""}`}>
              <div className={styles.productCell}>
                <span className={styles.productName}>{product.name}</span>
                {product.is_featured && <span className={styles.featuredTag}>⭐</span>}
              </div>
              <span className={styles.themeTag}>
                {THEMES.find(t => t.id === product.theme)?.emoji} {product.theme}
              </span>
              <div className={styles.sizePrices}>
                {product.variants.map(v => (
                  <span key={v.id} className={styles.sizePrice}>
                    {v.size[0].toUpperCase()} ₹{v.price} ({v.stock_count})
                  </span>
                ))}
              </div>
              <span className={`${styles.stockCount} ${totalStock <= 3 ? styles.lowStock : ""}`}>
                {totalStock}
              </span>
              <span className={`${styles.statusTag} ${product.is_active ? styles.active : styles.inactive}`}>
                {product.is_active ? "Active" : "Hidden"}
              </span>
              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => handleEdit(product)} title="Edit">✏️</button>
                <button className={styles.actionBtn} onClick={() => toggleActive(product.id)} title={product.is_active ? "Hide" : "Show"}>
                  {product.is_active ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
