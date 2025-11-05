import { Avatar } from './Avatar';

export const TypingDots = () => {
  return (
    <div className="flex gap-3">
      <Avatar role="assistant" />
      
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl rounded-bl-sm bg-muted">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
