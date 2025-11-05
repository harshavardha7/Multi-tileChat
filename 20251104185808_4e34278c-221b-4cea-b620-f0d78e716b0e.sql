-- Create sessions table for tile conversations
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_public_id uuid NOT NULL,
  tile_index int NOT NULL CHECK (tile_index BETWEEN 0 AND 3),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days'
);

-- Create messages table
CREATE TABLE public.messages (
  id bigserial PRIMARY KEY,
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient message retrieval
CREATE INDEX idx_messages_session_created ON public.messages(session_id, created_at);

-- Create view for active sessions
CREATE VIEW public.active_sessions AS
SELECT * FROM public.sessions WHERE expires_at > now();

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public access policies (for POC - adjust for production)
CREATE POLICY "Anyone can create sessions" ON public.sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view sessions" ON public.sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create messages" ON public.messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view messages" ON public.messages
  FOR SELECT USING (true);

-- Create push tokens table for FCM
CREATE TABLE public.push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  reminder_hour int CHECK (reminder_hour BETWEEN 0 AND 23),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register push tokens" ON public.push_tokens
  FOR INSERT WITH CHECK (true);

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.sessions WHERE expires_at <= now();
END;
$$;