import dayjs from 'dayjs';
import { Avatar } from './Avatar';

export const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar role={message.role} />
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div
          className={`
            rounded-2xl px-4 py-3 backdrop-blur-sm
            ${isUser
              ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
            }
          `}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {dayjs(message.createdAt).format('hh:mm A')}
        </span>
      </div>
    </div>
  );
};
