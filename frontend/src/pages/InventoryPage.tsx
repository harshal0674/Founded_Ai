import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  PackagePlus,
  X
} from "lucide-react";
import { api } from "../api/client";
import { Product, ProductCreate } from "../types";

export const InventoryPage: React.FC = () => {
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
  const [restockQty, setRestockQty] = useState<number>(25);

  const [formData, setFormData] = useState<ProductCreate>({
    name: "",
    sku: "",
    category: "Electronics",
    current_stock: 50,
    min_stock_level: 20,
    unit_cost: 5.0,
    selling_price: 12.0,
    lead_time_days: 7,
    supplier_name: "Direct Global Supply",
    supplier_email: "orders@globalsupply.example"
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
  }, [search, selectedCategory, selectedStatus]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await api.createProduct(formData);
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
      await api.updateProduct(activeProduct.id, formData);
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
      await api.restockProduct(activeProduct.id, restockQty);
      setIsRestockModalOpen(false);
      setActiveProduct(null);
      loadProducts();
    } catch (err: any) {
      alert(`Restock error: ${err.message}`);
    } finally {
      setFormLoading(false);
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
      supplier_email: p.supplier_email || ""
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
      sku: "",
      category: "Electronics",
      current_stock: 50,
      min_stock_level: 20,
      unit_cost: 5.0,
      selling_price: 12.0,
      lead_time_days: 7,
      supplier_name: "Direct Global Supply",
      supplier_email: "orders@globalsupply.example"
    });
    setFormError(null);
  };

  const categories = ["all", "Industrial Sensors", "Computer Hardware", "Electronics", "Packaging", "Office Tech"];

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1D1D20]">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Inventory Catalog
          </h1>
          <p className="text-xs md:text-sm text-apple-text-secondary mt-1">
            Complete SKU lifecycle, on-hand thresholds, valuation, and supplier lead times.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="apple-btn-primary text-xs py-2 px-4 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 apple-card p-3.5">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-text-secondary" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#18181C] border border-[#26262B] rounded-xl text-white placeholder-apple-text-tertiary focus:outline-none focus:border-apple-blue-bright"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-[#18181C] border border-[#26262B] rounded-xl text-apple-text focus:outline-none focus:border-apple-blue-bright"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-[#18181C] border border-[#26262B] rounded-xl text-apple-text focus:outline-none focus:border-apple-blue-bright"
          >
            <option value="all">Status: All</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Warning</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product Table (Apple Clean Table) */}
      <div className="apple-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#151518] border-b border-[#232327] font-mono text-[11px] text-apple-text-secondary">
              <tr>
                <th className="py-3.5 px-5 font-medium">Product / SKU</th>
                <th className="py-3.5 px-5 font-medium">Category</th>
                <th className="py-3.5 px-5 font-medium text-right">On-Hand Stock</th>
                <th className="py-3.5 px-5 font-medium text-right">Min Stock</th>
                <th className="py-3.5 px-5 font-medium text-right">Unit Price</th>
                <th className="py-3.5 px-5 font-medium text-right">Stock Valuation</th>
                <th className="py-3.5 px-5 font-medium">Status</th>
                <th className="py-3.5 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D1D22]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-apple-text-secondary font-mono">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-apple-blue-bright" />
                      <span>Loading inventory catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-apple-text-secondary font-mono">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  let badge = (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-green/10 text-apple-green border border-apple-green/20">
                      In Stock
                    </span>
                  );
                  if (p.stock_status === "low_stock") {
                    badge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-apple-orange/10 text-apple-orange border border-apple-orange/20">
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
                    <tr key={p.id} className="hover:bg-[#16161A] transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="font-mono text-[11px] text-apple-text-secondary">{p.sku}</div>
                      </td>
                      <td className="py-4 px-5 text-apple-text-secondary">{p.category}</td>
                      <td className="py-4 px-5 text-right font-mono font-medium text-white">
                        {p.current_stock.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-apple-text-secondary">
                        {p.min_stock_level}
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-white">
                        ${p.selling_price.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-medium text-white">
                        ${p.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-5">{badge}</td>
                      <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openRestockModal(p)}
                          className="p-1.5 rounded-lg hover:bg-apple-blue/20 text-apple-blue-bright transition-colors"
                          title="Quick Restock"
                        >
                          <PackagePlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg hover:bg-[#25252A] text-apple-text-secondary hover:text-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg hover:bg-apple-red/20 text-apple-red transition-colors"
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

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121214] rounded-2xl border border-[#28282D] w-full max-w-xl shadow-2xl p-6 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#232327]">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {isAddModalOpen ? "New Inventory SKU" : `Edit SKU: ${activeProduct?.sku}`}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-apple-text-secondary hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-apple-red/10 border border-apple-red/30 rounded-xl text-xs text-apple-red">
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
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white focus:outline-none focus:border-apple-blue-bright"
                    placeholder="e.g. Optical Sensor Module"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white font-mono focus:outline-none focus:border-apple-blue-bright"
                    placeholder="e.g. SEN-OPT-01"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white focus:outline-none focus:border-apple-blue-bright"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Computer Hardware">Computer Hardware</option>
                    <option value="Industrial Sensors">Industrial Sensors</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Office Tech">Office Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Current Stock Level *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.current_stock}
                    onChange={(e) => setFormData({ ...formData, current_stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white font-mono focus:outline-none focus:border-apple-blue-bright"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Min Safety Threshold *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({ ...formData, min_stock_level: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white font-mono focus:outline-none focus:border-apple-blue-bright"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Unit Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.unit_cost}
                    onChange={(e) => setFormData({ ...formData, unit_cost: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white font-mono focus:outline-none focus:border-apple-blue-bright"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white font-mono focus:outline-none focus:border-apple-blue-bright"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Lead Time (Days) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.lead_time_days}
                    onChange={(e) => setFormData({ ...formData, lead_time_days: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white font-mono focus:outline-none focus:border-apple-blue-bright"
                  />
                </div>

                <div>
                  <label className="block text-apple-text-secondary font-medium mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={formData.supplier_name || ""}
                    onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                    className="w-full p-2.5 bg-[#18181C] border border-[#28282D] rounded-xl text-white focus:outline-none focus:border-apple-blue-bright"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#232327] flex items-center justify-end space-x-3">
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
                  className="apple-btn-primary text-xs py-2 px-5"
                >
                  {formLoading ? "Saving..." : isAddModalOpen ? "Create Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121214] rounded-2xl border border-[#28282D] w-full max-w-md shadow-2xl p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#232327]">
              <h3 className="text-base font-semibold text-white tracking-tight">
                Restock: {activeProduct.name}
              </h3>
              <button onClick={() => setIsRestockModalOpen(false)} className="text-apple-text-secondary hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#18181C] rounded-xl border border-apple-border space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-apple-text-secondary">Current On-Hand:</span>
                  <span className="text-white font-semibold">{activeProduct.current_stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-secondary">Unit Cost:</span>
                  <span className="text-white">${activeProduct.unit_cost.toFixed(2)}</span>
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
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full p-3 bg-[#18181C] border border-[#28282D] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-apple-blue-bright"
                />
              </div>

              <div className="text-[11px] font-mono text-apple-text-secondary">
                Estimated Capital Outlay: ${(restockQty * activeProduct.unit_cost).toFixed(2)}
              </div>

              <div className="pt-3 border-t border-[#232327] flex items-center justify-end space-x-3">
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
                  className="apple-btn-primary text-xs py-2 px-5"
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
