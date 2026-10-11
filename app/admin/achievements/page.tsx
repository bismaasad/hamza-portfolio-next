"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AchievementItem } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Layers,
  X,
  Save,
  Trophy,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export default function AdminAchievementsPage() {
  const supabase = createClient();

  const [items, setItems] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<AchievementItem> | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<AchievementItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load achievements.");
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  function openCreateModal() {
    setEditingItem({
      title: "",
      description: "",
      year: new Date().getFullYear().toString(),
      image_url: "",
      order_index: items.length + 1,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: AchievementItem) {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title?.trim()) {
      setErrorMsg("Achievement title is required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingItem.id) {
        // Update
        const { error } = await supabase
          .from("achievements")
          .update({
            title: editingItem.title.trim(),
            description: editingItem.description?.trim() || null,
            year: editingItem.year?.trim() || null,
            image_url: editingItem.image_url?.trim() || null,
            order_index: Number(editingItem.order_index) || 0,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        setSuccessMsg("Achievement updated successfully!");
      } else {
        // Create
        const { error } = await supabase.from("achievements").insert([
          {
            title: editingItem.title.trim(),
            description: editingItem.description?.trim() || null,
            year: editingItem.year?.trim() || null,
            image_url: editingItem.image_url?.trim() || null,
            order_index: Number(editingItem.order_index) || 0,
          },
        ]);

        if (error) throw error;
        setSuccessMsg("Achievement created successfully!");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchAchievements();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save achievement.");
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
        .from("achievements")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      setSuccessMsg("Achievement deleted.");
      setDeleteTarget(null);
      await fetchAchievements();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to delete achievement.");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Achievements &amp; Honors"
        description="Manage awards, academic honors, scholarships, fellowship certificates, and recognition records."
        badge="public.achievements"
        icon={Award}
        iconColor="from-amber-500 to-yellow-600"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAchievements}
              disabled={loading}
              className="p-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Achievement</span>
            </button>
          </div>
        }
      />

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
          <p className="text-xs text-neutral-400">Loading achievements...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              No achievements recorded yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Add your merit awards, doctoral honors, and fellowship certificates.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Achievement</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-5 shadow-lg flex flex-col justify-between hover:border-neutral-700 transition-all space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header: Year Badge & Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                      <Award className="w-4 h-4" />
                    </div>
                    {item.year ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-neutral-800 text-amber-300 border border-neutral-700 font-mono text-[11px] font-semibold">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>{item.year}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-500 italic">No year</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      title="Edit Achievement"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Delete Achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Image Preview (if present) */}
                {item.image_url && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <a
                      href={item.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] flex items-center gap-1 backdrop-blur-sm border border-white/10"
                      title="View original image"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </a>
                  </div>
                )}

                {/* Title */}
                <h3 className="font-bold text-white text-base leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Footer info: Order & Creation Date */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>Order: {item.order_index}</span>
                </span>
                <span>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "Active"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {editingItem.id ? "Edit Achievement" : "Add New Achievement"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Achievement / Award Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Education Commission PhD Fellowship"
                  value={editingItem.title || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* Year & Order Index Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 or 2020-2024"
                    value={editingItem.year || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, year: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Description &amp; Key Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Awarding body, criteria, research impact, or honors received..."
                  value={editingItem.description || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-y"
                />
              </div>

              {/* Certificate / Award Image Upload */}
              <div className="space-y-1.5">
                <ImageUpload
                  label="Award / Certificate Image (Optional)"
                  description="Upload certificate photo or badge (PNG, JPG, WebP up to 10MB)"
                  value={editingItem.image_url || ""}
                  onChange={(url) =>
                    setEditingItem({
                      ...editingItem,
                      image_url: url,
                    })
                  }
                  folder="achievements"
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Achievement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Achievement"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
