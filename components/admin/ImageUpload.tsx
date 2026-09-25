"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  FileText,
  RefreshCw,
} from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  description?: string;
  accept?: string;
  required?: boolean;
}

export function ImageUpload({
  value = "",
  onChange,
  folder = "uploads",
  label = "Upload Image",
  description = "PNG, JPG, WebP, GIF up to 10MB",
  accept = "image/*",
  required = false,
}: ImageUploadProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const isPdf =
    value?.toLowerCase().endsWith(".pdf") ||
    value?.includes("/resumes/") ||
    value?.includes("application%2Fpdf");

  async function handleFile(file: File) {
    if (!file) return;

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit.");
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Clean and generate unique file path
      const fileExt = file.name.split(".").pop() || "png";
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const fileName = `${Date.now()}_${cleanBaseName}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage bucket 'portfolio-images'
      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        // If error mentions bucket not found, guide the user
        if (
          uploadError.message.toLowerCase().includes("bucket not found") ||
          uploadError.message.toLowerCase().includes("not_found")
        ) {
          throw new Error(
            "Storage bucket 'portfolio-images' not found. Please create it or run the migration in Supabase SQL Editor."
          );
        }
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio-images").getPublicUrl(filePath);

      onChange(publicUrl);
      setSuccessMsg("Uploaded successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      console.error("Storage upload error:", err);
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to upload file to Supabase Storage.");
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleClear() {
    onChange("");
    setErrorMsg(null);
    setSuccessMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {/* Label & Manual Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-neutral-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualUrl ? "Upload File" : "Enter URL Manually"}</span>
        </button>
      </div>

      {/* Manual URL Input Option */}
      {showManualUrl ? (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      ) : (
        /* File Dropzone & Preview */
        <div className="space-y-3">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {value ? (
            /* Current Value Preview Box */
            <div className="relative rounded-2xl bg-neutral-950/90 border border-neutral-800 p-3.5 flex items-center gap-4 group">
              {isPdf ? (
                <div className="w-16 h-16 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col items-center justify-center text-rose-400 shrink-0">
                  <FileText className="w-7 h-7" />
                  <span className="text-[9px] font-bold mt-0.5 uppercase">PDF</span>
                </div>
              ) : (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                  <Image
                    src={value}
                    alt="Uploaded thumbnail"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>File Linked</span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate font-mono" title={value}>
                  {value}
                </p>
              </div>

              {/* Actions: Replace & Clear */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 rounded-xl text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
                  title="Replace file"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${uploading ? "animate-spin" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-neutral-900 hover:bg-red-500/20 border border-neutral-800 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Drop Area */
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                  : "border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 hover:bg-neutral-950/70"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform ${
                  uploading
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "bg-neutral-900 text-neutral-400 group-hover:scale-110"
                }`}
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                ) : (
                  <Upload className="w-5 h-5 text-indigo-400" />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  {uploading ? "Uploading to Supabase Storage..." : "Click or drag & drop to upload"}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{description}</p>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-neutral-900 border border-neutral-800 text-neutral-400">
                <span>Bucket: portfolio-images</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {successMsg && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
