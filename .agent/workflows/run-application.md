---
description: How to run the Candidate-FE application
---

# Running the Candidate-FE Application

This workflow describes how to run the QuickOnboardAI Candidate Frontend application.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Steps

### 1. Navigate to the Project Directory

```bash
cd /Users/credr/Desktop/QuickOnboardAI/Candidate-FE
```

### 2. Install Dependencies (First Time Only)

If you haven't installed dependencies yet or if `package.json` has changed:

```bash
npm install
```

This will:
- Download all required packages
- Create/update `node_modules` folder
- Create/update `package-lock.json`

**Note**: You may see security vulnerability warnings. These can be addressed later with `npm audit fix` if needed.

### 3. Start the Development Server

// turbo
```bash
npm run dev
```

This will:
- Start the Vite development server
- Open the application at `http://localhost:5173`
- Enable hot module replacement (HMR) for instant updates

**Expected Output**:
```
VITE v5.4.19  ready in 158 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.32:5173/
```

### 4. Access the Application

Open your browser and navigate to:
- **Local**: http://localhost:5173/
- **Network**: Use the network URL to access from other devices on the same network

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## Troubleshooting

### "vite: command not found"
**Solution**: Run `npm install` first to install all dependencies.

### Import resolution errors
**Solution**: Ensure all folders (components, hooks, lib, etc.) are inside the `/src` directory. The path alias `@` points to `./src`.

### Port already in use
**Solution**: Kill the process using port 5173:
```bash
lsof -ti:5173 | xargs kill -9
```

### Browser cache issues
**Solution**: Hard refresh your browser (Cmd+Shift+R on Mac) or clear the cache.

## Environment Variables

The application uses environment variables defined in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_backend_api_url
```

Make sure these are configured correctly for the application to work with the backend.

## Project Structure

```
Candidate-FE/
├── src/
│   ├── components/     # UI components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # External service integrations
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── .env                # Environment variables
└── package.json        # Dependencies
```

## Next Steps

After the application is running:
1. Navigate to http://localhost:5173/
2. You'll see the landing page
3. Use `/login` to access the login page
4. Use `/register` to create a new candidate account
5. Explore other routes as defined in `App.tsx`

## Notes

- The dev server supports hot module replacement (HMR)
- Changes to `.tsx` and `.css` files will reflect immediately
- Changes to configuration files (vite.config.ts, tailwind.config.ts) may require a server restart
