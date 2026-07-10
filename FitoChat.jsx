import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, X, Bot, Search, FileText, GraduationCap, 
  Upload, Building, MessageCircle, Headphones as Headset, 
  HelpCircle, FileSearch, PenTool, Mic, Bell, Send
} from 'lucide-react';
import { FITO_CONFIG } from '@/lib/fitoConversationTree.js';
import { FITO_TRANSLATIONS } from '@/lib/fitoTranslations.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { cn } from '@/lib/utils.js';

import { createSessionContext, getSessionContext } from '@/lib/fitoSessionContext.js';
import { getIntentionByText } from '@/lib/fitoIntentions.js';
import { findIntentionByFuzzyMatch } from '@/lib/fitoFuzzyMatcher.js';
import { getUserStateData, getAdaptedMenuOptions, getContextualMessage } from '@/lib/fitoUserStateAdapter.js';
import { checkProactiveTriggers, disableProactiveMessage } from '@/lib/fitoProactiveMessages.js';
import { getWelcomeMessage, getClosingMessage } from '@/lib/fitoToneVariants.js';

// Accessibility & Persistence & Context Utils
import { 
  KEYBOARD_KEYS, handleKeyboardNavigation, announceToScreenReader 
} from '@/lib/fitoAccessibility.js';
import { saveFitoState, loadFitoState } from '@/lib/fitoStatePersistence.js';
import { showTypingIndicator } from '@/lib/fitoTypingDelay.js';
import { detectPageContext } from '@/lib/fitoContextDetection.js';

import FitoContactForm from './FitoContactForm.jsx';
import CVAnalyzer from './CVAnalyzer.jsx';
import CoverLetterGenerator from './CoverLetterGenerator.jsx';
import InterviewSimulator from './InterviewSimulator.jsx';
import FitoNotifications from './FitoNotifications.jsx';
import FitoLanguageSelector from './FitoLanguageSelector.jsx';
import FitoConversationHistory from './FitoConversationHistory.jsx';
import FitoProactiveWidget from './FitoProactiveWidget.jsx';
import FitoTypingIndicator from './FitoTypingIndicator.jsx';
import FitoContextualGreeting from './FitoContextualGreeting.jsx';

const iconMap = {
  Search, FileText, GraduationCap, Upload, Building, MessageCircle, 
  Headset, HelpCircle, FileSearch, PenTool, Mic, Bell
};

const FitoChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [view, setView] = useState('menu'); 
  const [availability, setAvailability] = useState({ status: 'offline', color: 'bg-red-500', text: 'Fuera de línea' });
  const [language, setLanguage] = useState('es');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showHistoryPrompt, setShowHistoryPrompt] = useState(false);
  const [pendingConversationData, setPendingConversationData] = useState(null);
  
  const [userState, setUserState] = useState(null);
  const [proactiveTrigger, setProactiveTrigger] = useState(null);
  const [menuOptions, setMenuOptions] = useState([]);

  const [pageContext, setPageContext] = useState(null);
  const [showContextGreeting, setShowContextGreeting] = useState(false);

  const modalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Session Context & Persistence Load
  useEffect(() => {
    createSessionContext();
    const savedState = loadFitoState();
    if (savedState) {
      if (savedState.isOpen !== undefined) setIsOpen(savedState.isOpen);
      if (savedState.view) setView(savedState.view);
      if (savedState.messages?.length > 0) setMessages(savedState.messages);
    }
  }, []);

  // Save Persistence on changes
  useEffect(() => {
    saveFitoState({ isOpen, view, messages });
  }, [isOpen, view, messages]);

  // Context Detection
  useEffect(() => {
    const context = detectPageContext(location.pathname);
    setPageContext(context);
    if (isOpen && context) {
      setShowContextGreeting(true);
    }
  }, [location.pathname, isOpen]);

  // Accessibility Focus Trap & Esc Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      handleKeyboardNavigation(e, modalRef.current, () => toggleChat(false));
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Initialize Language, Session, Availability, and User State
  useEffect(() => {
    const savedLang = user?.idioma_preferido || sessionStorage.getItem('fitoLanguage') || navigator.language.split('-')[0];
    const finalLang = ['es', 'en', 'fr', 'it', 'pt'].includes(savedLang) ? savedLang : 'es';
    setLanguage(finalLang);

    let sid = sessionStorage.getItem('fito_session_id');
    if (!sid) {
      sid = 'fito_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('fito_session_id', sid);
    }
    setSessionId(sid);

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); 

    const handleClickOutside = (e) => {
      if (document.querySelector('[data-radix-popper-content-wrapper]')?.contains(e.target)) return;
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        toggleChat(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    if (user) {
      getUserStateData(user.id).then(state => {
        setUserState(state);
        setMenuOptions(getAdaptedMenuOptions(state, finalLang));
        const trigger = checkProactiveTriggers(state);
        if (trigger && !isOpen) {
          setProactiveTrigger(trigger);
          announceToScreenReader(`Nueva sugerencia de FITO: ${trigger.message}`);
        }
      });
    } else {
      setMenuOptions(getAdaptedMenuOptions(null, finalLang));
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user, language, isOpen]);

  // Initial Fetch if Empty
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadInitialConversation();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        try {
          const records = await pb.collection('notificaciones_fito').getList(1, 1, {
            filter: `usuario_id = "${user.id}" && leida = false`,
            $autoCancel: false
          });
          setUnreadCount(records.totalItems);
        } catch (err) {}
      };
      fetchUnread();
      const unsubscribe = pb.collection('notificaciones_fito').subscribe('*', (e) => {
        if (e.record.usuario_id === user.id) fetchUnread();
      });
      return () => pb.collection('notificaciones_fito').unsubscribe('*');
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const loadInitialConversation = async () => {
    if (user) {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const recentConvs = await pb.collection('conversaciones_fito').getList(1, 1, {
          filter: `usuario_id = "${user.id}" && estado = "activa" && updated >= "${yesterday.toISOString().replace('T', ' ')}"`,
          sort: '-updated',
          $autoCancel: false
        });

        if (recentConvs.items.length > 0) {
          setPendingConversationData(recentConvs.items[0]);
          setShowHistoryPrompt(true);
          return;
        }
      } catch (err) {}
    }
    startNewConversation();
  };

  const startNewConversation = async () => {
    setShowHistoryPrompt(false);
    let welcomeText = getWelcomeMessage(language);
    const contextualMsg = getContextualMessage(userState, language);
    if (contextualMsg) welcomeText += ` ${contextualMsg}`;

    setMessages([{ role: 'fito', text: welcomeText, timestamp: new Date().toISOString() }]);
    
    if (user) {
      if (pendingConversationData) {
        try { await pb.collection('conversaciones_fito').update(pendingConversationData.id, { estado: 'finalizada' }, { $autoCancel: false }); } catch(e) {}
      }
      try {
        const newConv = await pb.collection('conversaciones_fito').create({
          usuario_id: user.id,
          estado: 'activa',
          mensajes: [{ role: 'fito', text: welcomeText, timestamp: new Date().toISOString() }]
        }, { $autoCancel: false });
        setActiveConversationId(newConv.id);
      } catch (err) {}
    }
    setPendingConversationData(null);
  };

  const continueConversation = () => {
    if (pendingConversationData) {
      setMessages(pendingConversationData.mensajes || []);
      setActiveConversationId(pendingConversationData.id);
    }
    setShowHistoryPrompt(false);
    setPendingConversationData(null);
  };

  const saveMessageToDb = async (newMessages) => {
    if (!user || !activeConversationId) return;
    try {
      await pb.collection('conversaciones_fito').update(activeConversationId, {
        mensajes: newMessages,
        fecha_ultima_actividad: new Date().toISOString()
      }, { $autoCancel: false });
    } catch (err) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    const userMsg = { role: 'usuario', text, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInputText('');
    saveMessageToDb(newMessages);
    announceToScreenReader('Mensaje enviado. Esperando respuesta de FITO.');

    let intention = getIntentionByText(text) || findIntentionByFuzzyMatch(text);
    
    setIsTyping(true);
    await showTypingIndicator();
    setIsTyping(false);

    let fitoResponse = "";
    if (intention) {
      fitoResponse = `Entendido. Te redirijo a: ${intention.label}.`;
      handleAction(intention);
    } else {
      fitoResponse = "He anotado tu consulta. Selecciona una herramienta del menú si necesitas ayuda específica.";
    }
    
    const fitoMsg = { role: 'fito', text: fitoResponse, timestamp: new Date().toISOString() };
    const updatedMessages = [...newMessages, fitoMsg];
    setMessages(updatedMessages);
    saveMessageToDb(updatedMessages);
    announceToScreenReader(`Nueva respuesta de FITO: ${fitoResponse}`);
  };

  const checkAvailability = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const { start, end, days } = FITO_CONFIG.workingHours;
    
    if (days.includes(day) && hour >= start && hour < end) {
      setAvailability({ status: 'available', color: 'bg-green-500', text: 'En línea' });
    } else {
      setAvailability({ status: 'offline', color: 'bg-amber-500', text: 'Fuera de horario' });
    }
  };

  const toggleChat = (state) => {
    const newState = state !== undefined ? state : !isOpen;
    setIsOpen(newState);
    announceToScreenReader(newState ? 'Asistente FITO abierto' : 'Asistente FITO cerrado');
    if (!newState) {
      setTimeout(() => {
        setView('menu');
        setShowContextGreeting(false);
      }, 300);
    } else {
      setProactiveTrigger(null);
      if (pageContext) setShowContextGreeting(true);
    }
  };

  const handleAction = (option) => {
    if (option.path || option.target?.startsWith('/')) {
      navigate(option.path || option.target);
      toggleChat(false);
    } else if (option.action === 'whatsapp') {
      window.open(`https://wa.me/${FITO_CONFIG.whatsappNumber}`, '_blank');
      toggleChat(false);
    } else if (option.action === 'navigate') {
      navigate(option.data?.target || '/');
      toggleChat(false);
    } else {
      setView(option.action || option.target || 'menu');
    }
  };

  const handleProactiveAction = (trigger) => {
    disableProactiveMessage(trigger.id);
    setProactiveTrigger(null);
    if (trigger.actionTarget.startsWith('/')) {
      navigate(trigger.actionTarget);
    } else {
      toggleChat(true);
      setView(trigger.actionTarget);
    }
  };

  const isWideView = ['analyze_cv', 'generate_letter', 'practice_interview'].includes(view);
  const t = FITO_TRANSLATIONS[language] || FITO_TRANSLATIONS['es'];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      <FitoProactiveWidget 
        trigger={proactiveTrigger} 
        onAction={handleProactiveAction} 
        onDismiss={() => {
          if (proactiveTrigger) disableProactiveMessage(proactiveTrigger.id);
          setProactiveTrigger(null);
        }} 
      />

      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ventana de asistente virtual FITO"
        aria-hidden={!isOpen}
        className={cn(
          "mb-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col relative",
          isOpen ? "scale-100 opacity-100 h-[85vh] max-h-[700px]" : "scale-0 opacity-0 h-0 pointer-events-none",
          isWideView ? "w-[90vw] md:w-[750px] max-w-[calc(100vw-2rem)]" : "w-[90vw] sm:w-[380px]"
        )}
      >
        {showHistoryPrompt && (
          <FitoConversationHistory language={language} onContinue={continueConversation} onRestart={startNewConversation} />
        )}

        <div className="bg-[hsl(var(--fito-primary))] text-white p-3 flex items-center justify-between shadow-md z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm relative flex-shrink-0">
              <Bot className="w-6 h-6 text-white" aria-hidden="true" />
              <div className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[hsl(var(--fito-primary))]", availability.color)}></div>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">FITO AI</h3>
              <p className="text-xs text-white/80 font-medium" aria-live="polite">{availability.text}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FitoLanguageSelector currentLang={language} onLanguageChange={setLanguage} />
            
            {user && (
              <button 
                onClick={() => setView(view === 'notifications' ? 'menu' : 'notifications')}
                className="relative w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={t.menu.notificaciones}
                aria-expanded={view === 'notifications'}
              >
                <Bell className="w-4 h-4 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[hsl(var(--fito-primary))]"></span>
                )}
              </button>
            )}

            <button 
              onClick={() => toggleChat(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0 ml-1"
              aria-label="Cerrar asistente"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50 dark:bg-background/95 relative">
          {view === 'menu' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4" role="log" aria-live="polite">
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex gap-3 max-w-[85%]", msg.role === 'usuario' ? "ml-auto flex-row-reverse" : "")}>
                    {msg.role === 'fito' && (
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--fito-primary))]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Bot className="w-5 h-5 text-[hsl(var(--fito-primary))]" />
                      </div>
                    )}
                    <div className={cn(
                      "p-3 text-sm rounded-2xl shadow-sm",
                      msg.role === 'usuario' ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm text-foreground"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && <FitoTypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {showContextGreeting && pageContext ? (
                <div className="bg-card border-t border-border shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                  <FitoContextualGreeting 
                    context={pageContext} 
                    onAction={handleAction} 
                    onBackToMenu={() => setShowContextGreeting(false)} 
                  />
                </div>
              ) : (
                <div className="p-3 border-t bg-card border-border">
                  <div 
                    className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar no-scrollbar"
                    role="group"
                    aria-label="Opciones sugeridas de FITO"
                  >
                    {menuOptions.map((option) => {
                      const Icon = iconMap[option.icon] || FileText;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleAction(option)}
                          aria-label={`Acción sugerida: ${option.label}`}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all text-sm whitespace-nowrap flex-shrink-0",
                            option.highlight 
                              ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20" 
                              : "bg-muted/50 border-border hover:border-[hsl(var(--fito-primary))]/50 hover:bg-[hsl(var(--fito-primary))]/5 text-foreground"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", option.highlight ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                          <span className="font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center mt-2">
                    <input 
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder={t.chat.placeholder}
                      aria-label="Escribe tu mensaje para FITO"
                      className="flex-1 text-sm bg-transparent border border-input rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button 
                      type="submit" 
                      disabled={!inputText.trim() || isTyping} 
                      aria-label="Enviar mensaje a FITO"
                      className="w-10 h-10 bg-[hsl(var(--fito-primary))] text-white rounded-full flex items-center justify-center disabled:opacity-50 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {view === 'notifications' && <FitoNotifications language={language} onBack={() => setView('menu')} />}
          {view === 'contact' && <FitoContactForm onBack={() => setView('menu')} onClose={() => toggleChat(false)} />}
          {view === 'analyze_cv' && <CVAnalyzer onBack={() => setView('menu')} sessionContext={getSessionContext()} />}
          {view === 'generate_letter' && <CoverLetterGenerator onBack={() => setView('menu')} sessionContext={getSessionContext()} />}
          {view === 'practice_interview' && <InterviewSimulator onBack={() => setView('menu')} sessionContext={getSessionContext()} />}
        </div>
      </div>

      <button
        onClick={() => toggleChat()}
        aria-label="Abrir asistente FITO AI"
        aria-expanded={isOpen}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--fito-primary))]",
          isOpen ? "bg-muted text-muted-foreground rotate-90" : "bg-[hsl(var(--fito-primary))] text-white hover:bg-[hsl(var(--fito-primary))]/90"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FitoChat;