import { supabase } from '@/integrations/supabase/client';

export const startChatSession = async (tileIndex) => {
  // Generate a unique public ID for this session
  const sessionPublicId = crypto.randomUUID();
  
  try {
    const { data, error } = await supabase.functions.invoke('chat-start', {
      body: { tileIndex, sessionPublicId },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error starting chat session:', error);
    throw error;
  }
};

export const sendChatMessage = async (sessionId, message) => {
  try {
    const response = await fetch(
      `https://ufakgvgxswpusixoawsn.supabase.co/functions/v1/chat-send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ sessionId, message }),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.body;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const getChatHistory = async (sessionId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const registerPushToken = async (fcmToken, reminderHour = 9) => {
  try {
    const { data, error } = await supabase.functions.invoke('push-register', {
      body: { fcmToken, reminderHour },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error registering push token:', error);
    throw error;
  }
};
