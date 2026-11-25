import React, { useEffect, useState } from "react";
import { ShoppingCart, RefreshCw, AlertTriangle, CheckCircle2, User, Globe, Store, Building2 } from "lucide-react";
import { api } from "../api/client";
import { useOrganization } from "../context/OrganizationContext";
import { Product, Sale, SaleCreate } from "../types";
import { formatIndianNumber, parseIndianNumber } from "../utils/currency";

export const SalesPage: React.FC = () => {
  const { organization, formatCurrency, currencySymbol } = useOrganization();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New Sale Form
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [customerType, setCustomerType] = useState<string>("retail");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const unitPrice = customPrice !== "" ? parseIndianNumber(customPrice) : selectedProduct?.selling_price || 0;
  const numQty = quantity === "" ? 0 : parseIndianNumber(quantity);
  const totalPrice = (unitPrice * numQty).toFixed(2);
  const isStockInsufficient = selectedProduct ? numQty > selectedProduct.current_stock : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    const finalQty = parseIndianNumber(quantity);
    if (!finalQty || finalQty <= 0) {
      setFormError("Please enter a valid quantity of at least 1 unit.");
      return;
    }

    if (selectedProduct && finalQty > selectedProduct.current_stock) {
      setFormError(`Cannot place order: requested ${formatIndianNumber(finalQty)} units, but only ${formatIndianNumber(selectedProduct.current_stock)} available.`);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const payload: SaleCreate = {
        product_id: selectedProductId,
        quantity: finalQty,
        customer_type: customerType,
        custom_price: customPrice !== "" ? parseIndianNumber(customPrice) : undefined,
        notes: notes || undefined,
      };

      await api.recordSale(payload);
      setFormSuccess(`Order recorded! Atomically deducted ${formatIndianNumber(finalQty)} units from active inventory.`);
      setQuantity("1");
      setCustomPrice("");
      setNotes("");
      loadData();
      window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    } catch (err: any) {
      setFormError(err.message || "Failed to record sale");
    } finally {
      setSubmitting(false);
    }
  };

  const totalRevenue = sales.reduce((acc, s) => acc + s.total_price, 0);
  const totalUnits = sales.reduce((acc, s) => acc + s.quantity, 0);

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EFE7E4]">
        <div>
          <div className="flex items-center space-x-2 text-[#B76E79] text-xs font-mono mb-1 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span>•</span>
            <span>Point of Sale ({currencySymbol} {organization.currency})</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-apple-text tracking-tight">
            Sales & Order Execution
          </h1>
          <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
            Atomic transactions guarantee zero negative stock and feed the historical training series for ML forecasting.
          </p>
        </div>

        <button
          onClick={loadData}
          className="apple-btn-secondary text-xs py-2 px-3.5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#B76E79]" : ""}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Record Order Card */}
        <div className="lg:col-span-5 apple-card p-6 md:p-7 space-y-5 bg-white border border-[#EFE7E4]">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[#EFE7E4]">
            <ShoppingCart className="w-4 h-4 text-[#B76E79]" />
            <h3 className="font-semibold text-base text-apple-text tracking-tight">
              Record Outbound Order
            </h3>
          </div>

          {formSuccess && (
            <div className="p-3.5 bg-apple-green/10 border border-apple-green/30 rounded-xl text-xs text-apple-green flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3.5 bg-apple-red/10 border border-apple-red/30 rounded-xl text-xs text-apple-red flex items-center space-x-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* SKU Selector */}
            <div>
              <label className="block text-apple-text-secondary font-medium mb-1.5">Select Product *</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setFormError(null);
                }}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15 text-xs"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — Available: {formatIndianNumber(p.current_stock)}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Stock Banner */}
            {selectedProduct && (
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE7E4] flex items-center justify-between font-mono text-[11px]">
                <span className="text-apple-text-secondary">On-Hand Stock:</span>
                <span className={`font-semibold ${selectedProduct.current_stock === 0 ? "text-apple-red" : selectedProduct.current_stock <= selectedProduct.min_stock_level ? "text-apple-orange" : "text-apple-green"}`}>
                  {formatIndianNumber(selectedProduct.current_stock)} units
                </span>
              </div>
            )}

            {/* Quantity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-apple-text-secondary font-medium">Quantity to Deduct *</label>
                {isStockInsufficient && (
                  <span className="text-apple-red font-mono text-[11px] font-semibold">Exceeds on-hand stock!</span>
                )}
              </div>
              <input
                type="text"
                inputMode="numeric"
                required
                value={quantity}
                onChange={(e) => {
                  const val = formatIndianNumber(e.target.value);
                  setQuantity(val);
                  setFormError(null);
                }}
                onBlur={() => {
                  if (quantity === "" || parseIndianNumber(quantity) <= 0) {
                    setQuantity("1");
                  }
                }}
                placeholder="Enter units (e.g. 5)"
                className={`w-full p-2.5 bg-[#FAF8F5] border rounded-xl text-apple-text font-mono text-sm focus:outline-none ${
                  isStockInsufficient ? "border-apple-red bg-apple-red/5" : "border-[#EFE7E4] focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                }`}
              />
            </div>

            {/* Custom Unit Price (Optional override) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-apple-text-secondary font-medium">Custom Unit Price (Optional)</label>
                <span className="text-apple-text-tertiary text-[11px] font-mono">Default: {formatCurrency(selectedProduct?.selling_price || 0)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-text-tertiary font-mono text-xs">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(formatIndianNumber(e.target.value))}
                  placeholder={`Leave blank to use ${formatCurrency(selectedProduct?.selling_price || 0)}`}
                  className="w-full pl-7 pr-3 py-2 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-xs focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                />
              </div>
            </div>

            {/* Sales Channel */}
            <div>
              <label className="block text-apple-text-secondary font-medium mb-1.5">Sales Channel</label>
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
                      className={`py-2.5 px-2 rounded-xl border text-xs flex flex-col items-center justify-center space-y-1 transition-all ${
                        isSelected
                          ? "bg-[#FDF5F6] border-[#F6D9DE] text-[#B76E79] font-semibold shadow-sm"
                          : "bg-[#FAF8F5] border-[#EFE7E4] text-apple-text-secondary hover:text-apple-text"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Price Summary */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EFE7E4] flex items-center justify-between">
              <span className="text-apple-text-secondary text-xs">Total Order Value:</span>
              <span className="text-xl font-bold tracking-tight text-[#B76E79] font-mono">{formatCurrency(Number(totalPrice))}</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || isStockInsufficient || (numQty <= 0) || (selectedProduct?.current_stock === 0)}
              className={`w-full py-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                isStockInsufficient || (numQty <= 0) || (selectedProduct?.current_stock === 0)
                  ? "opacity-40 cursor-not-allowed bg-gray-100 text-apple-text-tertiary"
                  : "apple-btn-primary shadow-glow-blue"
              }`}
            >
              <span>{submitting ? "Processing..." : "Confirm & Atomically Deduct Stock"}</span>
            </button>
          </form>
        </div>

        {/* Sales History Ledger */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="apple-card p-5 bg-white border border-[#EFE7E4]">
              <span className="text-[11px] font-mono text-apple-text-secondary">Orders Dispatched</span>
              <div className="font-bold text-2xl text-apple-text mt-1">{sales.length}</div>
            </div>
            <div className="apple-card p-5 bg-white border border-[#EFE7E4]">
              <span className="text-[11px] font-mono text-apple-text-secondary">Units Sold</span>
              <div className="font-bold text-2xl text-apple-text mt-1">{formatIndianNumber(totalUnits)}</div>
            </div>
            <div className="apple-card p-5 bg-white border border-[#EFE7E4]">
              <span className="text-[11px] font-mono text-apple-text-secondary">Gross Revenue</span>
              <div className="font-bold text-2xl text-[#B76E79] mt-1 font-mono">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="apple-card overflow-hidden bg-white border border-[#EFE7E4]">
            <div className="p-4 border-b border-[#EFE7E4] bg-[#FAF6F4] flex items-center justify-between">
              <span className="font-semibold text-xs text-apple-text">Transaction Movement Stream</span>
              <span className="font-mono text-[11px] text-apple-text-secondary">100 most recent records</span>
            </div>

            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F4] border-b border-[#EFE7E4] font-mono text-[11px] text-apple-text-secondary sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 font-medium">Timestamp</th>
                    <th className="py-3 px-4 font-medium">Product / SKU</th>
                    <th className="py-3 px-4 font-medium text-right">Units</th>
                    <th className="py-3 px-4 font-medium text-right">Total</th>
                    <th className="py-3 px-4 font-medium">Channel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE8]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-apple-text-secondary font-mono">
                        Loading transaction history...
                      </td>
                    </tr>
                  ) : sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-apple-text-secondary font-mono">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    sales.map((s) => (
                      <tr key={s.id} className="hover:bg-[#FCFAF8] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-apple-text-secondary whitespace-nowrap">
                          {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-apple-text truncate max-w-[200px]">{s.product_name}</div>
                          <div className="font-mono text-[10px] text-[#B76E79] font-medium">{s.sku}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-medium text-apple-text">
                          {formatIndianNumber(s.quantity)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-[#B76E79]">
                          {formatCurrency(s.total_price)}
                        </td>
                        <td className="py-3 px-4 capitalize text-apple-text-secondary font-mono text-[11px]">
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
