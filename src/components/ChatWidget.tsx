import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, ChatMessage, OnlineUser } from '../types';
import { 
  MessageSquare, 
  X, 
  Send, 
  User as UserIcon, 
  Circle,
  Bell,
  Search,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatWidgetProps {
  currentUser: User | null;
  allUsers: User[];
}

export default function ChatWidget({ currentUser, allUsers }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<OnlineUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<OnlineUser | null>(null);

  // Sync ref with state
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Derived user list: All active users, flagged as online if present in onlineUsers
  const chatUsers = allUsers
    .filter(u => u.status !== 'INACTIVE' && u.id !== currentUser?.id)
    .map(u => ({
      ...u,
      isOnline: onlineUsers.some(ou => ou.id === u.id)
    }))
    .sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return a.name.localeCompare(b.name);
    });

  useEffect(() => {
    if (!currentUser) return;

    // Connect to local server
    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('user:login', {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username
      });
    });

    socket.on('users:online', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socket.on('message:history', (history: ChatMessage[]) => {
      setMessages(history);
      
      // Calculate unread counts from history for messages NOT from current user
      // Only do this if we haven't already calculated unreads (to prevent overwriting manual clears)
      setUnreadCount(prev => {
        const hasExistingUnreads = (Object.values(prev) as number[]).some(count => count > 0);
        if (hasExistingUnreads) return prev;

        const unreads: Record<string, number> = {};
        history.forEach(msg => {
          if (msg.fromId !== currentUser.id && (!activeChatRef.current || activeChatRef.current.id !== msg.fromId)) {
            unreads[msg.fromId] = (unreads[msg.fromId] || 0) + 1;
          }
        });
        return unreads;
      });
    });

    socket.on('message:receive', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
      
      // Use ref to check current active chat to avoid closure issues
      if (!activeChatRef.current || activeChatRef.current.id !== msg.fromId) {
        setUnreadCount(prev => ({
          ...prev,
          [msg.fromId]: (prev[msg.fromId] || 0) + 1
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]); // Removed activeChat from dependencies

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat || !currentUser || !socketRef.current) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      fromId: currentUser.id,
      toId: activeChat.id,
      content: inputText,
      timestamp: Date.now()
    };

    socketRef.current.emit('message:send', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const selectUser = (user: User & { isOnline: boolean }) => {
    setActiveChat({
      id: user.id,
      name: user.name,
      username: user.username
    });
    setUnreadCount(prev => ({ ...prev, [user.id]: 0 }));
  };

  if (!currentUser) return null;

  const totalUnread = (Object.values(unreadCount) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {activeChat && (
                  <button 
                    onClick={() => setActiveChat(null)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div>
                  <h3 className="font-bold text-sm">
                    {activeChat ? `${activeChat.name} (${activeChat.username})` : '成员列表'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeChat && onlineUsers.some(ou => ou.id === activeChat.id) ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                    <span className="text-[10px] opacity-80 uppercase tracking-wider font-bold">
                      {activeChat && onlineUsers.some(ou => ou.id === activeChat.id) ? '在线' : '离线'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
              {!activeChat ? (
                /* User List */
                <div className="flex-1 flex flex-col">
                  <div className="p-3">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <Input 
                        placeholder="搜索成员..."
                        className="pl-8 h-9 text-xs bg-white border-transparent rounded-xl focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    {chatUsers
                      .filter(u => u.name.includes(searchTerm) || u.username.includes(searchTerm))
                      .map(user => (
                      <button
                        key={user.id}
                        onClick={() => selectUser(user)}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-white rounded-2xl transition-all group relative ${!user.isOnline ? 'opacity-60 grayscale-[0.5]' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          user.isOnline 
                            ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' 
                            : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                        }`}>
                          <UserIcon size={20} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${user.isOnline ? 'text-gray-900' : 'text-gray-500'}`}>{user.name}</span>
                            {user.department && (
                              <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded font-bold uppercase tracking-tight">
                                {user.department}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">{user.username}</p>
                        </div>
                        {unreadCount[user.id] > 0 && (
                          <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                            {unreadCount[user.id]}
                          </span>
                        )}
                        <Circle size={8} className={user.isOnline ? "text-emerald-500 fill-emerald-500" : "text-gray-300 fill-gray-300"} />
                      </button>
                    ))}
                    {chatUsers.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-50">
                        <MessageSquare size={32} />
                        <p className="text-xs font-bold tracking-widest uppercase">暂无活跃成员</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Chat Window */
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                  >
                    {messages
                      .filter(m => 
                        (m.fromId === activeChat.id && m.toId === currentUser.id) || 
                        (m.fromId === currentUser.id && m.toId === activeChat.id)
                      )
                      .map(msg => {
                        const isMine = msg.fromId === currentUser.id;
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                              isMine 
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                                : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                            }`}>
                              <p className="leading-relaxed font-medium">{msg.content}</p>
                              <p className={`text-[10px] mt-1 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {/* Input Area */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-50 flex gap-2">
                    <Input 
                      placeholder="输入消息..."
                      className="flex-1 h-9 bg-gray-50 border-transparent rounded-xl text-xs focus:ring-indigo-600"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      autoFocus
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!inputText.trim()}
                      className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      <Send size={16} />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 group relative shadow-indigo-200"
      >
        <MessageSquare size={24} className={isOpen ? 'hidden' : 'block'} />
        <X size={24} className={isOpen ? 'block' : 'hidden'} />
        
        {totalUnread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg z-10">
            {totalUnread}
          </span>
        )}
      </button>
    </div>
  );
}
