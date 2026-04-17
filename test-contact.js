const fetch = (...args) => import('node-fetch').then(m => m.default(...args));

fetch('http://localhost:3001/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    phone: '01512345678',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message'
  })
}).then(r => r.json()).then(console.log).catch(console.error);