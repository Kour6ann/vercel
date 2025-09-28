import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  await supabase.from('sessions').insert({ user_ip: ip, stage: 1 });

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <title>Kour6anHub Checkpoint 1</title>
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
      margin-bottom: 2rem;
      color: #cccccc;
    }
    a {
      display: inline-block;
      padding: 12px 24px;
      background: #00ffe1;
      color: #000;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px #00ffe1;
    }
    a:hover {
      box-shadow: 0 0 20px #00ffe1, 0 0 40px #00ffe1;
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <h1>Checkpoint 1 Passed ✅</h1>
  <p>You’re almost there. Continue to Step 2 to get your key.</p>
  <a href="/api/checkpoint2">Proceed to Step 2</a>
</body>
</html>
  `);
}
