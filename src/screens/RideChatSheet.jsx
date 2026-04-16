import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import './RideChatSheet.css';

const MOCK_REPLIES = [
  'Sounds good!',
  "I'm on my way",
  'See you soon!',
  'Almost there',
];

let replyIndex = 0;

export default function RideChatSheet() {
  const { chatOpen, chatMessages, closeChat, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const hasSeededRef = useRef(false);

  // Seed mock messages once when chat first opens
  useEffect(() => {
    if (chatOpen && chatMessages.length === 0 && !hasSeededRef.current) {
      hasSeededRef.current = true;
      sendChatMessage("Hi! I'll be there in about 5 minutes", 'other');
    }
  }, [chatOpen]);

  // Reset seeding when chat is closed
  useEffect(() => {
    if (!chatOpen) {
      hasSeededRef.current = false;
    }
  }, [chatOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    sendChatMessage(text, 'me');
    setInputText('');

    // Auto-reply after 2 seconds
    setTimeout(() => {
      const reply = MOCK_REPLIES[replyIndex % MOCK_REPLIES.length];
      replyIndex++;
      sendChatMessage(reply, 'other');
    }, 2000);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className={`rcs-overlay${chatOpen ? ' open' : ''}`}>
      {/* Header */}
      <div className="rcs-header">
        <span className="rcs-title">Chat</span>
        <button className="rcs-close-btn" onClick={closeChat}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#1e1e1e" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="rcs-separator" />

      {/* Message list */}
      <div className="rcs-messages">
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`rcs-msg-wrap${msg.sender === 'me' ? ' rcs-msg-wrap--me' : ' rcs-msg-wrap--other'}`}
          >
            <div className={`rcs-bubble${msg.sender === 'me' ? ' rcs-bubble--me' : ' rcs-bubble--other'}`}>
              {msg.text}
            </div>
            <span className="rcs-timestamp">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div className="rcs-input-row">
        <input
          className="rcs-input"
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="rcs-send-btn" onClick={handleSend}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 10L2 2L6 10L2 18L18 10Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
