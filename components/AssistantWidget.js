'use client';

import { useState } from 'react';
import { LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const welcomeMessage = {
  role: 'model',
  content: 'Hello, I can help you explore Silver Connect services and understand how bookings work. What would you like to know?',
};

const suggestions = ['What services do you offer?', 'How do bookings work?'];

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (event, suggestedMessage) => {
    event?.preventDefault();
    const content = (suggestedMessage ?? input).trim();
    if (!content || isSending) return;

    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const history = nextMessages
        .filter((message) => message !== welcomeMessage)
        .slice(-8)
        .map(({ role, content: messageContent }) => ({ role, content: messageContent }));
      if (history[0]?.role === 'model') history.shift();
      const response = await fetch(`${API_BASE_URL}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'The assistant is unavailable.');
      setMessages((current) => [...current, { role: 'model', content: data.reply }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'model',
        content: error.message || 'I could not connect right now. Please try again later.',
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-120">
      {isOpen && (
        <section
          aria-label="Silver Connect AI assistant"
          className="mb-3 flex h-[min(620px,calc(100dvh-6rem))] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#D4AF37] text-slate-950">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">Silver Connect Assistant</h2>
                <p className="mt-0.5 text-xs text-white/65">Service and booking guidance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8F7F2] px-4 py-5" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-auto whitespace-pre-wrap rounded-br-md bg-slate-900 text-white'
                    : 'mr-auto wrap-break-word rounded-bl-md border border-slate-200 bg-white text-slate-700'
                }`}
              >
                {message.role === 'model' ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                      li: ({ children }) => <li className="pl-0.5">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-slate-950">{children}</strong>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : message.content}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={(event) => sendMessage(event, suggestion)}
                    disabled={isSending}
                    className="rounded-full border border-slate-300 bg-white px-3 py-2 text-left text-xs text-slate-700 transition hover:border-[#B18D2E] hover:text-slate-950 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {isSending && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LoaderCircle size={14} className="animate-spin" aria-hidden="true" />
                Preparing a reply...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
            <label className="sr-only" htmlFor="assistant-message">Message the assistant</label>
            <textarea
              id="assistant-message"
              rows={1}
              maxLength={1200}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about services or bookings"
              className="max-h-24 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || isSending}
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white transition hover:bg-[#B18D2E] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
          <p className="bg-white px-4 pb-3 text-[10px] leading-4 text-slate-500">
            AI guidance only. Not for medical advice or emergencies.
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close Silver Connect assistant' : 'Open Silver Connect assistant'}
        aria-expanded={isOpen}
        className="ml-auto grid size-14 place-items-center rounded-full bg-[#D4AF37] text-slate-950 shadow-lg transition hover:bg-[#e2c45f] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        {isOpen ? <X size={22} aria-hidden="true" /> : <MessageCircle size={22} aria-hidden="true" />}
      </button>
    </div>
  );
}