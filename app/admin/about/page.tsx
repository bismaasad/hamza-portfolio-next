"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { AboutSection } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  User,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  RefreshCw,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminAboutPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState<Partial<AboutSection>>({
    content: "",
    image_url: "",
    bio_highlights: [],
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAbout = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("about")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setAbout({
          ...data,
          bio_highlights: Array.isArray(data.bio_highlights)
            ? data.bio_highlights
            : [],
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load about section data.");
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  function addHighlight() {
    if (!highlightInput.trim()) return;
    const current = about.bio_highlights || [];
    if (!current.includes(highlightInput.trim())) {
      setAbout({
        ...about,
        bio_highlights: [...current, highlightInput.trim()],
      });
    }
    setHighlightInput("");
  }

  function removeHighlight(index: number) {
    const current = about.bio_highlights || [];
    setAbout({
      ...about,
      bio_highlights: current.filter((_, i) => i !== index),
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (!about.content?.trim()) {
        throw new Error("About content / bio is required.");
      }

      if (about.id) {
        // Update existing record
        const { error } = await supabase
          .from("about")
          .update({
            content: about.content.trim(),
            image_url: about.image_url?.trim() || null,
            bio_highlights: about.bio_highlights || [],
          })
          .eq("id", about.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("about")
          .insert([
            {
              content: about.content.trim(),
              image_url: about.image_url?.trim() || null,
              bio_highlights: about.bio_highlights || [],
            },
          ])
          .select()
          .single();

        if (error) throw error;
        if (data) setAbout(data);
      }

      setSuccessMsg("About section updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save about section.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="About Me"
        description="Craft your professional narrative, skills, core competencies, and profile photo."
        badge="public.about"
        icon={User}
        iconColor="from-indigo-500 to-violet-600"
        actionButton={
          <button
            onClick={fetchAbout}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
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
          <p className="text-xs text-neutral-400">Loading about configuration...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSave}
              className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 space-y-5 shadow-xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <h2 className="text-sm font-semibold text-white">About Details</h2>
                <span className="text-[11px] text-neutral-500">
                  {about.id ? `ID: ${about.id.slice(0, 8)}...` : "New Entry"}
                </span>
              </div>

              {/* Content / Bio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Biography & Summary <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write a comprehensive description of your background, experience, and passions..."
                  value={about.content || ""}
                  onChange={(e) =>
                    setAbout({ ...about, content: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all leading-relaxed resize-y"
                />
              </div>

              {/* Profile Image Upload */}
              <ImageUpload
                label="About Section Profile Photo"
                description="Upload image to portfolio-images bucket (PNG, JPG, WebP)"
                value={about.image_url || ""}
                onChange={(url) => setAbout({ ...about, image_url: url })}
                folder="about"
              />

              {/* Bio Highlights / Skills */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-300">
                  Key Skills & Highlights Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, TypeScript, PostgreSQL"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addHighlight();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(about.bio_highlights || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(idx)}
                        className="text-neutral-400 hover:text-white"
                        aria-label={`Remove ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!about.bio_highlights || about.bio_highlights.length === 0) && (
                    <span className="text-xs text-neutral-500 italic">
                      No skill tags added yet.
                    </span>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save About Section</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800/80 text-neutral-400">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">
                  Live Preview
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                {about.image_url && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
                    <Image
                      src={about.image_url}
                      alt="About Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">
                    About Overview
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {about.content ||
                      "Your bio content will appear here when you write it..."}
                  </p>
                </div>

                {(about.bio_highlights || []).length > 0 && (
                  <div className="pt-3 border-t border-neutral-900">
                    <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-2 font-medium">
                      Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {about.bio_highlights?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
