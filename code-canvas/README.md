# TechSharma - Personal Tech Blog

A modern tech blog built with React, TypeScript, and Tailwind CSS, powered by a Strapi CMS backend.

## Features

- 📝 Article management with rich content
- 🏷️ Sections and tags for organization
- 🔖 Bookmark articles for later
- 💡 Ideas/drafts management
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- 🔐 User authentication

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Shadcn/ui components
- React Query for data fetching
- React Router for navigation

**Backend:**
- Strapi CMS (headless)
- PostgreSQL database

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Frontend Setup

```bash
cd code-canvas
npm install
cp .env.example .env
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your database in .env
npm run dev
```

## Environment Variables

### Frontend (`code-canvas/.env`)
```
VITE_STRAPI_URL=http://localhost:1337
```

### Backend (`backend/.env`)
```
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_database
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
```

## License

MIT
