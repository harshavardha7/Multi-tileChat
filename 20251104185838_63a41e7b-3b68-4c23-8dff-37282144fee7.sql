-- Fix security definer view by dropping it and using direct queries instead
DROP VIEW IF EXISTS public.active_sessions;

-- Fix function search path mutable warning
DROP FUNCTION IF EXISTS public.cleanup_expired_sessions();

CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.sessions WHERE expires_at <= now();
END;
$$;