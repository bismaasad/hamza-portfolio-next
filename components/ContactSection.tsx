"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactInfo } from "@/lib/types";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { FadeIn, HoverCard } from "@/components/MotionWrappers";
import { createClient } from "@/lib/supabase/client";

interface ContactSectionProps {
  data: ContactInfo | null;
  showHeader?: boolean;
}

function ResearchGateIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.083.535c-.473-.043-.928-.065-1.364-.065-2.298 0-4.23.622-5.794 1.868C7.382 6.265 6.6 7.925 6.6 10c0 1.22.28 2.308.838 3.265.558.957 1.34 1.697 2.345 2.222a7.65 7.65 0 0 0 3.57.778c.436 0 .89-.022 1.364-.065.02.18.048.358.083.535.035.176.072.322.112.437.243.744.65 1.303 1.213 1.68.565.375 1.255.565 2.073.565 1.055 0 1.944-.316 2.668-.948.723-.632 1.085-1.464 1.085-2.497V2.017C21.94 1.345 21.6.84 20.916.505 20.473.284 19.967.16 19.586 0zm.014 2.164c.29 0 .524.086.7.257.177.172.266.398.266.68v17.798c0 .282-.089.508-.266.68-.176.17-.41.256-.7.256-.292 0-.525-.085-.7-.256-.176-.172-.265-.398-.265-.68V3.1c0-.282.09-.508.266-.68.175-.171.408-.257.7-.257z" />
    </svg>
  );
}

function GoogleScholarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 8a8 8 0 0 1 7.162 5.44L24 9.5 12 0z" />
    </svg>
  );
}

export default function ContactSection({ data, showHeader = true }: ContactSectionProps) {
  const primaryEmail = data?.email || "hamzakhan@ntu.edu.pk";
  const phone = data?.phone || "+92 333 3032982";
  const address = data?.address || "Faisalabad / Gilgit, Pakistan";
  const socialLinks = (data?.social_links as Record<string, string>) || {};

  const obudaEmail = socialLinks.email_obuda || "hamza.khan@uni-obuda.hu";
  const personalEmail = socialLinks.email_personal || "ameer.hamza22@gmail.com";
  const researchGate = socialLinks.researchgate;
  const googleScholar = socialLinks.google_scholar;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Send to server API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || null,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        // Fallback: try inserting directly via browser Supabase client
        const supabase = createClient();
        const { error: directErr } = await supabase.from("contact_messages").insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject.trim() || null,
          message: formData.message.trim(),
          is_read: false,
        });

        if (directErr) {
          throw new Error("Unable to send message. Please try again or use direct email.");
        }
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      console.error("Error submitting contact message:", err);
      setSubmitError(err?.message || "Failed to deliver message. Please contact via direct email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>Connect &amp; Collaborate</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Get In Touch
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Reach out for research collaborations, academic inquiries, guest lectures, or consultation.
              </p>
            </div>
          </FadeIn>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info & Academic Badges */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Email Card */}
            <FadeIn delay={0.1} direction="left">
              <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Official University Email
                      </span>
                      <a
                        href={`mailto:${primaryEmail}`}
                        className="text-sm sm:text-base font-bold text-white hover:text-indigo-400 transition-colors break-all"
                      >
                        {primaryEmail}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(primaryEmail, "official")}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy email"
                  >
                    {copiedText === "official" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Obuda & Personal Emails */}
                <div className="space-y-3 pt-1">
                  {obudaEmail && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-slate-300">
                        <span className="text-[10px] text-slate-500 block">
                          Doctoral School (Obuda Univ.)
                        </span>
                        <a
                          href={`mailto:${obudaEmail}`}
                          className="font-medium hover:text-cyan-400 transition-colors"
                        >
                          {obudaEmail}
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopy(obudaEmail, "obuda")}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      >
                        {copiedText === "obuda" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {personalEmail && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-slate-300">
                        <span className="text-[10px] text-slate-500 block">Personal Email</span>
                        <a
                          href={`mailto:${personalEmail}`}
                          className="font-medium hover:text-cyan-400 transition-colors"
                        >
                          {personalEmail}
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopy(personalEmail, "personal")}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      >
                        {copiedText === "personal" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Phone & Location */}
            <FadeIn delay={0.2} direction="left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {phone && (
                  <HoverCard className="rounded-2xl p-5 glass-card bg-slate-900/50 border border-white/5 space-y-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] text-slate-400 block font-medium">Direct Line</span>
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                    >
                      {phone}
                    </a>
                  </HoverCard>
                )}

                <HoverCard className="rounded-2xl p-5 glass-card bg-slate-900/50 border border-white/5 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400 block font-medium">Affiliation / City</span>
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    {address}
                  </span>
                </HoverCard>
              </div>
            </FadeIn>

            {/* Academic Social Profiles (ResearchGate, Google Scholar) */}
            <FadeIn delay={0.3} direction="left">
              <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Academic &amp; Research Profiles
                </h3>

                <div className="space-y-2.5">
                  {researchGate && (
                    <a
                      href={researchGate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <ResearchGateIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            ResearchGate Profile
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Hamza-Khan-7
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </a>
                  )}

                  {googleScholar && (
                    <a
                      href={googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          <GoogleScholarIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            Google Scholar Citations
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Dr. Hamza Khan
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.2} direction="right">
              <div className="rounded-3xl p-6 sm:p-8 glass-panel border border-white/10 shadow-2xl relative">
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">Send a Message</h3>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 space-y-3"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out. Your message has been received and saved into Dr. Hamza Khan&apos;s notification center.
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => setSubmitted(false)}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                        >
                          Send Another Message
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {submitError && (
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-300">
                            Your Full Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            disabled={isSubmitting}
                            placeholder="e.g. Professor Sarah Jenkins"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-300">
                            Your Email Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            disabled={isSubmitting}
                            placeholder="e.g. sarah@university.edu"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-300">
                          Subject / Topic
                        </label>
                        <input
                          type="text"
                          disabled={isSubmitting}
                          placeholder="e.g. Research Collaboration Inquiry on Computational Fluid Dynamics"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-300">
                          Message Content <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          disabled={isSubmitting}
                          placeholder="Write your inquiry or proposal here..."
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none disabled:opacity-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message to Dr. Hamza</span>
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
