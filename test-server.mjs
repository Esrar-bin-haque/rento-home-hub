import { spawn } from 'child_process';

const server = spawn('npm', ['run', 'dev'], {
  cwd: 'backend',
  stdio: 'pipe',
  shell: true
});

server.stdout.on('data', async (data) => {
  const msg = data.toString();
  console.log(msg);
  if (msg.includes(' Listening on port ')) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const resp = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          phone: '01512345678',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message'
        })
      });
      const result = await resp.json();
      console.log('Response:', result);
    } catch (e) {
      console.error('Request failed:', e.message);
    }
    server.kill();
    process.exit(0);
  }
});

server.stderr.on('data', (data) => console.error(data.toString()));