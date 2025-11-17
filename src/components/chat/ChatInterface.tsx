import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatSessions, useChatSession, useSendMessage, useCreateChatSession, useRenameChatSession, useDeleteChatSession, useDocumentsForRAG } from '../../hooks/useChat';
import { Send, Plus, MessageCircle, Bot, User, Edit2, Check, X, Sparkles, BarChart3, FileText, CheckCircle, Trash2, PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';
import { formatTime, sortByDate } from '../../utils/dateUtils';
import { AIProgressVisualization } from './AIProgressVisualization';

export const ChatInterface: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const [showProgressVisualization, setShowProgressVisualization] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const [actualResponseTime, setActualResponseTime] = useState<number | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Start with sidebar hidden for better mobile experience
  const [showMobileSessionsModal, setShowMobileSessionsModal] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const mentionDropdownRef = useRef<HTMLDivElement>(null);
  const documentSelectionRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const { data: sessions, isLoading: sessionsLoading } = useChatSessions();
  const { data: currentSession, isLoading: sessionLoading } = useChatSession(selectedSessionId || '');
  const { data: documents, isLoading: documentsLoading } = useDocumentsForRAG();
  const sendMessage = useSendMessage();
  const createSession = useCreateChatSession();
  const renameSession = useRenameChatSession();
  const deleteSession = useDeleteChatSession();

  // Mention options
  const mentionOptions = [
    // {
    //   id: 'vtk-rag',
    //   name: 'VTK RAG',
    //   description: 'Document retrieval and analysis',
    //   icon: Sparkles,
    //   color: 'from-purple-500 to-pink-500',
    //   hasDocumentSelection: true
    // },
    {
      id: 'stats',
      name: 'Thống kê',
      description: 'Phân tích dữ liệu và thống kê',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      hasDocumentSelection: false
    }
  ];

  const filteredMentions = mentionOptions.filter(option =>
    option.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    option.id.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle mention input
  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    setMessage(value);
    
    // Check for @ mention
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const hasSpaceAfterAt = textAfterAt.includes(' ');
      
      if (!hasSpaceAfterAt) {
        setMentionQuery(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  }, []);

  // Handle mention selection
  const handleMentionSelect = useCallback((mention: typeof mentionOptions[0]) => {
    const textBeforeMention = message.substring(0, mentionPosition);
    const textAfterMention = message.substring(mentionPosition + mentionQuery.length + 1);
    const newMessage = `${textBeforeMention}@${mention.id} ${textAfterMention}`;
    
    setMessage(newMessage);
    setShowMentions(false);
    setMentionQuery('');
    
    // If it's vtk-rag, show document selection
    if (mention.id === 'vtk-rag') {
      setShowDocumentSelection(true);
      setSelectedDocuments([]);
    }
    
    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPosition = textBeforeMention.length + mention.id.length + 2;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  }, [message, mentionPosition, mentionQuery]);

  // Handle document selection (single selection only)
  const handleDocumentSelect = useCallback((documentId: string) => {
    setSelectedDocuments([documentId]);
    // Auto-close modal after selection
    setTimeout(() => {
      setShowDocumentSelection(false);
      // Focus back to input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300); // Small delay for visual feedback
  }, []);

  const handleDocumentSelectionCancel = useCallback(() => {
    setShowDocumentSelection(false);
    setSelectedDocuments([]);
    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, []);

  // Close mentions, document selection, and mobile modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mentionDropdownRef.current && !mentionDropdownRef.current.contains(event.target as Node)) {
        setShowMentions(false);
      }
      if (documentSelectionRef.current && !documentSelectionRef.current.contains(event.target as Node)) {
        setShowDocumentSelection(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, pendingMessages]);

  // Clear pending messages when session changes
  useEffect(() => {
    setPendingMessages([]);
  }, [selectedSessionId]);

  useEffect(() => {
    if (selectedSessionId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedSessionId]);

  useEffect(() => {
    if (editingSessionId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingSessionId]);

  // Keyboard shortcut for toggling sidebar (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        setSidebarVisible(!sidebarVisible);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarVisible]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageText = message.trim();
    setMessage('');
    setShowMentions(false);
    setShowDocumentSelection(false);
    
    // Add optimistic update - show user message immediately
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: messageText,
      sender: 'user',
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    
    setPendingMessages(prev => [...prev, optimisticMessage]);
    
    // Show progress visualization immediately after user sends message
    const startTime = Date.now();
    setResponseStartTime(startTime);
    setShowProgressVisualization(true);

    try {
      const messageData = {
        message: messageText,
        session_id: selectedSessionId || undefined,
        document_ids: selectedDocuments.length > 0 ? selectedDocuments : undefined,
      };
      
      await sendMessage.mutateAsync(messageData);
      
      // Clear selected documents after sending
      setSelectedDocuments([]);
      
      // Remove the optimistic message since it's now in the real data
      setPendingMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      // Start polling for AI response
      pollForAIResponse();
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setPendingMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      // Hide indicators on error
      setShowProgressVisualization(false);
      setResponseStartTime(null);
    }
  };

  // Poll for AI response completion
  const pollForAIResponse = useCallback(() => {
    const pollInterval = setInterval(async () => {
      try {
        if (!selectedSessionId) {
          clearInterval(pollInterval);
          setShowProgressVisualization(false);
          setResponseStartTime(null);
          return;
        }

        // Fetch latest session data to check for new AI response
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.167.88.66:8000'}/chat/sessions/${selectedSessionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const sessionData = await response.json();
          const messages = sessionData.messages || [];
          
          // Check if there's a new AI message (last message from assistant)
          const lastMessage = messages[messages.length - 1];
          if (lastMessage && (lastMessage.sender === 'assistant' || lastMessage.sender === 'AI')) {
            // AI response received, calculate actual response time
            const endTime = Date.now();
            const actualTime = responseStartTime ? (endTime - responseStartTime) / 1000 : null;
            setActualResponseTime(actualTime);
            
            // Hide indicators
            clearInterval(pollInterval);
            setShowProgressVisualization(false);
            setResponseStartTime(null);
            
            // Update the query data directly to prevent message disappearance
            queryClient.setQueryData(['chat', 'sessions', selectedSessionId], sessionData);
            
            // Clear pending messages since we now have the real data
            setPendingMessages([]);
          }
        }
      } catch (error) {
        console.error('Error polling for AI response:', error);
        // On error, stop polling and hide indicators
        clearInterval(pollInterval);
        setShowProgressVisualization(false);
        setResponseStartTime(null);
      }
    }, 2000); // Poll every 2 seconds

    // Set a maximum timeout of 5 minutes to prevent infinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
      setShowProgressVisualization(false);
      setResponseStartTime(null);
    }, 300000); // 5 minutes timeout
  }, [selectedSessionId, queryClient, responseStartTime]);

  const handleMessageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleCreateSession = async () => {
    setIsCreatingSession(true);
    try {
      const sessionName = `Chat ${new Date().toLocaleString()}`;
      const newSession = await createSession.mutateAsync({ title: sessionName });
      setSelectedSessionId(newSession.id);
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleStartEdit = (sessionId: string, currentName: string) => {
    setEditingSessionId(sessionId);
    setEditingName(currentName);
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (!editingSessionId || !editingName.trim()) return;

    try {
      await renameSession.mutateAsync({
        id: editingSessionId,
        name: editingName.trim(),
      });
      setEditingSessionId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error renaming session:', error);
      // Show user-friendly error message
      alert('Không thể đổi tên cuộc trò chuyện. Vui lòng thử lại.');
      // Cancel edit mode on error
      setEditingSessionId(null);
      setEditingName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.')) {
      try {
        await deleteSession.mutateAsync(sessionId);
        // If the deleted session was selected, clear the selection
        if (selectedSessionId === sessionId) {
          setSelectedSessionId(null);
        }
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Không thể xóa cuộc trò chuyện. Vui lòng thử lại.');
      }
    }
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className={`${sidebarVisible ? 'w-80 lg:w-80 md:w-64 sm:w-64' : 'w-0'} bg-white shadow-xl border-r border-gray-200 flex flex-col hidden md:flex transition-all duration-300 ease-in-out overflow-hidden`}>
        {/* Sidebar Content - Only render when visible */}
        {sidebarVisible && (
          <>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Thống kê giáo dục</h2>
                <p className="text-blue-100 text-sm">Trợ lý AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
                title={sidebarVisible ? "Hide sidebar (Ctrl+B)" : "Show sidebar (Ctrl+B)"}
              >
                {sidebarVisible ? (
                  <PanelLeftClose className="w-5 h-5 text-white" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={handleCreateSession}
                disabled={isCreatingSession}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessionsLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-500">Loading chats...</p>
            </div>
          ) : sessions?.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No conversations yet</p>
              <button
                onClick={handleCreateSession}
                disabled={isCreatingSession}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isCreatingSession ? 'Đang tạo...' : 'Bắt đầu trò chuyện'}
              </button>
            </div>
          ) : (
            <div className="p-2">
              {sessions?.map((session: any) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl mb-2 transition-all duration-200 transform hover:scale-[1.02] ${
                    selectedSessionId === session.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedSessionId === session.id ? 'bg-white/20' : 'bg-blue-100'
                      }`}
                      onClick={() => setSelectedSessionId(session.id)}
                    >
                      <MessageCircle className={`w-5 h-5 ${
                        selectedSessionId === session.id ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingSessionId === session.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-1 px-2 py-1 text-sm bg-white/90 border border-white/50 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                            disabled={renameSession.isPending}
                          />
                          <button
                            onClick={handleSaveEdit}
                            disabled={renameSession.isPending || !editingName.trim()}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={renameSession.isPending}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => setSelectedSessionId(session.id)}
                          >
                            <div className="font-medium truncate">{session.name}</div>
                            <div className={`text-sm ${
                              selectedSessionId === session.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {formatTime(session.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(session.id, session.name);
                              }}
                              className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/20 transition-all duration-200 ${
                                selectedSessionId === session.id ? 'text-white' : 'text-gray-400'
                              }`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session.id);
                              }}
                              className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all duration-200 ${
                                selectedSessionId === session.id ? 'text-white hover:text-red-300' : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden mobile-fab">
        <div className="flex flex-col items-end space-y-3">
          {/* Sessions Modal Button */}
          <button
            onClick={() => setShowMobileSessionsModal(true)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
            title="Chat Sessions"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Create New Session Button */}
          <button
            onClick={handleCreateSession}
            disabled={isCreatingSession}
            className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Desktop Floating Toggle Button - Only visible when sidebar is hidden */}
      {!sidebarVisible && (
        <div className="fixed top-4 left-4 z-50 md:block hidden">
          <button
            onClick={() => setSidebarVisible(true)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
            title="Show sidebar (Ctrl+B)"
          >
            <PanelLeftOpen className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile Sessions Modal */}
      {showMobileSessionsModal && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" onClick={() => setShowMobileSessionsModal(false)}>
          <div className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Chat Sessions</h2>
                    <p className="text-blue-100 text-sm">Select or create a conversation</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileSessionsModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            {/* Sessions List */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mobile-sessions-scroll" style={{ maxHeight: 'calc(80vh - 200px)' }}>
                {sessionsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading chats...</p>
                </div>
              ) : sessions?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No conversations yet</p>
                  <button
                    onClick={() => {
                      handleCreateSession();
                      setShowMobileSessionsModal(false);
                    }}
                    disabled={isCreatingSession}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isCreatingSession ? 'Creating...' : 'Start Conversation'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {sessions?.map((session: any) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-xl transition-all duration-200 ${
                        selectedSessionId === session.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedSessionId === session.id ? 'bg-white/20' : 'bg-blue-100'
                          }`}
                          onClick={() => {
                            setSelectedSessionId(session.id);
                            setShowMobileSessionsModal(false);
                          }}
                        >
                          <MessageCircle className={`w-5 h-5 ${
                            selectedSessionId === session.id ? 'text-white' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div 
                            className="font-medium truncate cursor-pointer"
                            onClick={() => {
                              setSelectedSessionId(session.id);
                              setShowMobileSessionsModal(false);
                            }}
                          >
                            {session.name}
                          </div>
                          <div className={`text-sm ${
                            selectedSessionId === session.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(session.created_at)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(session.id, session.name);
                            }}
                            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/20 transition-all duration-200 ${
                              selectedSessionId === session.id ? 'text-white' : 'text-gray-400'
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all duration-200 ${
                              selectedSessionId === session.id ? 'text-white hover:text-red-300' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  handleCreateSession();
                  setShowMobileSessionsModal(false);
                }}
                disabled={isCreatingSession}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 font-semibold"
              >
                {isCreatingSession ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  'Start New Conversation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSessionId ? (
          <>
            {/* Chat Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Trợ lý AI</h3>
                  <p className="text-sm text-gray-500">Luôn sẵn sàng hỗ trợ</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white chat-messages">
              {sessionLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              ) : currentSession?.messages?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bắt đầu cuộc trò chuyện</h3>
                  <p className="text-gray-500 mb-6">Hỏi tôi bất cứ điều gì về dữ liệu của bạn!</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800 text-center">
                      Công nghệ trí tuệ nhân tạo được đội ngũ Viettechkey nghiên cứu và huấn luyện. AI có thể xảy ra sai sót, vui lòng kiểm tra lại thông tin. Xin chân thành cảm ơn.
                    </p>
                  </div>
                </div>
              ) : (
                sortByDate([...(currentSession?.messages || []), ...pendingMessages], 'created_at', true)
                  ?.map((msg: any, index: number) => (
                  <div
                    key={msg.id || `${msg.sender}-${msg.created_at}-${index}`}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${
                      msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}>
                        {msg.sender === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`px-4 py-3 rounded-2xl shadow-sm message-bubble ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-md'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                      }`}>
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                        <div className={`flex items-center justify-between mt-1 ${
                          msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{formatTime(msg.created_at)}</span>
                          {msg.sender === 'user' && (
                            <div className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                              <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                              <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* AI Progress Visualization */}
              <AIProgressVisualization
                isVisible={showProgressVisualization}
                expectedDuration={180} // 3 minutes
                actualDuration={actualResponseTime || undefined}
                onComplete={() => {
                  // Optional: Add any completion logic here
                  console.log('Progress visualization completed');
                }}
              />
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 md:p-4 relative">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2 md:space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleMessageKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    disabled={sendMessage.isPending}
                  />
                  
                  {/* Selected Document Indicator */}
                  {selectedDocuments.length > 0 && (
                    <div className="absolute -top-2 left-4 right-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-2 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">
                          Document selected for RAG
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedDocuments([])}
                          className="ml-auto text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Mention Dropdown */}
                  {showMentions && (
                    <div
                      ref={mentionDropdownRef}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto mention-dropdown"
                    >
                      <div className="p-2">
                        <div className="text-xs text-gray-500 mb-2 px-2">Các lệnh có sẵn:</div>
                        {filteredMentions.map((mention) => {
                          const IconComponent = mention.icon;
                          return (
                            <button
                              key={mention.id}
                              type="button"
                              onClick={() => handleMentionSelect(mention)}
                              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-left"
                            >
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${mention.color} flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900">@{mention.id}</div>
                                <div className="text-sm text-gray-500 truncate">{mention.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Document Selection Modal */}
                  {showDocumentSelection && (
                    <div
                      ref={documentSelectionRef}
                      className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto mention-dropdown"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Select Document for RAG</h3>
                            <p className="text-sm text-gray-500">Choose one document to query with @vtk-rag</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleDocumentSelectionCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {documentsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-gray-600">Loading documents...</span>
                          </div>
                        ) : documents && documents.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {documents.map((doc: any) => (
                              <label
                                key={doc.id}
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                              >
                                <div className="flex-shrink-0">
                                  <input
                                    type="radio"
                                    name="document-selection"
                                    checked={selectedDocuments.includes(doc.id)}
                                    onChange={() => handleDocumentSelect(doc.id)}
                                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="font-medium text-gray-900 truncate">{doc.name || doc.title || 'Untitled Document'}</span>
                                    {selectedDocuments.includes(doc.id) && (
                                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {doc.type || 'Document'} • {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Không có dữ liệu nào</p>
                          </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-500 text-center">
                            Nhấp vào dữ liệu để chọn
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!message.trim() || sendMessage.isPending}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {sendMessage.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              
              {/* AI Disclaimer */}
              <div className="px-2 md:px-4 py-1">
                <p className="text-[8px] md:text-[10px] text-gray-500 italic text-center leading-tight">
                  Công nghệ trí tuệ nhân tạo được đội ngũ Viettechkey nghiên cứu và huấn luyện. AI có thể xảy ra sai sót, vui lòng kiểm tra lại thông tin. Xin chân thành cảm ơn.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Chào mừng đến với Thống kê giáo dục</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Trợ lý AI của bạn để phân tích dữ liệu giáo dục. 
                Bắt đầu cuộc trò chuyện để có được thông tin chi tiết từ các dữ liệu đã tải lên.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 text-center">
                  Công nghệ trí tuệ nhân tạo được đội ngũ Viettechkey nghiên cứu và huấn luyện. AI có thể xảy ra sai sót, vui lòng kiểm tra lại thông tin. Xin chân thành cảm ơn.
                </p>
              </div>
              <button
                onClick={handleCreateSession}
                disabled={isCreatingSession}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-full hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
              >
                {isCreatingSession ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tạo...</span>
                  </div>
                ) : (
                  'Bắt đầu trò chuyện mới'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};