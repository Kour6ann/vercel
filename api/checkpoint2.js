import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_ip', ip)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!session || session.stage < 1) {
    return res.status(403).send("⚠️ You must complete Step 1 first.");
  }

  const key = randomBytes(8).toString('hex');
  await supabase.from('keys').insert({
    key,
    expires_at: new Date(Date.now() + 1000 * 60 * 30) // 30 min expiry
  });
  await supabase.from('sessions').update({ stage: 2 }).eq('id', session.id);

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <title>Kour6anHub Checkpoint 2</title>
  <style>
    body {
      background-color: #0d0d0d;
      color: #ffffff;
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 15%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #00ffe1;
      text-shadow: 0 0 10px #00ffe1, 0 0 20px #00ffe1;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #cccccc;
    }
    .key-box {
      display: inline-block;
      padding: 12px 20px;
      font-size: 1.3rem;
      background: #1a1a1a;
      border: 2px solid #00ffe1;
      border-radius: 6px;
      color: #00ffe1;
      font-weight: bold;
      text-shadow: 0 0 10px #00ffe1;
      margin-bottom: 2rem;
    }
    button {
      padding: 12px 24px;
      background: #00ffe1;
      color: #000;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 0 10px #00ffe1;
      transition: all 0.3s ease;
    }
    button:hover {
      box-shadow: 0 0 20px #00ffe1, 0 0 40px #00ffe1;
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <h1>Checkpoint 2 Complete ✅</h1>
  <p>Here’s your key, valid for 30 minutes. Copy it and paste into the loader.</p>
  <div class="key-box">${key}</div><br>
  <button onclick="navigator.clipboard.writeText('${key}')">Copy Key</button>
</body>
</html>
  `);
}

