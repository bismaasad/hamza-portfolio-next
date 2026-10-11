"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThesisSupervisionItem } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  UserCheck,
  IdCard,
  Layers,
  X,
  Save,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function AdminThesisSupervisionPage() {
  const supabase = createClient();

  const [items, setItems] = useState<ThesisSupervisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [filterDegree, setFilterDegree] = useState<"All" | "PhD" | "MS or MPhil" | "BS">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ThesisSupervisionItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ThesisSupervisionItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSupervision = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("thesis_supervision")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load thesis supervision records.");
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSupervision();
  }, [fetchSupervision]);

  function openCreateModal() {
    setEditingItem({
      student_name: "",
      registration_number: "",
      reg_no: "",
      thesis_title: "",
      degree_level: "MS or MPhil",
      supervision_role: "Supervisor",
      role: "Supervisor",
      order_index: items.length + 1,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: ThesisSupervisionItem) {
    const regNo = item.registration_number || item.reg_no || "";
    const roleStr = item.supervision_role || item.role || "Supervisor";
    setEditingItem({
      ...item,
      registration_number: regNo,
      reg_no: regNo,
      supervision_role: roleStr,
      role: roleStr,
    });
    setIsModalOpen(true);
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.student_name?.trim()) {
      setErrorMsg("Student name is required.");
      return;
    }

    if (!editingItem.thesis_title?.trim()) {
      setErrorMsg("Thesis title is required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const regValue = editingItem.registration_number?.trim() || editingItem.reg_no?.trim() || null;
    const roleValue = editingItem.supervision_role?.trim() || editingItem.role?.trim() || "Supervisor";

    try {
      if (editingItem.id) {
        // Update
        const { error } = await supabase
          .from("thesis_supervision")
          .update({
            student_name: editingItem.student_name.trim(),
            registration_number: regValue,
            thesis_title: editingItem.thesis_title.trim(),
            degree_level: editingItem.degree_level?.trim() || "MS or MPhil",
            supervision_role: roleValue,
            order_index: Number(editingItem.order_index) || 0,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        setSuccessMsg("Thesis supervision record updated!");
      } else {
        // Create
        const { error } = await supabase.from("thesis_supervision").insert([
          {
            student_name: editingItem.student_name.trim(),
            registration_number: regValue,
            thesis_title: editingItem.thesis_title.trim(),
            degree_level: editingItem.degree_level?.trim() || "MS or MPhil",
            supervision_role: roleValue,
            order_index: Number(editingItem.order_index) || 0,
          },
        ]);

        if (error) throw error;
        setSuccessMsg("Thesis supervision record created!");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchSupervision();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save record.");
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
        .from("thesis_supervision")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      setSuccessMsg("Thesis supervision record deleted.");
      setDeleteTarget(null);
      await fetchSupervision();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to delete record.");
      }
    } finally {
      setDeleting(false);
    }
  }

  // Helper to categorize degree levels
  const getDegreeCategory = (levelStr: string) => {
    const l = (levelStr || "").trim().toUpperCase();
    if (l.includes("PHD") || l.includes("DOCTOR")) return "PhD";
    if (l.includes("MS") || l.includes("MPHIL") || l.includes("MASTER")) return "MS or MPhil";
    if (l.includes("BS") || l.includes("BACHELOR")) return "BS";
    return "MS or MPhil";
  };

  const displayedItems = items.filter((item) => {
    const regNo = (item.registration_number || item.reg_no || "").trim();
    const roleStr = (item.supervision_role || item.role || "Supervisor").trim();

    const matchSearch =
      item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.thesis_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.degree_level && item.degree_level.toLowerCase().includes(searchQuery.toLowerCase())) ||
      roleStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDegree =
      filterDegree === "All" || getDegreeCategory(item.degree_level) === filterDegree;

    return matchSearch && matchDegree;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Thesis Supervision"
        description="Manage PhD, MS / MPhil, and BS research students and thesis supervision records."
        badge="public.thesis_supervision"
        icon={Users}
        iconColor="from-teal-500 to-emerald-600"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSupervision}
              disabled={loading}
              className="p-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supervision Record</span>
            </button>
          </div>
        }
      />

      {/* Degree Level Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {(["All", "PhD", "MS or MPhil", "BS"] as const).map((lvl) => {
            const count =
              lvl === "All"
                ? items.length
                : items.filter((i) => getDegreeCategory(i.degree_level) === lvl).length;
            return (
              <button
                key={lvl}
                onClick={() => setFilterDegree(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  filterDegree === lvl
                    ? "bg-neutral-100 text-neutral-950 font-semibold shadow-sm"
                    : "bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {lvl === "All" ? `All (${count})` : `${lvl} (${count})`}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search students or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-teal-500 transition-all"
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
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-xs text-neutral-400">Loading thesis supervision records...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              No thesis supervision records yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Add PhD, MS/MPhil, or BS students whom you have supervised or co-supervised.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supervision Record</span>
          </button>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <p className="text-xs text-neutral-400">No records found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedItems.map((item) => {
            const roleStr = (item.supervision_role || item.role || "Supervisor").trim();
            const regNo = (item.registration_number || item.reg_no || "").trim();
            const isCo = roleStr.toLowerCase().includes("co-supervisor");
            const degCat = getDegreeCategory(item.degree_level);
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-5 shadow-lg flex flex-col justify-between hover:border-neutral-700 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">
                          {item.student_name}
                        </h3>
                        {regNo && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono mt-0.5">
                            <IdCard className="w-3 h-3 text-neutral-500" />
                            <span>{regNo}</span>
                          </div>
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

                  {/* Badges: Degree Level & Role */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                        degCat === "PhD"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : degCat === "MS or MPhil"
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                          : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      }`}
                    >
                      <GraduationCap className="w-3 h-3" />
                      <span>{item.degree_level}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                        isCo
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{roleStr}</span>
                    </span>
                  </div>

                  {/* Thesis Title */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                      Thesis Title
                    </span>
                    <p className="text-xs text-neutral-200 leading-relaxed">
                      {item.thesis_title}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>Order: {item.order_index}</span>
                  </span>
                  <span>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : ""}
                  </span>
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
              <h3 className="font-bold text-white text-base">
                {editingItem.id ? "Edit Thesis Supervision" : "Add New Supervision Record"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Student Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={editingItem.student_name || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, student_name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* Registration Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 21-NTU-MS-004"
                  value={editingItem.registration_number || editingItem.reg_no || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      registration_number: e.target.value,
                      reg_no: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* Degree Level & Role Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                {/* Degree Level */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Degree Level <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={editingItem.degree_level || "MS or MPhil"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        degree_level: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all cursor-pointer"
                  >
                    <option value="PhD" className="bg-neutral-900 text-white">
                      PhD
                    </option>
                    <option value="MS" className="bg-neutral-900 text-white">
                      MS
                    </option>
                    <option value="MS or MPhil" className="bg-neutral-900 text-white">
                      MS or MPhil
                    </option>
                    <option value="BS" className="bg-neutral-900 text-white">
                      BS
                    </option>
                  </select>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Role <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={editingItem.supervision_role || editingItem.role || "Supervisor"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        supervision_role: e.target.value,
                        role: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all cursor-pointer"
                  >
                    <option value="Supervisor" className="bg-neutral-900 text-white">
                      Supervisor
                    </option>
                    <option value="Co-supervisor" className="bg-neutral-900 text-white">
                      Co-supervisor
                    </option>
                  </select>
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>

              {/* Thesis Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Thesis / Research Title <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Investigation of Heat Transfer in Hybrid Nanofluid Flow over a Stretching Cylinder..."
                  value={editingItem.thesis_title || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      thesis_title: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-y"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Supervision Record"
        message={`Are you sure you want to delete the supervision record for "${deleteTarget?.student_name}"? This action cannot be undone.`}
        confirmText="Delete Record"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
