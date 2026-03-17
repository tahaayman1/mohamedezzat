import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiChat, HiRefresh, HiX } from 'react-icons/hi';

const STEPS = [
  {
    key: 'name',
    botMessage: 'مرحبا! يسعدني مساعدتك. ما اسمك؟',
    placeholder: 'اكتب اسمك...',
    validate: (v) => v.trim().length > 0,
    errorMsg: 'من فضلك اكتب اسمك',
  },
  {
    key: 'email',
    botMessage: (data) => `أهلا ${data.name}! ما هو بريدك الإلكتروني؟`,
    placeholder: 'example@email.com',
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    errorMsg: 'من فضلك اكتب بريد إلكتروني صحيح',
  },
  {
    key: 'subject',
    botMessage: 'ما هو عنوان الاستشارة؟',
    placeholder: 'عنوان الاستشارة...',
    validate: (v) => v.trim().length > 0,
    errorMsg: 'من فضلك اكتب عنوان الاستشارة',
  },
  {
    key: 'message',
    botMessage: 'اكتب تفاصيل استشارتك...',
    placeholder: 'اكتب رسالتك هنا...',
    validate: (v) => v.trim().length > 0,
    errorMsg: 'من فضلك اكتب تفاصيل الاستشارة',
  },
];

const SUCCESS_MESSAGE = 'تم إرسال استشارتك بنجاح! سأتواصل معك قريبا إن شاء الله.';
const ERROR_MESSAGE = 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function ChatWindow({ onSubmit, onClose }) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(true);
  const [collected, setCollected] = useState({});
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentStep = STEPS[0];
      setMessages([{ type: 'bot', text: currentStep.botMessage }]);
      setTyping(false);
      inputRef.current?.focus();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addBotMessage = useCallback((text) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'bot', text }]);
      setTyping(false);
      inputRef.current?.focus();
    }, 600);
  }, []);

  const handleSend = async () => {
    const value = input.trim();
    if (!value || typing || submitting) return;

    const currentStep = STEPS[step];

    if (!currentStep.validate(value)) {
      addBotMessage(currentStep.errorMsg);
      return;
    }

    setMessages((prev) => [...prev, { type: 'user', text: value }]);
    setInput('');

    const updatedCollected = { ...collected, [currentStep.key]: value };
    setCollected(updatedCollected);

    const nextStep = step + 1;

    if (nextStep < STEPS.length) {
      setStep(nextStep);
      const nextStepConfig = STEPS[nextStep];
      const botMsg = typeof nextStepConfig.botMessage === 'function'
        ? nextStepConfig.botMessage(updatedCollected)
        : nextStepConfig.botMessage;
      addBotMessage(botMsg);
    } else {
      setSubmitting(true);
      setTyping(true);

      const result = await onSubmit({
        name: updatedCollected.name,
        email: updatedCollected.email,
        subject: updatedCollected.subject,
        message: updatedCollected.message,
      });

      if (result.success) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { type: 'bot', text: SUCCESS_MESSAGE }]);
          setTyping(false);
          setFinished(true);
          setSubmitting(false);
        }, 800);
      } else {
        setTimeout(() => {
          setMessages((prev) => [...prev, { type: 'bot', text: ERROR_MESSAGE }]);
          setTyping(false);
          setError(true);
          setSubmitting(false);
        }, 800);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setStep(0);
    setMessages([]);
    setInput('');
    setCollected({});
    setFinished(false);
    setError(false);
    setSubmitting(false);
    setTyping(true);

    setTimeout(() => {
      setMessages([{ type: 'bot', text: STEPS[0].botMessage }]);
      setTyping(false);
      inputRef.current?.focus();
    }, 600);
  };

  const currentPlaceholder = step < STEPS.length ? STEPS[step].placeholder : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed bottom-24 right-5 sm:right-8 w-[340px] sm:w-[380px] z-[45] flex flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/50"
      style={{
        height: '480px',
        background: 'rgba(10, 10, 10, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <HiChat className="text-white/60" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">{'اطلب استشارة'}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[11px] text-white/40">{'متصل الآن'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200"
          aria-label="Close chat"
        >
          <HiX size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin" dir="rtl">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                  msg.type === 'user'
                    ? 'bg-white text-black rounded-2xl rounded-tl-md font-medium'
                    : 'bg-white/[0.06] text-white/80 rounded-2xl rounded-tr-md border border-white/[0.06]'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="bg-white/[0.06] rounded-2xl rounded-tr-md border border-white/[0.06]">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        {finished || error ? (
          <motion.button
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.97] bg-white text-black hover:bg-white/90"
          >
            <HiRefresh size={16} />
            {'طلب استشارة جديدة'}
          </motion.button>
        ) : (
          <div className="flex items-center gap-2" dir="rtl">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={typing || submitting}
              placeholder={currentPlaceholder}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/90 text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-300 disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={typing || submitting || !input.trim()}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-white flex items-center justify-center text-black transition-all duration-300 hover:bg-white/90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiPaperAirplane size={16} className="-rotate-90" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ConsultationChat({ onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat popup window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow onSubmit={onSubmit} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>

      {/* Floating chat icon button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-5 sm:right-8 z-[45] w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/30 transition-colors duration-300"
        style={{
          background: isOpen ? 'rgba(255,255,255,0.1)' : '#fff',
          border: isOpen ? '1px solid rgba(255,255,255,0.15)' : 'none',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open consultation chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiX size={22} className="text-white/80" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiChat size={22} className="text-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse ring when closed */}
      {!isOpen && (
        <span className="fixed bottom-6 right-5 sm:right-8 z-[44] w-14 h-14 rounded-full pointer-events-none">
          <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2.5s' }} />
        </span>
      )}
    </>
  );
}
