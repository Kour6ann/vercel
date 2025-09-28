import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).send("MISSING_KEY");

  const { data } = await supabase
    .from('keys')
    .select('*')
    .eq('key', key)
    .maybeSingle();

  if (!data) return res.status(200).send("INVALID");

  const expired = new Date(data.expires_at) < new Date();
  if (expired || data.used) return res.status(200).send("INVALID");

  // One-time use: mark as used
  await supabase.from('keys').update({ used: true }).eq('id', data.id);

  return res.status(200).send("VALID");
}

