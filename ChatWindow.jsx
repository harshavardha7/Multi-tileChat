import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { startChatSession, sendChatMessage, getChatHistory } from '@/lib/api';
import { MessageBubble } from './MessageBubble';
import { TypingDots } from './TypingDots';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const ChatWindow = ({ tileIndex, onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  
  const tile = useChatStore((state) => state.tiles[tileIndex]);
  const setSession = useChatStore((state) => state.setSession);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  const setTyping = useChatStore((state) => state.setTyping);
  
  useEffect(() => {
    // Load chat history if session exists
    if (tile.sessionId && tile.messages.length === 0) {
      getChatHistory(tile.sessionId).then((messages) => {
        messages.forEach((msg) => {
          addMessage(tileIndex, {
            role: msg.role,
            content: msg.content,
            createdAt: msg.created_at,
          });
        });
      });
    }
  }, [tile.sessionId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tile.messages, tile.isTyping]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const messageText = input.trim();
    setInput('');
    
    try {
      // Start session if needed
      let sessionId = tile.sessionId;
      if (!sessionId) {
        setIsLoading(true);
        const sessionData = await startChatSession(tileIndex);
        sessionId = sessionData.sessionId;
        setSession(tileIndex, sessionData.sessionId, sessionData.sessionPublicId);
      }
      
      // Add user message
      addMessage(tileIndex, {
        role: 'user',
        content: messageText,
        createdAt: new Date().toISOString(),
      });
      
      // Show typing indicator
      setTyping(tileIndex, true);
      
      // Send message and stream response
      const responseBody = await sendChatMessage(sessionId, messageText);
      const reader = responseBody.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessage = '';
      let isFirstChunk = true;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage += parsed.content;
                
                if (isFirstChunk) {
                  setTyping(tileIndex, false);
                  addMessage(tileIndex, {
                    role: 'assistant',
                    content: assistantMessage,
                    createdAt: new Date().toISOString(),
                  });
                  isFirstChunk = false;
                } else {
                  updateLastMessage(tileIndex, assistantMessage);
                }
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
      
      setTyping(tileIndex, false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setTyping(tileIndex, false);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="relative h-[600px] rounded-2xl bg-card border border-border shadow-[var(--shadow-chat)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
        <h2 className="text-lg font-semibold text-foreground">
          Chat {tileIndex + 1}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-destructive/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tile.messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {tile.isTyping && <TypingDots />}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message in Hinglish..."
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="self-end"
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
