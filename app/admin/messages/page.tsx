"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ContactMessage } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import {
  Mail,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Search,
  Clock,
  User,
  Inbox,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading messages:", error);
      } else if (data) {
        setMessages(data as ContactMessage[]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleReadStatus = async (msg: ContactMessage) => {
    const newStatus = !msg.is_read;
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
    );

    try {
      await supabase
        .from("contact_messages")
        .update({ is_read: newStatus })
        .eq("id", msg.id);
    } catch (err) {
      console.error("Failed to update read status:", err);
      fetchMessages();
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (unreadIds.length === 0) return;

    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));

    try {
      await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .in("id", unreadIds);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchMessages();
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", selectedMessage.id);

      if (error) throw error;

      setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
      setDeleteModalOpen(false);
      setSelectedMessage(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Messages"
        description="View and manage visitor inquiries, collaboration proposals, and messages received via the website contact form."
        badge={`${unreadCount} Unread`}
        icon={Mail}
        iconColor="from-indigo-500 to-cyan-600"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMessages()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search sender, email, topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "unread"
                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "read"
                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
          <p className="text-xs text-neutral-400">Loading messages from database...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-20 px-4 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Messages Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchTerm
              ? `No messages matched your search term "${searchTerm}".`
              : "When visitors submit inquiries through your website, they will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl p-5 border transition-all ${
                !msg.is_read
                  ? "bg-gradient-to-r from-indigo-950/40 via-neutral-900 to-neutral-900/90 border-indigo-500/40 shadow-lg shadow-indigo-950/20"
                  : "bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-neutral-800/80">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      !msg.is_read
                        ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                      {!msg.is_read && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5 flex-wrap">
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        {msg.email}
                      </a>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleReadStatus(msg)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      msg.is_read
                        ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                        : "bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{msg.is_read ? "Mark Unread" : "Mark Read"}</span>
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent(
                      `Re: ${msg.subject || "Collaboration Inquiry"}`
                    )}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedMessage(msg);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subject */}
              {msg.subject && (
                <div className="mt-3 text-xs font-bold text-white flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    Subject
                  </span>
                  <span>{msg.subject}</span>
                </div>
              )}

              {/* Message Body */}
              <div className="mt-3 p-4 rounded-xl bg-neutral-950/70 border border-neutral-850 text-xs sm:text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Message"
        message={`Are you sure you want to permanently delete the message from "${selectedMessage?.name}" (${selectedMessage?.email})?`}
        confirmText="Delete"
        isDanger={true}
        loading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedMessage(null);
        }}
      />
    </div>
  );
}
