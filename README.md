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

### Google OAuth Setup (Optional)

To enable Sign in with Google, you need to create OAuth credentials in Google Cloud Console:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the Google+ API** (or Google People API):
   - Go to APIs & Services → Library
   - Search for "Google+ API" or "People API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to APIs & Services → Credentials
   - Click "Create credentials" → OAuth client ID
   - Application type: Web application
   - Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
5. **Get the Client ID and Client Secret**
6. **Update `backend/.env`**:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

7. **Restart the backend** for changes to take effect

Note: For production, update `GOOGLE_CALLBACK_URL` to your actual domain.

### Facebook OAuth Setup (Optional)

To enable Sign in with Facebook, you need to create an app in Facebook Developer Portal:

1. **Go to Facebook Developer Portal**: https://developers.facebook.com/
2. **Create a new app**:
   - Go to "My Apps" → "Create App"
   - Select "Consumer" as app type
   - Add app name and contact email
3. **Set up Facebook Login**:
   - Go to Products → Add Product → Facebook Login
   - Go to Settings → OAuth Settings
   - Add Valid OAuth Redirect URIs: `http://localhost:3001/api/auth/facebook/callback`
   - Add Site URL: `http://localhost:8080/`
4. **Get the App ID and App Secret**:
   - Go to Settings → Basic
   - Copy the App ID and App Secret
5. **Update `backend/.env`**:

```
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/auth/facebook/callback
```

6. **Restart the backend** for changes to take effect

Note: For production, update `FACEBOOK_CALLBACK_URL` to your actual domain.

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

## Internationalization (i18n)

This project supports multiple languages using a custom i18n implementation.

### Supported Languages

- **English** (`en`) - Default
- **Bengali** (`bn`) - Bangla translation

### Translation Files

Translation files are located in `src/i18n/`:

- `src/i18n/en.json` - English translations
- `src/i18n/bn.json` - Bengali translations
- `src/i18n/index.ts` - Language configuration

### Adding New Translations

1. **Add a new translation key to your component**:
   ```tsx
   const { t } = useLanguage();
   // Use in your component
   <h1>{t("my_new_key")}</h1>
   ```

2. **Run the extraction script** to automatically add new keys:
   ```bash
   npm run extract:i18n
   # or
   node scripts/extract-translations.js
   ```

3. **Update the translation values** in the JSON files:
   - Edit `src/i18n/en.json` with the English value
   - Edit `src/i18n/bn.json` with the Bengali value

   Example:
   ```json
   {
     "my_new_key": "This is my new text"
   }
   ```

### Adding a New Language

1. Create a new JSON file in `src/i18n/` (e.g., `es.json` for Spanish)

2. Copy all keys from `en.json` and translate them:
   ```json
   {
     "my_new_key": "Esta es mi nuevo texto"
   }
   ```

3. Update `src/i18n/index.ts` to include the new language:
   ```typescript
   import en from './en.json';
   import bn from './bn.json';
   import es from './es.json'; // Add your new language

   export const translations = {
     en,
     bn,
     es // Add your new language
   };
   ```

4. The `LanguageContext` provides a `setLang` function to switch languages:
   ```tsx
   const { setLang } = useLanguage();
   setLang('es'); // Switch to Spanish
   ```

### Translation Key Naming Convention

Use a prefix system to organize keys:

- `nav_*` - Navigation items
- `hero_*` - Hero section texts
- `card*_*` - Feature cards
- `auth_*` - Authentication related
- `dash_*` - Dashboard related
- `pm_*` - Property management
- `bm_*` - Building management
- `rentals_*` - Rental listings
- `services_*` - Services page
- `footer_*` - Footer section

Example: `dash_tenant`, `pm_addProperty`, `bm_flatNo`