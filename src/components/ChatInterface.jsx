import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CHARACTERS, getCharacterById, getDefaultCharacter } from '../data/characters';
import { backgrounds, characterIcons } from '../assets';
import { useTheme } from '../context/ThemeContext';
import CustomizeModal from './CustomizeModal';
import { sendMessage } from '../services/gemini';

/**
 * Chat interface: sidebar (Home, About, Selected AI, Customize, Chats list), main chat per bot,
 * separate conversation per page. Uses CSS variables from data-color-scheme for whole-app theming.
 */
function ChatInterface({ onHome = () => { }, onAbout = () => { } }) {
  const { theme, setTheme } = useTheme();
  const backgroundUrl = backgrounds[theme.backgroundKey] ?? backgrounds.committeeRoom;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const defaultChar = getDefaultCharacter();
  const createNewChat = useCallback((character = defaultChar) => ({
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    characterId: character.id,
    messages: [
      {
        role: 'assistant',
        content: character.defaultGreeting,
        characterId: character.id,
      },
    ],
  }), [defaultChar]);

  const [chats, setChats] = useState(() => [createNewChat(defaultChar)]);
  const [activeChatId, setActiveChatId] = useState(null);

  const resolvedActiveId = activeChatId ?? chats[0]?.id;
  const activeChat = chats.find((c) => c.id === resolvedActiveId) ?? chats[0];
  const selectedCharacter = activeChat
    ? getCharacterById(activeChat.characterId)
    : getDefaultCharacter();
  const messages = activeChat?.messages ?? [];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setMessagesForChat = useCallback((chatId, updater) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: updater(c.messages) } : c
      )
    );
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !resolvedActiveId || isLoading) return;

    const userMessage = { role: 'user', content: trimmed };
    const typingMessage = {
      role: 'assistant',
      content: null, // null content = typing indicator
      characterId: selectedCharacter.id,
      isTyping: true,
    };

    // Append user message + typing indicator
    setMessagesForChat(resolvedActiveId, (prev) => [
      ...prev,
      userMessage,
      typingMessage,
    ]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for the API (exclude typing indicators)
      const currentMessages = [
        ...messages.filter((m) => !m.isTyping),
        userMessage,
      ];

      const responseText = await sendMessage(selectedCharacter, currentMessages);

      // Replace the typing indicator with the real response
      setMessagesForChat(resolvedActiveId, (prev) => {
        const updated = [...prev];
        const typingIdx = updated.findLastIndex((m) => m.isTyping);
        if (typingIdx !== -1) {
          updated[typingIdx] = {
            role: 'assistant',
            content: responseText,
            characterId: selectedCharacter.id,
          };
        }
        return updated;
      });
    } catch (error) {
      console.error('Gemini API error:', error);
      // Replace typing indicator with error message
      setMessagesForChat(resolvedActiveId, (prev) => {
        const updated = [...prev];
        const typingIdx = updated.findLastIndex((m) => m.isTyping);
        if (typingIdx !== -1) {
          updated[typingIdx] = {
            role: 'assistant',
            content: `⚠️ ${error.message || 'Something went wrong. Please try again.'}`,
            characterId: selectedCharacter.id,
            isError: true,
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    const newChat = createNewChat(selectedCharacter);
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  };

  const openOrCreateChatWithCharacter = (char) => {
    const existing = chats.find((c) => c.characterId === char.id);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      const newChat = createNewChat(char);
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
    closeSidebar();
  };

  const deleteChat = (chatId, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== chatId);
      if (next.length === 0) {
        const newChat = createNewChat(defaultChar);
        setActiveChatId(newChat.id);
        return [newChat];
      }
      if (resolvedActiveId === chatId) {
        const idx = prev.findIndex((c) => c.id === chatId);
        const nextActive = next[Math.max(0, idx - 1)] ?? next[0];
        setActiveChatId(nextActive.id);
      }
      return next;
    });
  };

  const otherCharacters = CHARACTERS.filter((c) => c.id !== selectedCharacter.id);

  const getIcon = (char) =>
    char?.iconKey && characterIcons[char.iconKey] ? characterIcons[char.iconKey] : null;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[rgb(var(--scheme-bg))] text-white overflow-hidden ba-mesh">
      {/* Customize modal */}
      <CustomizeModal
        isOpen={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        theme={theme}
        onSave={(next) => setTheme(next)}
      />

      {/* Mobile sidebar backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden="true"
      />

      {/* Left sidebar */}
      <aside
        className={`
          w-64 sm:w-72 flex-shrink-0 flex flex-col bg-[rgb(var(--scheme-sidebar))]/85 border-r border-[rgb(var(--scheme-border))] z-50 sidebar-edge ba-frame
          fixed md:relative inset-y-0 left-0 transform transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 border-b border-[rgb(var(--scheme-border))] flex items-center justify-between md:block safe-top ba-accent-line">
          <div className="space-y-1 md:block flex-1">
            <button
              type="button"
              onClick={() => {
                onHome();
                closeSidebar();
              }}
              className="block w-full text-left text-slate-200 hover:text-white text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-[rgb(var(--scheme-accent-bg))] touch-target sm:min-h-0"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                onAbout();
                closeSidebar();
              }}
              className="block w-full text-left text-slate-200 hover:text-white text-sm font-medium py-2.5 px-3 rounded-lg hover:bg-[rgb(var(--scheme-accent-bg))] touch-target sm:min-h-0"
            >
              About
            </button>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white rounded-lg touch-target sm:min-h-0 sm:min-w-0"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-[rgb(var(--scheme-border))] ba-accent-line">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-[rgb(var(--scheme-accent-bg))] text-[rgb(var(--scheme-accent))]"
            >
              ⚙
            </span>
            Selected AI
          </div>
          <div className="flex items-center gap-3">
            {getIcon(selectedCharacter) ? (
              <img
                src={getIcon(selectedCharacter)}
                alt={selectedCharacter.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[rgb(var(--scheme-border))] flex-shrink-0 animate-glow-pulse"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 border-[rgb(var(--scheme-border))] bg-[rgb(var(--scheme-accent-bg))]"
              >
                {selectedCharacter.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-white truncate">
              {selectedCharacter.displayName}
            </span>
          </div>
        </div>

        <div className="p-4 border-b border-[rgb(var(--scheme-border))] ba-accent-line">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-[rgb(var(--scheme-accent-bg))] text-[rgb(var(--scheme-accent))]"
            >
              🖌
            </span>
            Customize
          </div>
          <button
            type="button"
            onClick={() => {
              setCustomizeOpen(true);
              closeSidebar();
            }}
            className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl border border-[rgb(var(--scheme-border))] text-slate-200 hover:opacity-90 transition text-left"
          >
            <span className="text-sm">Background & color scheme</span>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between gap-2 text-slate-400 text-xs font-medium mb-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-[rgb(var(--scheme-accent-bg))] text-[rgb(var(--scheme-accent))]"
            >
              💬
            </span>
            <span>Chats</span>
          </div>
          <button
            type="button"
            onClick={startNewChat}
            className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl ba-chip hover:opacity-90 hover:scale-[1.02] active:scale-95 border border-[rgb(var(--scheme-border))] text-[rgb(var(--scheme-accent))] text-sm font-semibold mb-3 transition-all duration-200 animate-pop-in"
          >
            + New chat
          </button>
          <ul className="space-y-1">
            {chats.map((chat) => {
              const char = getCharacterById(chat.characterId);
              return (
                <li key={chat.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveChatId(chat.id);
                      closeSidebar();
                    }}
                    className={`flex-1 flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 text-left min-w-0 hover-lift ${chat.id === resolvedActiveId
                      ? 'bg-[rgb(var(--scheme-accent-bg))] border border-[rgb(var(--scheme-border))] shadow-inner'
                      : 'hover:opacity-90 border border-transparent'
                      }`}
                  >
                    {getIcon(char) ? (
                      <img
                        src={getIcon(char)}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-[rgb(var(--scheme-border))] flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[rgb(var(--scheme-assistant-bg))] border border-[rgb(var(--scheme-border))] flex items-center justify-center text-xs flex-shrink-0">
                        {char.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-slate-200 truncate min-w-0">
                      {char.displayName}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => deleteChat(chat.id, e)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition flex-shrink-0"
                    aria-label={`Delete chat with ${char.displayName}`}
                    title="Delete chat"
                  >
                    🗑
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="lg:hidden mt-4 pt-4 border-t border-[rgb(var(--scheme-border))]">
            <div className="text-slate-400 text-xs font-medium mb-2">Other Character AI</div>
            <ul className="space-y-1">
              {otherCharacters.map((char) => (
                <li key={char.id}>
                  <button
                    type="button"
                    onClick={() => {
                      openOrCreateChatWithCharacter(char);
                    }}
                    className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:opacity-90 transition-all duration-200 text-left hover-lift"
                  >
                    {getIcon(char) ? (
                      <img
                        src={getIcon(char)}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-[rgb(var(--scheme-border))] flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[rgb(var(--scheme-assistant-bg))] border border-[rgb(var(--scheme-border))] flex items-center justify-center text-xs flex-shrink-0">
                        {char.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm text-slate-200 truncate">{char.displayName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div
        className="flex-1 flex flex-col min-w-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-[rgb(var(--scheme-bg))]/50 backdrop-blur-md">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[rgb(var(--scheme-border))] safe-top bg-[rgb(var(--scheme-sidebar))]/95 backdrop-blur-md shadow-lg shadow-black/10">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 -ml-2 rounded-xl text-slate-300 hover:text-white hover:opacity-80 touch-target sm:min-h-0 sm:min-w-0"
              aria-label="Open menu"
            >
              <span className="text-xl leading-none">☰</span>
            </button>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {getIcon(selectedCharacter) ? (
                <img
                  src={getIcon(selectedCharacter)}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border-2 border-[rgb(var(--scheme-border))] flex-shrink-0"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 border-2 border-[rgb(var(--scheme-border))] bg-[rgb(var(--scheme-accent-bg))]"
                >
                  {selectedCharacter.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-semibold text-white truncate">
                {selectedCharacter.displayName}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-8 space-y-4 max-w-4xl mx-auto w-full min-w-0 chat-messages">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-[rgb(var(--scheme-assistant-bg))] flex items-center justify-center text-3xl mb-4 animate-float">
                  💬
                </div>
                <p className="text-slate-400 text-sm sm:text-base animate-fade-in-up delay-200">
                  Start the conversation with {selectedCharacter.displayName}.
                </p>
                <p className="text-slate-500 text-xs mt-1">Your messages will appear here.</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const char =
                  msg.role === 'assistant'
                    ? getCharacterById(msg.characterId) ?? selectedCharacter
                    : null;
                const iconSrc = char ? getIcon(char) : null;
                return (
                  <div
                    key={`${msg.role}-${index}`}
                    className={`flex gap-3 sm:gap-4 min-w-0 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    style={{
                      animation: `${msg.role === 'user' ? 'slideInRight' : 'slideInLeft'} 0.4s ease-out both`,
                    }}
                  >
                    {msg.role === 'assistant' &&
                      (iconSrc ? (
                        <img
                          src={iconSrc}
                          alt={char.name}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[rgb(var(--scheme-border))] flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0 flex items-center justify-center text-sm border-2 border-[rgb(var(--scheme-border))] bg-[rgb(var(--scheme-accent-bg))]"
                        >
                          {char?.name?.charAt(0) ?? '?'}
                        </div>
                      ))}
                    <div
                      className={`min-w-0 max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-sm sm:text-base break-words chat-bubble bubble-shadow ${
                        msg.role === 'user'
                          ? 'bg-[rgb(var(--scheme-user-bubble))] text-[rgb(var(--scheme-user-text))] rounded-tr-sm bubble-user'
                          : 'bg-[rgb(var(--scheme-assistant-bg))] text-slate-200 border border-[rgb(var(--scheme-assistant-border))] rounded-tl-sm bubble-assistant'
                      }`}
                    >
                      {msg.isTyping ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      ) : (
                        <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 sm:p-4 md:p-5 border-t border-[rgb(var(--scheme-border))] safe-bottom bg-[rgb(var(--scheme-bg))]/70 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div
              className="flex items-center gap-2 rounded-2xl bg-[rgb(var(--scheme-assistant-bg))] border-2 border-[rgb(var(--scheme-border))] px-3 sm:px-4 py-2.5 transition focus-within:border-[rgb(var(--scheme-input-focus))] min-w-0 overflow-hidden input-glow-ring bubble-shadow"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={isLoading}
                className="flex-1 min-w-0 w-0 bg-transparent px-2 py-2 sm:py-1.5 text-slate-100 placeholder-slate-500 outline-none text-base overflow-x-hidden disabled:opacity-50"
                placeholder={isLoading ? 'Waiting for response...' : 'Ask Anything...'}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading}
                className="p-3 sm:p-2.5 rounded-xl text-white bg-[rgb(var(--scheme-send-bg))] hover:bg-[rgb(var(--scheme-send-hover))] transition-all touch-target sm:min-h-0 sm:min-w-0 disabled:opacity-50 disabled:cursor-not-allowed send-btn-glow"
                aria-label="Send"
              >
                {isLoading ? '⏳' : '✈'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: Other Character AI (desktop) */}
      <aside className="hidden lg:flex w-72 xl:w-80 flex-shrink-0 flex-col bg-[rgb(var(--scheme-sidebar))] border-l border-[rgb(var(--scheme-border))] overflow-hidden sidebar-edge">
        <div className="p-4 border-b border-[rgb(var(--scheme-border))]">
          <div className="text-slate-300 text-sm font-medium mb-2">Selected AI</div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[rgb(var(--scheme-assistant-bg))] bubble-shadow border border-[rgb(var(--scheme-border))]/50">
            {getIcon(selectedCharacter) ? (
              <img
                src={getIcon(selectedCharacter)}
                alt={selectedCharacter.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[rgb(var(--scheme-border))] flex-shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 border-[rgb(var(--scheme-border))] flex-shrink-0 bg-[rgb(var(--scheme-accent-bg))]"
              >
                {selectedCharacter.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium truncate">{selectedCharacter.displayName}</span>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-slate-300 text-sm font-medium mb-2">Other Character AI</div>
          <ul className="space-y-2">
            {otherCharacters.map((char) => (
              <li key={char.id}>
                <button
                  type="button"
                  onClick={() => openOrCreateChatWithCharacter(char)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:opacity-90 transition-all duration-200 text-left hover-lift"
                >
                  {getIcon(char) ? (
                    <img
                      src={getIcon(char)}
                      alt={char.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[rgb(var(--scheme-border))] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[rgb(var(--scheme-assistant-bg))] border-2 border-[rgb(var(--scheme-border))] flex items-center justify-center text-xs flex-shrink-0">
                      {char.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm text-slate-200 truncate">{char.displayName}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default ChatInterface;
