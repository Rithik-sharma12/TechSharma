<div align="center">

# 🚀 TechSharma

### A Modern Personal Tech Blog

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Strapi](https://img.shields.io/badge/Strapi-5.x-2F2E8B?style=for-the-badge&logo=strapi&logoColor=white)](https://strapi.io/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

*Exploring the depths of technology, one article at a time.*

[Live Demo](#) · [Report Bug](https://github.com/Rithik-sharma12/TechSharma/issues) · [Request Feature](https://github.com/Rithik-sharma12/TechSharma/issues)

</div>

---

## 📸 Screenshots

<div align="center">

### 🌙 Dark Mode
<!-- Add your dark mode screenshot -->
<img src="screenshots/homepage-dark.png" alt="TechSharma Dark Mode" width="800"/>

### ☀️ Light Mode
<!-- Add your light mode screenshot -->
<img src="screenshots/homepage-light.png" alt="TechSharma Light Mode" width="800"/>

### 📖 Article View
<!-- Add your article view screenshot -->
<img src="screenshots/article-view.png" alt="Article Reading View" width="800"/>

</div>

> 💡 **Note:** Add your screenshots to the `screenshots/` folder and they will display here automatically.

---

## ✨ Features

<table>
<tr>
<td>

### 📝 Content Management
- Rich article editor
- Section-based organization
- Tag system for categorization
- Draft & publish workflow

</td>
<td>

### 🎨 Modern UI/UX
- Clean, minimal design
- True black dark mode
- Smooth animations
- Mobile-first responsive

</td>
</tr>
<tr>
<td>

### 🔐 Authentication
- User registration & login
- JWT-based auth
- Profile management
- Admin dashboard

</td>
<td>

### 📚 Reader Features
- Bookmark articles
- Reading progress bar
- Syntax-highlighted code blocks
- Easy navigation

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend (`code-canvas/`)

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **Shadcn/ui** | Component Library |
| **React Query** | Data Fetching |
| **React Router** | Navigation |

### Backend (`backend/`)

| Technology | Purpose |
|------------|---------|
| **Strapi 5** | Headless CMS |
| **PostgreSQL** | Database |
| **Node.js** | Runtime |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ 
- **npm** or **bun**
- **PostgreSQL** database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rithik-sharma12/TechSharma.git
   cd TechSharma
   ```

2. **Setup Frontend**
   ```bash
   cd code-canvas
   npm install
   cp .env.example .env
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start Development Servers**
   
   Terminal 1 - Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   cd code-canvas
   npm run dev
   ```

5. **Open in browser**
   - Frontend: http://localhost:8080
   - Strapi Admin: http://localhost:1337/admin

---

## ⚙️ Environment Variables

### Frontend (`code-canvas/.env`)

```env
VITE_STRAPI_URL=http://localhost:1337
```

### Backend (`backend/.env`)

```env
# Server
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_database_name
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password

# Secrets (generate your own!)
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret
```

---

## 📁 Project Structure

```
TechSharma/
├── 📁 backend/              # Strapi CMS
│   ├── 📁 config/           # Strapi configuration
│   ├── 📁 src/
│   │   └── 📁 api/          # Content types (article, section, etc.)
│   └── 📄 package.json
│
├── 📁 code-canvas/          # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable components
│   │   ├── 📁 pages/        # Page components
│   │   ├── 📁 lib/          # Utilities & API
│   │   └── 📁 contexts/     # React contexts
│   └── 📄 package.json
│
├── 📁 screenshots/          # UI screenshots
└── 📄 README.md
```

---

## 🎨 Themes

TechSharma supports both light and dark modes with a true black dark theme for OLED displays.

| Light Mode | Dark Mode |
|------------|-----------|
| Clean white background | Pure black (#000) background |
| Soft gray accents | Subtle gray borders |
| Easy on the eyes | Perfect for night reading |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Made with ❤️ by [Rithik Sharma](https://github.com/Rithik-sharma12)

⭐ Star this repo if you find it helpful!

</div>
