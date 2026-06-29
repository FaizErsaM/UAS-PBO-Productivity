import React, { useState, useRef, useEffect } from "react";
import { Send, X, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { useAppContext } from "../context/AppContext";

const JiproLogoIcon = ({
  className = "w-6 h-6",
  colorClass = "fill-white",
}: {
  className?: string;
  colorClass?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
  >
    <path
      d="M25 20 C25 20, 25 60, 25 65 C25 80, 75 80, 75 65 C75 60, 75 20, 75 20 C75 14, 85 14, 85 20 C85 65, 85 70, 85 70 C85 95, 15 95, 15 70 L10 85 L20 70 C15 65, 15 20, 15 20 C15 14, 25 14, 25 20 Z"
      className={colorClass}
    />
    <circle cx="50" cy="45" r="8" className={colorClass} />
  </svg>
);

export const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([
    {
      role: "ai",
      content:
        "Halo! Aku Jipro AI Problem Solver. Ada masalah belajar atau tugas yang ingin kamu pecahkan hari ini? Aku siap membantu menganalisis tugas, mengatur strategi habit, dan membantumu melakukan problem solving!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { tasks, habits } = useAppContext();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg,
            context: { tasks, habits },
          }),
        },
      );

      const data = await response.json();
      console.log("Data dari BAckend", data);

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "ai", content: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Sorry, I'm experiencing some difficulties right now. " +
              (data.error || ""),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, there was a network error." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3.5 rounded-full bg-purple text-white shadow-lg shadow-purple/30 hover:bg-purple-light hover:-translate-y-1 transition-all flex items-center justify-center z-40 group"
      >
        <JiproLogoIcon
          className="w-8 h-8 group-hover:scale-110 transition-transform"
          colorClass="fill-white"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-87.5 max-w-[calc(100vw-3rem)] md:w-100 h-125 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-neutral-light flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-linear-to-r from-navy to-navy-light text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <JiproLogoIcon className="w-5 h-5" colorClass="fill-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    JIPRO AI Problem Solver
                  </h3>
                  <p className="text-[10px] text-purple-200 uppercase font-bold tracking-wider">
                    Asisten Solusi Masalah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <JiproLogoIcon
                        className="w-4.5 h-4.5"
                        colorClass="fill-purple"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm/relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-purple text-white rounded-br-sm"
                        : "bg-white border border-neutral-light text-slate-700 rounded-bl-sm markdown-body"
                    }`}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-start justify-start">
                  <div className="w-7 h-7 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <JiproLogoIcon
                      className="w-[18px] h-[18px]"
                      colorClass="fill-purple"
                    />
                  </div>
                  <div className="bg-white border border-neutral-light rounded-2xl rounded-bl-sm p-3 shadow-sm flex gap-1.5 items-center">
                    <span
                      className="w-1.5 h-1.5 bg-purple/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-purple/60 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-purple/60 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-neutral-light shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me to brainstorm..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple text-white rounded-lg disabled:opacity-50 disabled:bg-slate-300 transition-colors"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
