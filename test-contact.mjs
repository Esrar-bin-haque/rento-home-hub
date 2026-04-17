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
const data = await resp.json();
console.log(data);