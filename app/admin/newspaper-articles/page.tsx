"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { NewspaperArticleItem } from "@/lib/types";
import { isUrduText } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Newspaper,
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
  User,
  BookOpen,
  AlignRight,
  AlignLeft,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export default function AdminNewspaperArticlesPage() {
  const supabase = createClient();

  const [items, setItems] = useState<NewspaperArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<Partial<NewspaperArticleItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Direction toggle for textarea
  const [textDirection, setTextDirection] = useState<"rtl" | "ltr">("rtl");

  // Delete State
  const [deleteTarget, setDeleteTarget] =
    useState<NewspaperArticleItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("newspaper_articles")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load newspaper articles.");
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  function openCreateModal() {
    setEditingItem({
      title: "",
      newspaper_name: "Daily K2",
      publish_date: new Date().toISOString().split("T")[0],
      author_byline: "Dr. Hamza Khan",
      image_url: "",
      article_text: "",
      order_index: items.length + 1,
    });
    setTextDirection("rtl");
    setIsModalOpen(true);
  }

  function openEditModal(item: NewspaperArticleItem) {
    setEditingItem({ ...item });
    // Auto-detect direction from text or default to RTL if Urdu detected
    if (isUrduText(item.article_text || item.title)) {
      setTextDirection("rtl");
    } else {
      setTextDirection("ltr");
    }
    setIsModalOpen(true);
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title?.trim() || !editingItem.newspaper_name?.trim()) {
      setErrorMsg("Article title and Newspaper name are required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingItem.id) {
        // Update
        const { error } = await supabase
          .from("newspaper_articles")
          .update({
            title: editingItem.title.trim(),
            newspaper_name: editingItem.newspaper_name.trim(),
            publish_date: editingItem.publish_date?.trim() || null,
            author_byline: editingItem.author_byline?.trim() || null,
            image_url: editingItem.image_url?.trim() || null,
            article_text: editingItem.article_text?.trim() || null,
            order_index: Number(editingItem.order_index) || 0,
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        setSuccessMsg("Article updated successfully!");
      } else {
        // Create
        const { error } = await supabase.from("newspaper_articles").insert([
          {
            title: editingItem.title.trim(),
            newspaper_name: editingItem.newspaper_name.trim(),
            publish_date: editingItem.publish_date?.trim() || null,
            author_byline: editingItem.author_byline?.trim() || null,
            image_url: editingItem.image_url?.trim() || null,
            article_text: editingItem.article_text?.trim() || null,
            order_index: Number(editingItem.order_index) || 0,
          },
        ]);

        if (error) throw error;
        setSuccessMsg("Article published successfully!");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchArticles();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save newspaper article.");
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
        .from("newspaper_articles")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      setSuccessMsg("Article deleted.");
      setDeleteTarget(null);
      await fetchArticles();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to delete article.");
      }
    } finally {
      setDeleting(false);
    }
  }

  const newspaperPresets = [
    "Daily K2",
    "Daily Ausaf",
    "Daily Baad-e-Shimal",
    "Daily Jang",
    "Daily Express",
    "Daily Dawn",
    "Daily Salamat",
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Newspaper Articles &amp; Columns"
        description="Manage newspaper op-eds, scanned clippings, Urdu columns, and published media articles."
        badge="public.newspaper_articles"
        icon={Newspaper}
        iconColor="from-rose-500 to-pink-600"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchArticles}
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
              <span>Add Article</span>
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
          <p className="text-xs text-neutral-400">Loading newspaper articles...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-rose-400">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              No newspaper articles yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Add your published Urdu columns, opinion pieces, and news clippings.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const isUrdu = isUrduText(item.title);
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-5 shadow-lg flex flex-col justify-between hover:border-neutral-700 transition-all space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Header: Newspaper badge & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold">
                      <Newspaper className="w-3.5 h-3.5" />
                      <span>{item.newspaper_name}</span>
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scanned Image Preview (if present) */}
                  {item.image_url && (
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      <a
                        href={item.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] flex items-center gap-1 backdrop-blur-sm border border-white/10"
                        title="View original scan"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Scan</span>
                      </a>
                    </div>
                  )}

                  {/* Date & Author Byline */}
                  <div className="flex items-center justify-between gap-2 text-xs text-neutral-400">
                    {item.publish_date && (
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>{item.publish_date}</span>
                      </span>
                    )}

                    {item.author_byline && (
                      <span className="flex items-center gap-1 text-[11px] text-neutral-400 truncate">
                        <User className="w-3 h-3 text-neutral-500" />
                        <span>{item.author_byline}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    dir={isUrdu ? "rtl" : "ltr"}
                    className={`font-bold text-white text-base leading-snug ${
                      isUrdu ? "font-urdu text-right leading-[2.0]" : ""
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Article Text Preview */}
                  {item.article_text && (
                    <p
                      dir={isUrduText(item.article_text) ? "rtl" : "ltr"}
                      className={`text-xs text-neutral-400 leading-relaxed line-clamp-3 ${
                        isUrduText(item.article_text)
                          ? "font-urdu text-right"
                          : ""
                      }`}
                    >
                      {item.article_text}
                    </p>
                  )}
                </div>

                {/* Footer Metadata: Order & Text status */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>Order: {item.order_index}</span>
                  </span>

                  <span className="flex items-center gap-1">
                    {item.article_text ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Full Text Included</span>
                      </span>
                    ) : (
                      <span className="text-neutral-500">Scan Only</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {editingItem.id ? "Edit Newspaper Article" : "Add Newspaper Article"}
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
                  Article Title (Urdu / English) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ریاضی کی تعلیم اور جدید سائنسی تحقیق"
                  value={editingItem.title || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  dir={isUrduText(editingItem.title) ? "rtl" : "ltr"}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all ${
                    isUrduText(editingItem.title) ? "font-urdu text-right" : ""
                  }`}
                />
              </div>

              {/* Newspaper Name & Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Newspaper Name <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {newspaperPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        setEditingItem({
                          ...editingItem,
                          newspaper_name: preset,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        editingItem.newspaper_name === preset
                          ? "bg-rose-600/30 border-rose-500 text-rose-300"
                          : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily K2, Daily Ausaf, Baad-e-Shimal..."
                  value={editingItem.newspaper_name || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      newspaper_name: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
              </div>

              {/* Publish Date, Author Byline & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2023-05-14 or 14 May 2023"
                    value={editingItem.publish_date || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        publish_date: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    Author / Byline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Hamza Khan / ڈاکٹر حمزہ خان"
                    value={editingItem.author_byline || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        author_byline: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Scanned Newspaper Clipping Image Upload */}
              <div className="space-y-1.5">
                <ImageUpload
                  label="Newspaper Clipping / Scan Image"
                  description="Upload scanned newspaper clipping (PNG, JPG, WebP up to 10MB)"
                  value={editingItem.image_url || ""}
                  onChange={(url) =>
                    setEditingItem({
                      ...editingItem,
                      image_url: url,
                    })
                  }
                  folder="newspaper-articles"
                />
              </div>

              {/* Large Right-to-Left Textarea for Urdu Article Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-neutral-300">
                    Full Article Text (Urdu / English)
                  </label>

                  {/* RTL / LTR Toggle */}
                  <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 text-xs text-neutral-400">
                    <button
                      type="button"
                      onClick={() => setTextDirection("rtl")}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        textDirection === "rtl"
                          ? "bg-rose-600 text-white"
                          : "hover:text-white"
                      }`}
                    >
                      <AlignRight className="w-3 h-3" />
                      <span>RTL (اردو)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextDirection("ltr")}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        textDirection === "ltr"
                          ? "bg-rose-600 text-white"
                          : "hover:text-white"
                      }`}
                    >
                      <AlignLeft className="w-3 h-3" />
                      <span>LTR</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={8}
                  dir={textDirection}
                  placeholder={
                    textDirection === "rtl"
                      ? "یہاں پر اپنے کالم یا مضمون کا مکمل متن درج کریں..."
                      : "Paste the complete article body text here..."
                  }
                  value={editingItem.article_text || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      article_text: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs sm:text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-y ${
                    textDirection === "rtl"
                      ? "font-urdu text-right leading-[2.2]"
                      : "font-sans leading-relaxed"
                  }`}
                />
                <p className="text-[11px] text-neutral-500">
                  Tip: Adding full article text enables the interactive Reading Mode with font-resizing and Nastaliq typography for visitors.
                </p>
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
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Newspaper Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}" from ${deleteTarget?.newspaper_name}? This action cannot be undone.`}
        confirmText="Delete Article"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
