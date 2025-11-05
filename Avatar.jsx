import { User, Bot } from 'lucide-react';

export const Avatar = ({ role }) => {
  const isUser = role === 'user';
  
  return (
    <div
      className={`
        flex items-center justify-center w-10 h-10 rounded-full shrink-0
        ${isUser
          ? 'bg-gradient-to-br from-primary to-accent'
          : 'bg-gradient-to-br from-secondary to-primary'
        }
      `}
    >
      {isUser ? (
        <User className="w-5 h-5 text-white" />
      ) : (
        <Bot className="w-5 h-5 text-white" />
      )}
    </div>
  );
};
