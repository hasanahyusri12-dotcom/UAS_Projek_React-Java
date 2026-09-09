import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  ArrowLeft,
} from 'lucide-react';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Loading';

export const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const conversationIdParam = searchParams.get('id');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  const loadConversations = async (autoSelectId = null) => {
    try {
      setLoading(true);
      const data = await chatApi.getConversations();
      setConversations(data || []);

      if (data && data.length > 0) {
        if (autoSelectId) {
          const match = data.find((c) => c.id.toString() === autoSelectId.toString());
          if (match) {
            setActiveConversation(match);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations(conversationIdParam);
  }, [conversationIdParam]);

  // Load messages for active conversation
  const loadMessages = async (convId) => {
    if (!convId) return;
    try {
      const msgs = await chatApi.getMessages(convId);
      setMessages(msgs || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id);

      // Periodic check for new messages
      const interval = setInterval(() => {
        loadMessages(activeConversation.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeConversation?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeConversation?.id) return;

    const content = messageInput.trim();
    setMessageInput('');

    try {
      setSending(true);
      const newMsg = await chatApi.sendMessage(activeConversation.id, content);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      toast.error(err.message || 'Gagal mengirim pesan.');
    } finally {
      setSending(false);
    }
  };

  const handleQuickReply = (text) => {
    setMessageInput(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-[2.5rem] border-2 border-sage-200 shadow-xl shadow-sage-950/5 overflow-hidden h-[78vh] flex flex-col md:flex-row">
        {/* LEFT PANE: Conversation List */}
        <div className={`w-full md:w-80 lg:w-96 border-r-2 border-slate-100 flex flex-col ${activeConversation && 'hidden md:flex'}`}>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-sage-50 via-white to-petrol-50">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sage-700" />
              <span>Pesan Komunitas</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Obrolan koordinasi donatur & penerima
            </p>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <Spinner text="Memuat obrolan..." />
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                Belum ada percakapan aktif. Percakapan dibuat otomatis saat klaim disetujui atau diajukan pertanyaan.
              </div>
            ) : (
              conversations.map((conv) => {
                const partner =
                  user?.username === conv.giver?.username ? conv.receiver : conv.giver;
                const isSelected = activeConversation?.id === conv.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full text-left p-4 transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sage-50/90 border-l-4 border-sage-700'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sage-700 to-petrol-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                      {partner?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm truncate">
                          @{partner?.username}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(conv.lastMessageAt || conv.createdAt).toLocaleDateString(
                            'id-ID',
                            { day: 'numeric', month: 'short' }
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-sage-800 font-bold truncate mt-0.5">
                        📦 {conv.item?.namaBarang || 'Barang'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: Chat History & Input */}
        <div className={`flex-1 flex flex-col bg-slate-50/50 ${!activeConversation && 'hidden md:flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header with Item info */}
              <div className="p-4 sm:p-5 border-b-2 border-slate-100 bg-white flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 md:hidden text-slate-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">
                      @{user?.username === activeConversation.giver?.username
                        ? activeConversation.receiver?.username
                        : activeConversation.giver?.username}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <span>Barang:</span>
                      <Link
                        to={`/items/${activeConversation.item?.id}`}
                        className="text-sage-800 font-bold hover:underline"
                      >
                        {activeConversation.item?.namaBarang}
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  to="/transactions"
                  className="px-3.5 py-1.5 rounded-xl bg-sage-50 text-sage-800 hover:bg-sage-100 text-xs font-extrabold border-2 border-sage-200 transition-colors"
                >
                  Lihat Serah Terima →
                </Link>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium">
                    Mulai percakapan santun untuk koordinasi serah terima barang! 🌱
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?.username === user?.username;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md rounded-2xl px-4.5 py-3 text-sm shadow-xs ${
                            isMe
                              ? 'bg-sage-700 text-white rounded-tr-xs font-medium'
                              : 'bg-white border-2 border-slate-200 text-slate-900 rounded-tl-xs font-medium'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                          {new Date(msg.sentAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="px-4 py-2 bg-white/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar">
                {[
                  'Halo kak, kapan kira-kira bisa diambil?',
                  'Lokasi penjemputan sudah sesuai ya kak?',
                  'Terima kasih banyak atas kebaikannya! 🙏',
                  'Barangnya sudah saya terima dengan baik kak.',
                ].map((quickText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickReply(quickText)}
                    className="shrink-0 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-sage-100 hover:text-sage-900 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer border border-slate-200"
                  >
                    {quickText}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 bg-white border-t-2 border-slate-200 flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Ketik pesan santun..."
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-200 outline-none text-sm text-slate-900 font-medium"
                />
                <Button
                  type="submit"
                  variant="sage"
                  size="md"
                  disabled={!messageInput.trim() || sending}
                  isLoading={sending}
                  className="shrink-0 rounded-2xl font-bold"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-black text-slate-700">Pilih Obrolan</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Pilih salah satu percakapan di sebelah kiri untuk membaca dan membalas pesan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
