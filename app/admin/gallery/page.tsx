"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { GalleryItem } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  X,
  Save,
} from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminGalleryPage() {
  const supabase = createClient();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load gallery images.");
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  function openCreateModal() {
    setEditingItem({
      image_url: "",
      caption: "",
      category: "Gilgit Valley",
      order_index: items.length + 1,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: GalleryItem) {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.image_url?.trim()) {
      setErrorMsg("Image URL is required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingItem.id) {
        // Update
        const { error } = await supabase
          .from("gallery")
          .update({
            image_url: editingItem.image_url.trim(),
            caption: editingItem.caption?.trim() || null,
            category: editingItem.category?.trim() || "Gilgit Valley",
            order_index: Number(editingItem.order_index) || 0,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        setSuccessMsg("Gallery item updated!");
      } else {
        // Create
        const { error } = await supabase.from("gallery").insert([
          {
            image_url: editingItem.image_url.trim(),
            caption: editingItem.caption?.trim() || null,
            category: editingItem.category?.trim() || "Gilgit Valley",
            order_index: Number(editingItem.order_index) || 0,
          },
        ]);

        if (error) throw error;
        setSuccessMsg("Gallery image added!");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchGallery();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save gallery item.");
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
        .from("gallery")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      setSuccessMsg("Gallery image deleted.");
      setDeleteTarget(null);
      await fetchGallery();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to delete image.");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        description="Curate photography, project snapshots, speaking events, and visual portfolio assets."
        badge="public.gallery"
        icon={ImageIcon}
        iconColor="from-emerald-500 to-teal-600"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchGallery}
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
              <span>Add Image</span>
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
          <p className="text-xs text-neutral-400">Loading gallery images...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              No gallery images yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Add photos of your work, setups, and milestones.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Image</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-neutral-900/70 border border-neutral-800 overflow-hidden shadow-lg flex flex-col justify-between hover:border-neutral-700 transition-all"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden">
                <Image
                  src={item.image_url}
                  alt={item.caption || "Gallery item"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-neutral-300 line-clamp-2 min-h-[32px]">
                  {item.caption || (
                    <span className="text-neutral-500 italic">No caption</span>
                  )}
                </p>

                <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3" />
                    <span>#{item.order_index}</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-indigo-400 font-medium">
                      {item.category || "Gilgit Valley"}
                    </span>
                  </span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
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
              <h3 className="font-bold text-white text-base">
                {editingItem.id ? "Edit Gallery Image" : "Add Gallery Image"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Gallery Image Upload */}
              <ImageUpload
                label="Gallery Photo"
                description="Upload image to portfolio-images bucket (PNG, JPG, WebP)"
                value={editingItem.image_url || ""}
                onChange={(url) =>
                  setEditingItem({
                    ...editingItem,
                    image_url: url,
                  })
                }
                folder="gallery"
                required
              />

              {/* Caption */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Caption / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scenic lake view at Phander Valley"
                  value={editingItem.caption || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      caption: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Category Tab
                </label>
                <div className="flex gap-2 mb-2">
                  {["Gilgit Valley", "NTU Life"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        setEditingItem({
                          ...editingItem,
                          category: preset,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        editingItem.category === preset
                          ? "bg-indigo-600/30 border-indigo-500 text-indigo-300"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Gilgit Valley, NTU Life, Conferences..."
                  value={editingItem.category || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Image</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Gallery Image"
        message="Are you sure you want to remove this photo from your gallery? This action cannot be undone."
        confirmText="Delete Image"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
