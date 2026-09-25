"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { HeroSection } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Sparkles,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Eye,
  RefreshCw,
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import Image from "next/image";

export default function AdminHeroPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hero, setHero] = useState<Partial<HeroSection>>({
    title: "",
    subtitle: "",
    image_url: "",
    resume_url: "",
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHero = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("hero")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setHero(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load hero section data.");
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (!hero.title?.trim()) {
        throw new Error("Title is required.");
      }

      if (hero.id) {
        // Update existing record
        const { error } = await supabase
          .from("hero")
          .update({
            title: hero.title.trim(),
            subtitle: hero.subtitle?.trim() || null,
            image_url: hero.image_url?.trim() || null,
            resume_url: hero.resume_url?.trim() || null,
          })
          .eq("id", hero.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from("hero")
          .insert([
            {
              title: hero.title.trim(),
              subtitle: hero.subtitle?.trim() || null,
              image_url: hero.image_url?.trim() || null,
              resume_url: hero.resume_url?.trim() || null,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        if (data) setHero(data);
      }

      setSuccessMsg("Hero section saved successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save hero section.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hero Section"
        description="Configure your hero headline, title, avatar photo, and resume download link."
        badge="public.hero"
        icon={Sparkles}
        iconColor="from-blue-500 to-indigo-600"
        actionButton={
          <button
            onClick={fetchHero}
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
          <p className="text-xs text-neutral-400">Loading hero configuration...</p>
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
                <h2 className="text-sm font-semibold text-white">Edit Details</h2>
                <span className="text-[11px] text-neutral-500">
                  {hero.id ? `ID: ${hero.id.slice(0, 8)}...` : "New Entry"}
                </span>
              </div>

              {/* Title / Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Full Name / Main Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza"
                  value={hero.title || ""}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Subtitle / Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Subtitle / Professional Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer & Full-Stack Developer"
                  value={hero.subtitle || ""}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Profile Image Upload */}
              <ImageUpload
                label="Profile Photo / Portrait"
                description="Upload portrait image to portfolio-images bucket (PNG, JPG, WebP)"
                value={hero.image_url || ""}
                onChange={(url) => setHero({ ...hero, image_url: url })}
                folder="hero"
              />

              {/* Resume Upload / Link */}
              <ImageUpload
                label="Resume / CV Document"
                description="Upload PDF or document to portfolio-images bucket"
                value={hero.resume_url || ""}
                onChange={(url) => setHero({ ...hero, resume_url: url })}
                folder="resumes"
                accept="application/pdf,image/*"
              />

              {/* Save Button */}
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
                      <span>Save Hero Section</span>
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

              <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-950 to-neutral-900 border border-neutral-800 text-center flex flex-col items-center">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/10 mb-4 bg-neutral-900 flex items-center justify-center">
                  {hero.image_url ? (
                    <Image
                      src={hero.image_url}
                      alt={hero.title || "Preview"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-10 h-10 text-neutral-600" />
                  )}
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white">
                  {hero.title || "Your Name"}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  {hero.subtitle || "Your Role & Headline"}
                </p>

                {/* Resume Badge */}
                {hero.resume_url && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-[11px] text-neutral-300">
                    <FileText className="w-3 h-3 text-indigo-400" />
                    <span>Resume Link Configured</span>
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
