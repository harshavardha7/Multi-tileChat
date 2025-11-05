import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tileIndex, sessionPublicId } = await req.json();
    
    // Validate input
    if (tileIndex < 0 || tileIndex > 3) {
      return new Response(
        JSON.stringify({ error: 'Invalid tile index. Must be between 0 and 3.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create new session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        session_public_id: sessionPublicId,
        tile_index: tileIndex,
      })
      .select()
      .single();
    
    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Session created:', session.id, 'for tile:', tileIndex);
    
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        sessionPublicId: session.session_public_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-start:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// filepath: c:\Users\pvams\Downloads\multi-tile-speak-main\multi-tile-speak-main\supabase\.env.local
OPENAI_API_KEY="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"