# Candidate-FE

**QuickOnboardAI Candidate Frontend Application**

A modern, responsive web application built for job candidates to manage their job search journey, from resume building to interview preparation.

---

## 🚀 Features

### 🎯 Core Features
- **Social Authentication**: Login with Google, LinkedIn, or GitHub
- **Experience-Based Onboarding**: Separate flows for freshers and experienced professionals
- **Resume Builder**: Step-by-step resume creation with ATS optimization
- **JD Matcher**: Match your resume against job descriptions with AI-powered analysis
- **Interview Preparation**: Practice interviews with AI and connect with trainers
- **Job Tracker**: Track your job applications and interview progress

### 📝 Resume Builder
- Profile Section
- Education Section
- Experience Section (for experienced candidates)
- Fresher Section (certifications, achievements, GitHub projects for freshers)
- ATS Optimization with real-time scoring

### 💼 Job Management
- Job application tracker
- Interview scheduler
- Application status tracking
- Offer management

### 🎓 Interview Preparation
- AI-powered practice interviews
- Connect with professional trainers
- Interview tips and resources
- Payment integration for premium features

---

## 🛠️ Tech Stack

- **Framework**: React 18.3.1
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase
- **Authentication**: Supabase Auth + OAuth

---

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn or bun
- Supabase account (for backend)

---

## 🔧 Installation

1. **Clone the repository**
```bash
cd /Users/credr/Desktop/QuickOnboardAI/Candidate-FE
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OAuth Configuration (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id

# API Configuration
VITE_API_BASE_URL=your_backend_api_url
```

4. **Run the development server**
```bash
npm run dev
```

The application will start at `http://localhost:5173`

---

## 📁 Project Structure

```
Candidate-FE/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── ui/         # shadcn/ui components
│   │   └── common/     # Shared components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── integrations/    # External service integrations
│   │   └── supabase/   # Supabase client
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── tailwind.config.ts   # TailwindCSS configuration
```

---

## 🎯 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Candidate login |
| `/register` | Candidate registration |
| `/forgot-password` | Password recovery |
| `/experience-level` | Choose Fresher/Experienced |
| `/fresher-profile` | Fresher profile builder |
| `/resume` | Resume builder dashboard |
| `/resume/profile` | Profile section |
| `/resume/education` | Education section |
| `/resume/experience` | Experience section |
| `/resume/ats-optimization` | ATS optimization |
| `/jd-match` | JD matcher |
| `/interview` | Interview preparation |
| `/interview/practice` | Practice interviews |
| `/interview/trainers` | Connect with trainers |
| `/interview/payment` | Payment page |
| `/tracker` | Job tracker |
| `/profile` | User profile |

---

## 🔨 Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

---

## 🧪 Linting

```bash
npm run lint
```

---

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `VITE_LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | No |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth client ID | No |
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

---

## 🎨 Design System

The application uses a modern design system with:
- **Colors**: Vibrant gradients and modern color palettes
- **Typography**: Inter and Roboto fonts from Google Fonts
- **Animations**: Smooth transitions and micro-animations
- **Responsiveness**: Mobile-first design approach
- **Glassmorphism**: Modern UI effects with backdrop blur

---

## 🔐 Authentication

The application supports multiple authentication methods:

1. **Email/Password**: Traditional email and password login
2. **Google OAuth**: Sign in with Google
3. **LinkedIn OAuth**: Sign in with LinkedIn
4. **GitHub OAuth**: Sign in with GitHub

All authentication is managed through Supabase Auth.

---

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## 📝 Documentation

- [Fresher Experience Guide](../Candidate-Client-FE/FRESHER_EXPERIENCE_GUIDE.md)
- [Social Auth Setup](../Candidate-Client-FE/SOCIAL_AUTH_SETUP.md)
- [Implementation Guide](../Candidate-Client-FE/IMPLEMENTATION_COMPLETE.md)

---

## 🤝 Contributing

This is a private repository for QuickOnboardAI. For contributions:

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for code review

---

## 📄 License

Private and Proprietary - QuickOnboardAI © 2026

---

## 👥 Support

For support, contact the development team or create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: January 31, 2026
# Employee-FE
