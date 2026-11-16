import React, { useEffect, useState } from "react";
import { ShoppingCart, Plus, RefreshCw, AlertTriangle, CheckCircle2, User, Globe, Store } from "lucide-react";
import { api } from "../api/client";
import { Product, Sale, SaleCreate } from "../types";

export const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Sale Form
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerType, setCustomerType] = useState<string>("retail");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [salesData, prodsData] = await Promise.all([
        api.getSales({ limit: 100 }),
        api.getProducts(),
      ]);
      setSales(salesData);
      setProducts(prodsData);
      if (prodsData.length > 0 && !selectedProductId) {
        setSelectedProductId(prodsData[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load sales and products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const unitPrice = customPrice !== "" ? Number(customPrice) : selectedProduct?.selling_price || 0;
  const totalPrice = (unitPrice * quantity).toFixed(2);
  const isStockInsufficient = selectedProduct ? quantity > selectedProduct.current_stock : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    if (isStockInsufficient) {
      setFormError(`Cannot place order: requested ${quantity} units, but only ${selectedProduct?.current_stock} available.`);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const payload: SaleCreate = {
        product_id: selectedProductId,
        quantity: quantity,
        customer_type: customerType,
        custom_price: customPrice !== "" ? Number(customPrice) : undefined,
        notes: notes || undefined,
      };

      const res = await api.recordSale(payload);
      setFormSuccess(`Sale recorded successfully! Deducted ${quantity} units from inventory.`);
      setQuantity(1);
      setNotes("");
      loadData();
      window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    } catch (err: any) {
      setFormError(err.message || "Failed to record sale");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick stats
  const totalRevenue = sales.reduce((acc, s) => acc + s.total_price, 0);
  const totalUnits = sales.reduce((acc, s) => acc + s.quantity, 0);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[var(--container)] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-rule">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
            Sales Recording & Stock Deduction
          </h1>
          <p className="text-xs md:text-sm text-ink-2 mt-0.5">
            Atomic transactions guarantee non-negative inventory and populate the historical training set for demand ML models.
          </p>
        </div>

        <button
          onClick={loadData}
          className="keycap text-xs py-2 px-3 text-ink-2 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Main Grid: Form on Left, Stats & Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Record Sale Form */}
        <div className="lg:col-span-5 p-5 bg-paper rounded-card border border-rule shadow-card space-y-4 h-fit">
          <div className="flex items-center space-x-2 pb-2 border-b border-rule">
            <ShoppingCart className="w-4 h-4 text-accent" />
            <h3 className="font-display font-semibold text-base text-ink">
              Record New Customer Order
            </h3>
          </div>

          {formSuccess && (
            <div className="p-3 bg-success/10 border border-success/30 rounded text-xs text-success flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Product Selector */}
            <div>
              <label className="block text-muted font-medium mb-1">Select Product SKU *</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setFormError(null);
                }}
                className="w-full p-2.5 bg-paper-2 border border-rule rounded-input text-ink focus:outline-none focus:border-accent text-xs"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — Stock: {p.current_stock}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Stock Banner */}
            {selectedProduct && (
              <div className="p-3 rounded bg-paper-2 border border-rule flex items-center justify-between font-mono text-[11px]">
                <span className="text-muted">On-Hand Stock:</span>
                <span className={`font-semibold ${selectedProduct.current_stock === 0 ? "text-danger" : selectedProduct.current_stock <= selectedProduct.min_stock_level ? "text-amber-600" : "text-success"}`}>
                  {selectedProduct.current_stock} units
                </span>
              </div>
            )}

            {/* Quantity */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-muted font-medium">Quantity to Deduct *</label>
                {isStockInsufficient && (
                  <span className="text-danger font-mono text-[11px]">Exceeds available stock!</span>
                )}
              </div>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => {
                  setQuantity(Math.max(1, Number(e.target.value)));
                  setFormError(null);
                }}
                className={`w-full p-2.5 bg-paper-2 border rounded-input text-ink font-mono text-sm focus:outline-none ${
                  isStockInsufficient ? "border-danger bg-danger/5" : "border-rule focus:border-accent"
                }`}
              />
            </div>

            {/* Customer Channel */}
            <div>
              <label className="block text-muted font-medium mb-1">Sales Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "retail", label: "Retail", icon: Store },
                  { id: "online", label: "Online", icon: Globe },
                  { id: "wholesale", label: "Wholesale", icon: User },
                ].map((c) => {
                  const Icon = c.icon;
                  const isSelected = customerType === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCustomerType(c.id)}
                      className={`py-2 px-2 rounded-input border text-xs flex flex-col items-center justify-center space-y-1 ${
                        isSelected
                          ? "bg-accent-wash border-accent text-accent font-semibold"
                          : "bg-paper-2 border-rule text-ink-2 hover:bg-paper-3"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unit Price Customization (Optional) */}
            <div>
              <label className="block text-muted font-medium mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder={selectedProduct?.selling_price.toFixed(2) || "0.00"}
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full p-2 bg-paper-2 border border-rule rounded-input text-ink font-mono text-xs focus:outline-none focus:border-accent"
              />
              <span className="text-[10px] text-muted">Leave empty to use catalog default (${selectedProduct?.selling_price.toFixed(2)})</span>
            </div>

            {/* Total Price Summary */}
            <div className="p-3 bg-paper-3 rounded border border-rule flex items-center justify-between font-mono text-xs">
              <span className="text-muted">Transaction Total:</span>
              <span className="text-base font-display font-semibold text-ink">${totalPrice}</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || isStockInsufficient || (selectedProduct?.current_stock === 0)}
              className={`w-full keycap text-xs py-2.5 font-semibold flex items-center justify-center space-x-1.5 ${
                isStockInsufficient || (selectedProduct?.current_stock === 0)
                  ? "opacity-50 cursor-not-allowed bg-paper-3 text-muted"
                  : "keycap-primary"
              }`}
            >
              <span>{submitting ? "Processing..." : "Confirm Sale & Deduct Stock"}</span>
            </button>
          </form>
        </div>

        {/* Sales History Ledger */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
              <span className="text-[11px] font-mono text-muted">Orders Logged</span>
              <div className="font-display font-semibold text-xl text-ink mt-0.5">{sales.length}</div>
            </div>
            <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
              <span className="text-[11px] font-mono text-muted">Total Units Sold</span>
              <div className="font-display font-semibold text-xl text-ink mt-0.5">{totalUnits.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-paper rounded-card border border-rule shadow-card">
              <span className="text-[11px] font-mono text-muted">Gross Revenue</span>
              <div className="font-display font-semibold text-xl text-ink mt-0.5">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="rounded-card border border-rule bg-paper shadow-card overflow-hidden">
            <div className="p-3 border-b border-rule bg-paper-2 flex items-center justify-between">
              <span className="font-display font-semibold text-xs text-ink">Recent Sales Ledger</span>
              <span className="font-mono text-[11px] text-muted">Latest 100 entries</span>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper-2 border-b border-rule font-mono text-[11px] text-muted sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Timestamp</th>
                    <th className="py-2.5 px-3 font-medium">Product / SKU</th>
                    <th className="py-2.5 px-3 font-medium text-right">Qty</th>
                    <th className="py-2.5 px-3 font-medium text-right">Total</th>
                    <th className="py-2.5 px-3 font-medium">Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule font-body">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted font-mono">
                        Loading sales transaction history...
                      </td>
                    </tr>
                  ) : sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted font-mono">
                        No sales recorded yet. Use the form on the left or click 'Reload Demo Data'.
                      </td>
                    </tr>
                  ) : (
                    sales.map((s) => (
                      <tr key={s.id} className="hover:bg-paper-2 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-muted whitespace-nowrap">
                          {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-ink truncate max-w-[170px]">{s.product_name}</div>
                          <div className="font-mono text-[10px] text-muted">{s.sku}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-ink">
                          {s.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-ink">
                          ${s.total_price.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 capitalize text-muted font-mono text-[11px]">
                          {s.customer_type}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
