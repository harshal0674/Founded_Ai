import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  PackagePlus,
  X,
  Sparkles,
  Building2,
  ArrowRight
} from "lucide-react";
import { api } from "../api/client";
import { useOrganization } from "../context/OrganizationContext";
import { Product, ProductCreate } from "../types";

export const InventoryPage: React.FC = () => {
  const { organization, formatCurrency, currencySymbol, clearCatalog, reloadDemoData } = useOrganization();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Form states
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState<number | string>(25);

  const [formData, setFormData] = useState<any>({
    name: "",
    sku: "",
    category: "Retail & FMCG",
    current_stock: 50,
    min_stock_level: 15,
    unit_cost: 250.0,
    selling_price: 499.0,
    lead_time_days: 5,
    supplier_name: "Direct Wholesale Supply",
    supplier_email: "orders@wholesalepartner.example"
  });

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts({
        search: search || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      });
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const handleRefresh = () => loadProducts();
    window.addEventListener("stockmind:refresh", handleRefresh);
    return () => window.removeEventListener("stockmind:refresh", handleRefresh);
  }, [search, selectedCategory, selectedStatus]);

  const generateAutoSku = () => {
    const prefix = formData.category.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "SKU");
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev: any) => ({ ...prev, sku: `${prefix}-${rand}` }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const payload: ProductCreate = {
        ...formData,
        current_stock: Number(formData.current_stock) || 0,
        min_stock_level: Number(formData.min_stock_level) || 0,
        unit_cost: Number(formData.unit_cost) || 0,
        selling_price: Number(formData.selling_price) || 0,
        lead_time_days: Number(formData.lead_time_days) || 1,
      };
      await api.createProduct(payload);
      setIsAddModalOpen(false);
      resetForm();
      loadProducts();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    setFormLoading(true);
    setFormError(null);
    try {
      const payload = {
        ...formData,
        current_stock: Number(formData.current_stock) || 0,
        min_stock_level: Number(formData.min_stock_level) || 0,
        unit_cost: Number(formData.unit_cost) || 0,
        selling_price: Number(formData.selling_price) || 0,
        lead_time_days: Number(formData.lead_time_days) || 1,
      };
      await api.updateProduct(activeProduct.id, payload);
      setIsEditModalOpen(false);
      setActiveProduct(null);
      loadProducts();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    setFormLoading(true);
    try {
      await api.restockProduct(activeProduct.id, Number(restockQty));
      setIsRestockModalOpen(false);
      setActiveProduct(null);
      loadProducts();
      window.dispatchEvent(new CustomEvent("stockmind:refresh"));
    } catch (err: any) {
      alert(`Restock failed: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleClearCatalog = async () => {
    if (!window.confirm("Wipe all products and sales so you can enter your own catalog from scratch?")) {
      return;
    }
    setLoading(true);
    try {
      await clearCatalog();
      loadProducts();
    } catch (e: any) {
      alert(`Error clearing catalog: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      await reloadDemoData();
      loadProducts();
    } catch (e: any) {
      alert(`Seed failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (p: Product) => {
    setActiveProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      current_stock: p.current_stock,
      min_stock_level: p.min_stock_level,
      unit_cost: p.unit_cost,
      selling_price: p.selling_price,
      lead_time_days: p.lead_time_days,
      supplier_name: p.supplier_name,
      supplier_email: p.supplier_email
    });
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const openRestockModal = (p: Product) => {
    setActiveProduct(p);
    setRestockQty(25);
    setIsRestockModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: `SKU-IN-${Math.floor(1000 + Math.random() * 9000)}`,
      category: "Retail & FMCG",
      current_stock: 50,
      min_stock_level: 15,
      unit_cost: 250.0,
      selling_price: 499.0,
      lead_time_days: 5,
      supplier_name: "Direct Wholesale Supply",
      supplier_email: "orders@wholesalepartner.example"
    });
    setFormError(null);
  };

  const defaultCategories = [
    "Retail & FMCG",
    "Groceries & Daily Essentials",
    "Electronics & Gadgets",
    "Computer Hardware",
    "Apparel & Fashion",
    "Industrial Sensors",
    "Packaging",
    "Office Tech",
    "Health & Personal Care",
    "Home & Kitchen"
  ];

  const availableCategories = Array.from(new Set([
    ...defaultCategories,
    ...products.map((p) => p.category).filter(Boolean)
  ]));

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#EFE7E4]">
        <div>
          <div className="flex items-center space-x-2 text-[#B76E79] text-xs font-mono mb-1 font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{organization.name}</span>
            <span>•</span>
            <span>Currency: {currencySymbol} {organization.currency}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-apple-text tracking-tight">
            Inventory & SKU Catalog
          </h1>
          <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
            Manage your store's inventory, stock thresholds, unit costs ({currencySymbol}), and supplier parameters.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {products.length > 0 && (
            <button
              onClick={handleClearCatalog}
              title="Clear all demo products so you can enter your own catalog from scratch"
              className="apple-btn-secondary text-xs py-2 px-3 flex items-center space-x-1.5 text-apple-text-secondary hover:text-apple-red hover:border-apple-red/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Catalog</span>
            </button>
          )}

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="apple-btn-primary text-xs py-2 px-4 flex items-center space-x-1.5 shadow-glow-blue-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 apple-card p-3.5 bg-white border border-[#EFE7E4]">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-text-secondary" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text placeholder-apple-text-tertiary focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
          >
            <option value="all">All Categories ({availableCategories.length})</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (Healthy)</option>
            <option value="low_stock">Low Stock (Alert)</option>
            <option value="out_of_stock">Out of Stock (Zero)</option>
          </select>
        </div>
      </div>

      {/* Empty State Banner when 0 products exist */}
      {!loading && products.length === 0 && (
        <div className="apple-card p-10 md:p-14 text-center space-y-5 border border-dashed border-[#DE9FAD]/60 bg-white">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FDF5F6] border border-[#F6D9DE] flex items-center justify-center text-[#B76E79]">
            <PackagePlus className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-semibold text-apple-text">Your SKU Catalog is Empty</h3>
            <p className="text-xs text-apple-text-secondary leading-relaxed">
              Start adding the products for <strong className="text-apple-text">{organization.name}</strong> to unlock automated stock deduction, ML demand forecasting, and reorder intelligence.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="apple-btn-primary text-xs py-2.5 px-5 flex items-center space-x-2 shadow-glow-blue-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </button>
            <button
              onClick={handleSeedDemo}
              className="apple-btn-secondary text-xs py-2.5 px-4 flex items-center space-x-2 text-apple-text-secondary hover:text-[#B76E79]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Sample Indian Retail SKUs</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Table (Minimalist Clean Light Table) */}
      {(loading || products.length > 0) && (
        <div className="apple-card overflow-hidden bg-white border border-[#EFE7E4]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F4] border-b border-[#EFE7E4] font-mono text-[11px] text-apple-text-secondary">
                <tr>
                  <th className="py-3.5 px-5 font-medium">Product / SKU</th>
                  <th className="py-3.5 px-5 font-medium">Category</th>
                  <th className="py-3.5 px-5 font-medium text-right">On-Hand Stock</th>
                  <th className="py-3.5 px-5 font-medium text-right">Min Stock</th>
                  <th className="py-3.5 px-5 font-medium text-right">Unit Cost ({currencySymbol})</th>
                  <th className="py-3.5 px-5 font-medium text-right">Selling Price ({currencySymbol})</th>
                  <th className="py-3.5 px-5 font-medium text-right">Stock Valuation</th>
                  <th className="py-3.5 px-5 font-medium">Status</th>
                  <th className="py-3.5 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE8]">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-apple-text-secondary font-mono">
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#B76E79]" />
                        <span>Loading inventory catalog for {organization.name}...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    let badge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-green/10 text-apple-green border border-apple-green/20 font-medium">
                        In Stock
                      </span>
                    );
                    if (p.stock_status === "low_stock") {
                      badge = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-orange/10 text-apple-orange border border-apple-orange/20 font-medium">
                          Low Stock
                        </span>
                      );
                    } else if (p.stock_status === "out_of_stock") {
                      badge = (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-red/10 text-apple-red border border-apple-red/20 font-semibold">
                          Stockout
                        </span>
                      );
                    }

                    return (
                      <tr key={p.id} className="hover:bg-[#FCFAF8] transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-semibold text-apple-text">{p.name}</div>
                          <div className="font-mono text-[11px] text-[#B76E79] font-medium">{p.sku}</div>
                        </td>
                        <td className="py-4 px-5 text-apple-text-secondary">{p.category}</td>
                        <td className="py-4 px-5 text-right font-mono font-medium text-apple-text">
                          {p.current_stock.toLocaleString()}
                        </td>
                        <td className="py-4 px-5 text-right font-mono text-apple-text-secondary">
                          {p.min_stock_level}
                        </td>
                        <td className="py-4 px-5 text-right font-mono text-apple-text-secondary">
                          {formatCurrency(p.unit_cost)}
                        </td>
                        <td className="py-4 px-5 text-right font-mono text-apple-text font-semibold">
                          {formatCurrency(p.selling_price)}
                        </td>
                        <td className="py-4 px-5 text-right font-mono font-medium text-[#B76E79]">
                          {formatCurrency(p.total_value)}
                        </td>
                        <td className="py-4 px-5">{badge}</td>
                        <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => openRestockModal(p)}
                            className="p-1.5 rounded-lg hover:bg-[#FDF5F6] text-[#B76E79] transition-colors"
                            title="Quick Restock"
                          >
                            <PackagePlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg hover:bg-[#FAF4F3] text-apple-text-secondary hover:text-apple-text transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg hover:bg-apple-red/15 text-apple-red transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EFE7E4] w-full max-w-xl shadow-apple-elevated p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE7E4]">
              <div>
                <h3 className="text-lg font-semibold text-apple-text tracking-tight">
                  {isAddModalOpen ? "Add New Product SKU" : `Edit SKU: ${activeProduct?.sku}`}
                </h3>
                <p className="text-[11px] text-apple-text-secondary">
                  Organization: <strong className="text-apple-text">{organization.name}</strong> · All prices in {currencySymbol} {organization.currency}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-apple-text-secondary hover:text-apple-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-apple-red/10 border border-apple-red/30 rounded-xl text-xs text-apple-red font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={isAddModalOpen ? handleCreateSubmit : handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="col-span-2">
                  <label className="block text-apple-text-secondary font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                    placeholder="e.g. Basmati Rice 5kg, Boat Earbuds, Tata Tea 500g"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-apple-text-secondary font-medium">SKU Identifier *</label>
                    <button
                      type="button"
                      onClick={generateAutoSku}
                      className="text-[10px] text-[#B76E79] hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Generate</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                    placeholder="e.g. SKU-IN-101"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Current Stock Level *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.current_stock}
                    onChange={(e) => setFormData({ ...formData, current_stock: e.target.value === "" ? "" : Number(e.target.value) })}
                    onBlur={() => {
                      if (formData.current_stock === "") setFormData((prev: any) => ({ ...prev, current_stock: 0 }));
                    }}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Min Alert Threshold *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value === "" ? "" : Number(e.target.value) })}
                    onBlur={() => {
                      if (formData.min_stock_level === "") setFormData((prev: any) => ({ ...prev, min_stock_level: 0 }));
                    }}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Unit Cost ({currencySymbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.unit_cost}
                    onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value === "" ? "" : e.target.value })}
                    onBlur={() => {
                      if (formData.unit_cost === "") setFormData((prev: any) => ({ ...prev, unit_cost: 0 }));
                    }}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                    placeholder="e.g. 250.00"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Selling Price ({currencySymbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value === "" ? "" : e.target.value })}
                    onBlur={() => {
                      if (formData.selling_price === "") setFormData((prev: any) => ({ ...prev, selling_price: 0 }));
                    }}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                    placeholder="e.g. 499.00"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Lead Time (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.lead_time_days}
                    onChange={(e) => setFormData({ ...formData, lead_time_days: e.target.value === "" ? "" : Number(e.target.value) })}
                    onBlur={() => {
                      if (formData.lead_time_days === "" || Number(formData.lead_time_days) <= 0) {
                        setFormData((prev: any) => ({ ...prev, lead_time_days: 1 }));
                      }
                    }}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={formData.supplier_name || ""}
                    onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                    placeholder="e.g. Direct Distributor / Wholesale Partner"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#EFE7E4] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="apple-btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="apple-btn-primary text-xs py-2 px-5 shadow-glow-blue-subtle"
                >
                  {formLoading ? "Saving..." : isAddModalOpen ? "Save & Create SKU" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EFE7E4] w-full max-w-md shadow-apple-elevated p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE7E4]">
              <div>
                <h3 className="text-base font-semibold text-apple-text tracking-tight">
                  Restock: {activeProduct.name}
                </h3>
                <p className="text-[11px] text-[#B76E79] font-mono font-medium">{activeProduct.sku}</p>
              </div>
              <button onClick={() => setIsRestockModalOpen(false)} className="text-apple-text-secondary hover:text-apple-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EFE7E4] space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-apple-text-secondary">Current On-Hand:</span>
                  <span className="text-apple-text font-semibold">{activeProduct.current_stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-secondary">Unit Cost:</span>
                  <span className="text-apple-text">{formatCurrency(activeProduct.unit_cost)}</span>
                </div>
              </div>

              <div>
                <label className="block text-apple-text-secondary font-medium mb-1.5">
                  Replenishment Quantity (Units) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  onBlur={() => {
                    if (restockQty === "" || Number(restockQty) <= 0) {
                      setRestockQty(25);
                    }
                  }}
                  className="w-full p-3 bg-[#FAF8F5] border border-[#EFE7E4] rounded-xl text-apple-text font-mono text-sm focus:outline-none focus:border-[#B76E79] focus:ring-2 focus:ring-[#B76E79]/15"
                />
              </div>

              <div className="text-[11px] font-mono text-apple-text-secondary">
                Estimated Capital Outlay: <strong className="text-apple-text">{formatCurrency((Number(restockQty) || 0) * activeProduct.unit_cost)}</strong>
              </div>

              <div className="pt-3 border-t border-[#EFE7E4] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="apple-btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="apple-btn-primary text-xs py-2 px-5 shadow-glow-blue-subtle"
                >
                  {formLoading ? "Recording..." : "Confirm Inbound Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
