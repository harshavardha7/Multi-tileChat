import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { ChatWindow } from './ChatWindow';

export const ChatTile = ({ tileIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  const tile = useChatStore((state) => state.tiles[tileIndex]);
  
  const tileColors = [
    'from-primary/20 to-accent/20',
    'from-secondary/20 to-primary/10',
    'from-accent/20 to-secondary/10',
    'from-secondary/10 to-accent/10',
  ];
  
  const handleOpen = () => {
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  if (isOpen) {
    return <ChatWindow tileIndex={tileIndex} onClose={handleClose} />;
  }
  
  return (
    <button
      onClick={handleOpen}
      className={`
        relative group h-64 rounded-2xl p-8
        bg-gradient-to-br ${tileColors[tileIndex]}
        backdrop-blur-sm border border-border/50
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-[var(--shadow-tile)]
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      `}
    >
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="p-4 rounded-full bg-card/50 backdrop-blur-sm group-hover:scale-110 transition-transform">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-1">
            Chat {tileIndex + 1}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tile.messages.length > 0
              ? `${tile.messages.length} messages`
              : 'Start a conversation'}
          </p>
        </div>
        
        {tile.isTyping && (
          <div className="absolute bottom-4 right-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
};
