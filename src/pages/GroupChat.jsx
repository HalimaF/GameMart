import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '../context/UserContext';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import chatSeed from '../data/chat.json';
import './Home.css';
import PageHeading from "../components/PageHeading";

const GroupChat = () => {
  const { user } = useUser();
  const [scrollY, setScrollY] = useState(0);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('gm:groupchat');
      return saved ? JSON.parse(saved) : chatSeed.messages.map(m => ({
        id: m.id,
        user: m.username,
        text: m.message,
        timestamp: m.timestamp,
      }));
    } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'gm:groupchat' && e.newValue) {
        try { setMessages(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    const onChat = () => {
      try {
        const saved = localStorage.getItem('gm:groupchat');
        if (saved) setMessages(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('groupChatUpdated', onChat);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('groupChatUpdated', onChat);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const s = io('http://localhost:5000');
    setSocket(s);
    
    s.on('chat:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    s.on('user:count', (count) => {
      setUserCount(count);
    });

    s.on('chat:typing', (data) => {
      setTypingUsers(prev => new Set([...prev, data.user]));
    });

    s.on('chat:stop-typing', (data) => {
      setTypingUsers(prev => {
        const updated = new Set(prev);
        updated.delete(data.user);
        return updated;
      });
    });

    return () => { s.disconnect(); };
  }, []);

  useEffect(() => {
    try { localStorage.setItem('gm:groupchat', JSON.stringify(messages)); } catch {}
  }, [messages]);

  const currentUserName = user?.username || 'Guest';

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    if (socket && e.target.value.trim()) {
      socket.emit('chat:typing', { user: currentUserName });
      
      if (typingTimeout) clearTimeout(typingTimeout);
      const timeout = setTimeout(() => {
        socket.emit('chat:stop-typing', { user: currentUserName });
      }, 2000);
      setTypingTimeout(timeout);
    } else if (socket) {
      socket.emit('chat:stop-typing', { user: currentUserName });
    }
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    
    if (socket) socket.emit('chat:stop-typing', { user: currentUserName });
    if (typingTimeout) clearTimeout(typingTimeout);
    
    const msg = {
      id: Date.now(),
      user: currentUserName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, msg]);
    if (socket) socket.emit('chat:message', msg);
    setInput('');
    window.dispatchEvent(new Event('groupChatUpdated'));
  };

  return (
    <div className="home">
      <div className="home-bg">
        <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
        <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
      </div>

      <div className="featured">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <PageHeading title="Group Chat" subtitle="Chat with everyone in real-time" align="left" />
          </div>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(0, 255, 231, 0.1)',
            border: '1px solid rgba(0, 255, 231, 0.3)',
            borderRadius: '20px',
            color: '#00ffe7',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            👥 {userCount} online
          </div>
        </div>

        <div style={{
          background: 'rgba(17, 24, 39, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 16 }}>
            {messages.map(m => (
              <ChatMessage key={m.id} message={m} isOwn={m.user === currentUserName} />
            ))}
            {typingUsers.size > 0 && (
              <div style={{ 
                padding: '8px 12px', 
                color: '#9ca3af', 
                fontSize: '13px',
                fontStyle: 'italic'
              }}>
                {Array.from(typingUsers).filter(u => u !== currentUserName).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
              </div>
            )}
          </div>

          <ChatInput value={input} onChange={handleInputChange} onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
