# CodeLab Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.13-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A modern, dark-themed source code marketplace built with React 18 + Vite.**

[Live Demo](https://codelab-frontend-hjey74uob-lucicore0001-7739s-projects.vercel.app) · [Backend Repo](https://github.com/ashishshahani19162/codelab-backend) · [API Docs](https://codelab-backend-l36z.onrender.com/swagger-ui.html)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Pages](#pages)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Integration](#api-integration)

---

## Overview

CodeLab is a full-stack source code marketplace where developers can upload, share, and download source code projects. This repository contains the **React 18 frontend**.

The UI is built with a dark developer aesthetic — `#0d1117` background, green `#00ff88` accent, Syne font for headings and DM Sans for body text.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18.3.1 |
| Build Tool | Vite 5.4.8 |
| Routing | React Router DOM 6.26.2 |
| State Management | Zustand 4.5.5 (with persist) |
| Server State | TanStack React Query 5.56.2 |
| HTTP Client | Axios 1.7.7 |
| Forms | React Hook Form 7.53.0 + Zod 3.23.8 |
| File Upload | React Dropzone 14.2.3 |
| Notifications | React Hot Toast 2.4.1 |
| Icons | React Icons |
| Email (Contact) | EmailJS Browser |
| Styling | Inline styles + Tailwind CSS 3.4.13 |
| Fonts | Syne (headings) + DM Sans (body) via Google Fonts |
| Deployment | Vercel |

---

## Features

### Authentication
- ✅ Register with username + email + password
- ✅ Login with email OR username
- ✅ Google OAuth2 social login
- ✅ JWT token stored in Zustand (persisted to localStorage)
- ✅ Auto logout on 401 response
- ✅ Email verification flow with token
- ✅ Verification banner for unverified accounts

### Landing Page
- ✅ Hero section with real-time project count from backend
- ✅ Dynamic tag filter tabs loaded from database
- ✅ Project grid with cover image, project title and about of project
- ✅ Search by title or tag
- ✅ Smart pagination (1 2 3 ··· 10)

### Project Detail
- ✅ Two-column layout — uploader profile sidebar + project content
- ✅ Cover image or animated code preview
- ✅ Tag display and search with tags
- ✅ Download button (authenticated users only)
- ✅ Download counter
- ✅ Uploader profile card (clickable → profile page)

### Profile Page
- ✅ Public profile with project list
- ✅ Edit profile modal (own profile only)
- ✅ Upload profile image
- ✅ Category filter tabs from user's project tags
- ✅ Stats — total projects, total downloads
- ✅ Three-dot menu for own profile actions

### Upload Page
- ✅ Drag and drop cover image upload
- ✅ Drag and drop ZIP file upload (up to 50MB)
- ✅ Tag input with seperated with comma (,)
- ✅ Form validation with Zod

### Contact Page
- ✅ Contact form with EmailJS integration
- ✅ Real-time email delivery to developer
- ✅ Social media links with real icons
- ✅ Success/error states

### Other
- ✅ Navbar with search, auth state, avatar
- ✅ Email verification page
- ✅ Error boundary
- ✅ Loading states and spinners

---

## Pages

| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Landing Page | No |
| `/login` | Login Page | No |
| `/register` | Register Page | No |
| `/projects/:id` | Project Detail | No |
| `/profile/:username` | Profile Page | No |
| `/upload` | Upload Project | Yes |
| `/contact` | Contact Page | No |
| `/verify-email` | Email Verification | No |
| `/oauth2/callback` | OAuth2 Callback | No |

---

## Project Structure

```
src/
│
├── api/
│   ├── axios.js          # Axios instance + interceptors
│   ├── authApi.js        # Auth endpoints (login, register, verify)
│   ├── projectApi.js     # Project endpoints (getAll, search, upload, download)
│   └── userApi.js        # User endpoints (profile, update, image upload)
│
├── components/
│   ├── common/
│   │   └── ErrorBoundary.jsx
│   └── VerificationBanner.jsx   # Shows for unverified accounts
│
├── pages/
│   ├── LandingPage.jsx          # Home + project grid + search + tags
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ProjectDetailPage.jsx
│   ├── ProfilePage.jsx
│   ├── UploadPage.jsx
│   ├── ContactPage.jsx
│   ├── VerifyEmailPage.jsx
│   └── OAuthCallbackPage.jsx
│
├── store/
│   └── authStore.js      # Zustand store (user, token, isAuthenticated)
│
├── App.jsx               # Routes + layout
└── main.jsx              # Entry point
```

---

## Environment Variables

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_BASE_URL=http://localhost:8080
```

For production (Vercel):
```env
VITE_API_URL=https://codelab-backend-l36z.onrender.com/api/v1
VITE_BASE_URL=https://codelab-backend-l36z.onrender.com
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend running on `http://localhost:8080`

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/codelab-frontend.git
cd codelab-frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_URL=http://localhost:8080/api/v1" > .env
echo "VITE_BASE_URL=http://localhost:8080" >> .env

# 4. Start development server
npm run dev

# 5. Open browser
open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Deployment

### Deployed on Vercel

**Add `vercel.json` in project root for React Router support:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Environment variables to set in Vercel dashboard:**

```
VITE_API_URL    https://codelab-backend-l36z.onrender.com/api/v1
VITE_BASE_URL   https://codelab-backend-l36z.onrender.com
```

Every push to `main` branch triggers automatic redeployment.

---

## API Integration

### Auth Flow

```js
// Register
POST /api/v1/auth/register
→ Returns { accessToken, refreshToken, user }
→ Stored in Zustand + localStorage

// Login
POST /api/v1/auth/login
→ Returns { accessToken, refreshToken, user }

// Google OAuth2
GET /oauth2/authorization/google
→ Redirects to Google
→ Callback: /oauth2/callback?accessToken=...&refreshToken=...

// Verify Email
GET /api/v1/auth/verify-email?token=xxx
→ Returns { message: "Email verified successfully" }
```

### Project Flow

```js
// Get all projects (paginated)
GET /api/v1/projects?page=0&size=12

// Search by title or tag
GET /api/v1/projects/search?q=react&page=0&size=12

// Get all tags
GET /api/v1/projects/tags

// Upload project (multipart)
POST /api/v1/projects
FormData: { title, description, about, tags, coverImage, zipFile }

// Download project
GET /api/v1/projects/:id/download
→ Returns { downloadUrl: "https://supabase.co/..." }
→ Frontend triggers browser download
```

### Axios Interceptors

```js
// Request: adds Bearer token automatically
Authorization: Bearer <JWT token from Zustand>

// Response 401: auto logout + redirect to /login
// Response 404: shows "Not found" message
// Response 500: shows "Server error" message
// No response: shows "Cannot connect to server"
```

---

## Key Implementation Details

### Zustand Auth Store

```js
// Persisted to localStorage as 'auth-storage'
{
  user: { id, username, email, profileImageUrl, role, emailVerified },
  token: "eyJhbGci...",
  isAuthenticated: true,
  setUser: (user, token) => ...,
  updateUser: (partial) => ...,
  logout: () => ...,
  getToken: () => token
}
```

### Image URL Handling

```js
// Handles both old local URLs and new Cloudinary URLs
src={
  url.startsWith('http')
    ? url                          // Cloudinary URL — use as-is
    : `${VITE_BASE_URL}${url}`    // Local URL — prepend base
}
```

### Tag Filtering

```js
// Tags from backend are objects {id, name}
// Always normalize:
const tagName = typeof tag === 'string' ? tag : tag.name
```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Backend offline | Shows "Cannot connect to server" |
| 401 Unauthorized | Auto logout + redirect to /login |
| 403 Forbidden | Shows "No permission" message |
| 404 Not Found | Shows not found message |
| 500 Server Error | Shows "Server error. Try again later" |
| Email not verified | Orange banner shown after login |

---

## License

MIT License — feel free to use this project for learning and building.

---

<div align="center">
Built with ❤️ using React 18 + Vite
</div>