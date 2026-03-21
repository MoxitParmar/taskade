# Full Stack Starter — Next.js + Convex + Clerk

This project was generated using **next-app-builder**, an opinionated
full-stack starter using modern tooling.

## Stack

- Next.js (App Router)
- Convex (Backend & Database)
- Clerk (Authentication)
- Tailwind CSS
- TypeScript

This starter is designed for building modern SaaS and production web apps quickly.

---

## Requirements

Make sure you have:

- Node.js 18+
- npm or pnpm or yarn or bun
- Git (recommended)

---

## create your project with next-app-builder

```
npx next-app-builder <project-name>
# or
yarn next-app-builder <project-name>
# or
pnpm next-app-builder <project-name>
# or
bunx next-app-builder <project-name>
```

After project creation:

```bash
cd your-project
npm run dev
````

or

```bash
bun dev
pnpm dev
```

Open:

```
http://localhost:3000
```

---

## Environment Variables

The CLI generated a `.env.local` file.

You must update values before authentication works.

```
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

CLERK_FRONTEND_API_URL= set on convex (jwt issuer)
CLERK_WEBHOOK_SIGNING_SECRET= set on convex ( web hook secret)
```

Convex values are automatically populated when running:

```bash
npx convex dev
```
now you will get this error in the terminal:

```Environment variable CLERK_FRONTEND_API_URL is used in auth config file but its value was not set.```

follow the next steps to set up Clerk authentication and resolve this error.

---

## Clerk Authentication Setup

### 1. Create Clerk App

Go to:

[https://dashboard.clerk.com](https://dashboard.clerk.com)

Create a new application.

---

### 2. Get API Keys 

These values are  documented in Clerk's official setup guide.
Copy:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

and paste them into `.env.local`.

---

### 3. Frontend API URL

In Clerk Dashboard:

```
API Keys → Frontend API
```

Copy:

```
https://your-app.clerk.accounts.dev
```

Set:

```
CLERK_FRONTEND_API_URL=
```

in `.env.local`.

---

## Convex + Clerk JWT Setup

Convex requires Clerk JWT authentication.

### Step 1 — Create JWT Template

In Clerk Dashboard:

```
JWT Templates → New template
```

Select Template name: `convex`

Save template.

---

### Step 2 — Configure Convex issuer

Run:

```bash
npx convex env set CLERK_FRONTEND_API_URL https://your-app.clerk.accounts.dev
```

Use the same value as your Clerk Frontend API URL.

---

### Step 3 — Restart Dev Server

```bash
npm run dev
```

Authentication is now connected.

---

## Project Structure Overview

```
app/          → Next.js routes
components/   → UI components
convex/       → backend functions & schema
lib/          → utilities
public/       → static assets
```

---

## Common Commands

Start dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

Run Convex locally:

```bash
npx convex dev
```

---

## Deployment

Typical deployment stack:

* Frontend → Vercel
* Backend → Convex cloud
* Auth → Clerk

Deployment guides:

* [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
* [https://docs.convex.dev](https://docs.convex.dev)
* [https://clerk.com/docs](https://clerk.com/docs)

---

## Troubleshooting

### Authentication not working

Check:

* Clerk keys set correctly
* JWT template configured
* Convex issuer configured
* Dev server restarted

---

### Convex not connecting

Run:

```bash
npx convex dev
```

again.

---
