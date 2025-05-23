# 🧠 GitHub User Profile Analyzer

A React + ShadCN + TypeScript web app that allows you to input a GitHub username and get:

- ✅ List of their public repositories  
- 📊 (Advanced) Daily commit chart (if available from events API)

🔗 **Live Demo**: [Github-User-Analyzer](https://v0-github-user-analyzer-vqdrvj.vercel.app/)  

---

## 🚀 Technologies Used

- **React** (via Next.js)
- **TypeScript**
- **ShadCN UI** (Tailwind + Radix UI)
- **GitHub REST API**
- **Chart.js + react-chartjs-2** for visualizing commit activity

---
## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/github-user-analyzer.git
cd github-user-analyzer
```

### 2. Install Dependencies
Make sure you have Node.js 18+ and pnpm / npm / yarn installed.
```bash
pnpm install
```
If you're using npm instead:
```bash                                                                                                                                                                                                              
npm install
```

### 3. Run the App
```bash
pnpm dev
```
Visit: http://localhost:3000

---
### 🧠 How It Works

User enters a GitHub username.

App calls GitHub REST API:

/users/:username/repos → Fetches list of repositories

/users/:username/events → Used to build commit activity chart

Data is displayed using ShadCN components.

---
### 📦 Build & Export
```bash
pnpm build
pnpm start
```
