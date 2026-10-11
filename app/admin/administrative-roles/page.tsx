"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdministrativeRoleItem } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Calendar,
  Layers,
  X,
  Save,
  FileText,
  Clock,
} from "lucide-react";

export default function AdminAdministrativeRolesPage() {
  const supabase = createClient();

  const [items, setItems] = useState<AdministrativeRoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AdministrativeRoleItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<AdministrativeRoleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("administrative_roles")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load administrative roles.");
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  function openCreateModal() {
    setEditingItem({
      position: "",
      start_date: "",
      end_date: "Present",
      responsibilities: "",
      order_index: items.length + 1,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: AdministrativeRoleItem) {
    setEditingItem({
      ...item,
      position: item.position || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      responsibilities: item.responsibilities || "",
      order_index: item.order_index ?? 0,
    });
    setIsModalOpen(true);
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.position?.trim()) {
      setErrorMsg("Position is required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const payload = {
      position: editingItem.position.trim(),
      start_date: editingItem.start_date?.trim() || null,
      end_date: editingItem.end_date?.trim() || null,
      responsibilities: editingItem.responsibilities?.trim() || null,
      order_index: Number(editingItem.order_index) || 0,
    };

    try {
      if (editingItem.id) {
        // Update
        const { error } = await supabase
          .from("administrative_roles")
          .update(payload)
          .eq("id", editingItem.id);

        if (error) throw error;
        setSuccessMsg("Administrative role updated successfully!");
      } else {
        // Create
        const { error } = await supabase
          .from("administrative_roles")
          .insert([payload]);

        if (error) throw error;
        setSuccessMsg("Administrative role created successfully!");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchRoles();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save administrative role.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("administrative_roles")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      setSuccessMsg("Administrative role deleted.");
      setDeleteTarget(null);
      await fetchRoles();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to delete administrative role.");
      }
    } finally {
      setDeleting(false);
    }
  }

  const displayedItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.position.toLowerCase().includes(q) ||
      (item.start_date && item.start_date.toLowerCase().includes(q)) ||
      (item.end_date && item.end_date.toLowerCase().includes(q)) ||
      (item.responsibilities && item.responsibilities.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administrative Roles"
        description="Manage university leadership, administrative appointments, committee responsibilities, and tenures."
        badge="public.administrative_roles"
        icon={ShieldCheck}
        iconColor="from-indigo-500 to-sky-600"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRoles}
              disabled={loading}
              className="p-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
          </div>
        }
      />

      {/* Search Bar & Total count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-400">
            Total Roles: <span className="font-semibold text-white">{items.length}</span>
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search roles, tenure, responsibilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
          <p className="text-xs text-neutral-400">Loading administrative roles...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              No administrative roles yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Add your administrative appointments such as Student Advisor, Officer, Committee Member, etc.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Role</span>
          </button>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <p className="text-xs text-neutral-400">No administrative roles found matching &quot;{searchQuery}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedItems.map((item) => {
            const isCurrent =
              item.end_date?.toLowerCase().includes("present") ||
              item.end_date?.toLowerCase().includes("current") ||
              !item.end_date;

            const durationFormatted =
              item.start_date || item.end_date
                ? `${item.start_date || "Start"} – ${item.end_date || "Present"}`
                : "Duration not specified";

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-5 shadow-lg flex flex-col justify-between hover:border-neutral-700 transition-all space-y-4 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-snug group-hover:text-indigo-300 transition-colors">
                          {item.position}
                        </h3>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active Appointment
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800/80 border border-neutral-700/60 text-neutral-300">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      <span>{durationFormatted}</span>
                    </span>
                  </div>

                  {/* Responsibilities */}
                  {item.responsibilities ? (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Responsibilities
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed line-clamp-4">
                        {item.responsibilities}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs italic text-neutral-600">
                      No specific responsibilities details provided.
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>Order: {item.order_index ?? 0}</span>
                  </span>
                  {item.created_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {editingItem.id ? "Edit Administrative Role" : "Add Administrative Role"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Position */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Position / Role Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Advisor, Industrial Liaison Officer"
                  value={editingItem.position || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, position: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Start Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Sep 2021"
                    value={editingItem.start_date || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, start_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    End Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Sep 2023 or Present"
                    value={editingItem.end_date || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, end_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Order Index */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingItem.order_index ?? 0}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      order_index: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Responsibilities */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Responsibilities & Key Duties
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Advised undergraduate students on academic tracks, organized departmental industrial visits, liaised with corporate partners..."
                  value={editingItem.responsibilities || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      responsibilities: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Administrative Role"
        message={`Are you sure you want to delete the role "${deleteTarget?.position}"? This action cannot be undone.`}
        confirmText="Delete Role"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
