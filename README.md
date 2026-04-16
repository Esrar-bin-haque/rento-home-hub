# Rento - Property Rental Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/anomalyco/rento-home-hub)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescript.org)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-3-cyan)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-green)](https://expressjs.com)

A Bangladesh-focused property rental platform built with React 18 (frontend) and Express.js (backend).

## Features

- **Rental Marketplace** - Browse available rental properties with filtering and search
- **Building Management** - HOA/Association dashboard for community management
- **Landlord Dashboard** - Property manager dashboard for managing rentals
- **Service Marketplace** - Find service providers for property needs
- **Bilingual Support** - Full English and Bengali language support
- **Dark Mode** - Dark/Light theme switching
- **Responsive Design** - Mobile-first design that works on all devices
- **User Authentication** - JWT-based auth with local and Google OAuth

## Technologies

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Toasts**: sonner
- **State Management**: React Context + TanStack React Query

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite (sql.js)
- **Authentication**: JWT, Passport (Local + Google OAuth)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Frontend Installation

```bash
# Clone the repository
git clone https://github.com/anomalyco/rento-home-hub.git
cd rento-home-hub

# Install dependencies
npm install
```

### Backend Installation

```bash
cd backend

# Install dependencies
npm install
```

### Development

#### Frontend

```bash
# Start development server on port 8080
npm run dev
```

The frontend will be available at `http://localhost:8080`.

#### Backend

```bash
cd backend

# Start backend server on port 3000
npm run dev
```

The backend API will be available at `http://localhost:3000`.

### Building

#### Frontend

```bash
npm run build
```

Build output will be in the `dist` directory.

#### Backend

```bash
cd backend
npm run build
```

Build output will be in the `backend/dist` directory.

### Testing

```bash
# Run unit tests (Vitest)
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests (Playwright)
npx playwright test
```

### Linting

```bash
npm run lint
```

## Deployment to VPS

### Backend Deployment

```bash
cd backend
npm install --production
npm run build
```

Create a systemd service at `/etc/systemd/system/rento-backend.service`:

```ini
[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/rento-home-hub/backend
ExecStart=/usr/bin/node dist/index.js
Environment=NODE_ENV=production
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable rento-backend
sudo systemctl start rento-backend
```

### Frontend Deployment

Build the frontend and upload to your web server:

```bash
npm run build
```

Upload the contents of the `dist` folder to `/var/www/rento` (or your web root).

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend static files
    root /var/www/rento;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/rento /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate (Optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com --redirect
```

## Project Structure

```
rento-home-hub/
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   ├── pages/            # Page components
│   ├── App.tsx           # Main app with routing
│   └── main.tsx          # Entry point
├── backend/
│   ├── src/              # Backend source
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── db/           # Database setup
│   │   └── index.ts      # Entry point
│   └── package.json
├── dist/                  # Frontend build output
└── README.md
```

## License

MIT License - see [LICENSE](LICENSE) for details.