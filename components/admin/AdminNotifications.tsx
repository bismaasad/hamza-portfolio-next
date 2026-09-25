"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ContactMessage } from "@/lib/types";
import {
  Bell,
  Mail,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Loader2,
  RefreshCw,
  X,
  MessageSquare,
  Clock,
  User,
} from "lucide-react";

export function AdminNotifications() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [markingId, setMarkingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.warn("Could not load contact messages:", error.message);
        return;
      }

      if (data) {
        setMessages(data as ContactMessage[]);
      }
    } catch (err) {
      console.warn("Error fetching contact messages:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMessages();

    // Generate unique channel identifier to avoid collision on React remounts
    const channelId = `admin-messages-${Math.random().toString(36).substring(2, 9)}`;

    // Correct Supabase Realtime pattern:
    // 1. Create channel instance
    // 2. Attach .on() postgres_changes listener
    // 3. Call .subscribe()
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact_messages",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    // Fallback polling every 30s
    const interval = setInterval(() => {
      fetchMessages();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchMessages, supabase]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const toggleReadStatus = async (message: ContactMessage, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMarkingId(message.id);
    const newStatus = !message.is_read;

    // Optimistic UI update
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, is_read: newStatus } : m))
    );

    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: newStatus })
        .eq("id", message.id);

      if (error) {
        console.error("Failed to update message status:", error);
        fetchMessages();
      }
    } catch {
      fetchMessages();
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (unreadIds.length === 0) return;

    // Optimistic UI update
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));

    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .in("id", unreadIds);

      if (error) {
        console.error("Failed to mark all as read:", error);
        fetchMessages();
      }
    } catch {
      fetchMessages();
    }
  };

  const deleteMessage = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    // Optimistic update
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Failed to delete message:", error);
        fetchMessages();
      }
    } catch {
      fetchMessages();
    }
  };

  const filteredMessages =
    filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Notification Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
            : unreadCount > 0
            ? "bg-neutral-900/90 border-neutral-700 text-white hover:border-indigo-500/40 hover:bg-neutral-800"
            : "bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-850"
        }`}
        title={`Notifications (${unreadCount} unread)`}
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/50 border border-neutral-900 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px] rounded-2xl bg-neutral-950/98 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>Contact Messages</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => fetchMessages()}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Refresh messages"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter & Bulk Actions Bar */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800/60 text-xs">
              <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    filter === "all"
                      ? "bg-indigo-600 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    filter === "unread"
                      ? "bg-indigo-600 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages List Area */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-850">
            {loading && messages.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                <p className="text-xs">Loading contact messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-neutral-300">
                  {filter === "unread" ? "No unread messages" : "No messages yet"}
                </h4>
                <p className="text-[11px] text-neutral-500 max-w-[240px] mx-auto">
                  {filter === "unread"
                    ? "All messages have been marked as read."
                    : "Inquiries submitted via the contact form will appear here in real-time."}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 transition-colors ${
                    !msg.is_read
                      ? "bg-indigo-950/20 hover:bg-indigo-950/30"
                      : "hover:bg-neutral-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.is_read ? (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white truncate">
                            {msg.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline block truncate"
                        >
                          {msg.email}
                        </a>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => toggleReadStatus(msg, e)}
                        disabled={markingId === msg.id}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          msg.is_read
                            ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                            : "bg-indigo-600/30 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50"
                        }`}
                        title={msg.is_read ? "Mark as unread" : "Mark as read"}
                      >
                        <Check className="w-3 h-3" />
                      </button>

                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(
                          `Re: ${msg.subject || "Inquiry from Portfolio"}`
                        )}`}
                        className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Reply via Email"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={(e) => deleteMessage(msg.id, e)}
                        className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-500/40 transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Subject if exists */}
                  {msg.subject && (
                    <div className="mt-1.5 ml-4 text-[11px] font-semibold text-neutral-300 truncate">
                      <span className="text-neutral-500 font-normal">Topic: </span>
                      {msg.subject}
                    </div>
                  )}

                  {/* Message body */}
                  <p className="mt-1.5 ml-4 text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Dropdown Footer */}
          <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
            <Link
              href="/admin/messages"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Open Full Messages Inbox</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <span className="text-[10px] text-neutral-500">
              Supabase Realtime Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
