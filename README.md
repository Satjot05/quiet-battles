# ⚡ Satjot Singh Saini — Personal Portfolio

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Status-Live%20%26%20Active-success?style=for-the-badge&logo=vercel&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.0-black?style=for-the-badge&logo=framer&logoColor=white)
![EmailJS](https://img.shields.io/badge/EmailJS-4.4.1-FF7A00?style=for-the-badge&logo=mailgun&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<p align="center">
  <strong>A modern, high-performance developer portfolio built with React, Vite, Tailwind CSS, and Framer Motion.</strong>
  <br />
  Featuring 4 dynamic color themes, smooth scroll-triggered animations, interactive particle meshes, and direct EmailJS integration.
</p>

[Explore Projects](#-featured-projects) • [Live Demo](#-live-preview) • [Theme Engine](#-dynamic-theme-system) • [Quick Start](#-getting-started) • [Customization](#-customization-guide)

</div>

---

## 📖 Overview

This repository hosts the official personal portfolio of **Satjot Singh Saini**, an **AI/ML Engineer and Full-Stack Developer** (B.Tech Computer Science & Engineering specializing in AI & ML, 2023–2027).

The portfolio is designed with a futuristic, clean developer aesthetic that balances high-impact visuals with optimal performance, accessibility, and responsiveness across all device viewports.

### ✨ Key Features

- 🎨 **Multi-Theme Engine**: Switch on the fly between 4 distinct visual themes (**Midnight**, **Cyber**, **Ember**, and **Arctic**) without page reloads or layout shift.
- 🚀 **Buttery Framer Motion Animations**: Smooth section entrances, staggered cards, animated skill meters, and micro-interactions on buttons and project tiles.
- ⌨️ **Real-Time Typewriter Hero**: Dynamic multi-role typing effect highlighting core competencies in AI, Machine Learning, and Full-Stack Development.
- 🌌 **Generative Grid & Floating Particles**: Ambient canvas-free animated particles and radial background glow meshes.
- 📬 **Serverless Contact Form**: Direct client-to-inbox messaging powered by **EmailJS** with live form validation, loading states, and status alerts.
- 📱 **Fully Responsive & Accessible**: Mobile slide-out drawer navigation, auto-scroll spy navbar, and cross-browser consistency.
- ⚡ **Blazing Fast Vite Tooling**: Sub-second Hot Module Replacement (HMR) and optimized static asset chunking.
- 📄 **One-Click Resume Access**: Integrated resume download handler for prospective recruiters and collaborators.

---

## 🎨 Dynamic Theme System

The portfolio includes an in-memory theme context system providing instant transitions between 4 color schemes:

| Theme | Preview | Vibe | Highlight Accents |
| :--- | :---: | :--- | :--- |
| **Midnight** *(Default)* | 🟣 ⬛ 🔵 | Deep space, modern developer dark mode | Violet (`#7c3aed`), Cyan (`#06b6d4`), Slate |
| **Cyber** | 🟢 ⬛ 💖 | High-tech cyberpunk neon matrix | Neon Cyan (`#00fff0`), Magenta (`#ff00aa`) |
| **Ember** | 🟠 ⬛ 🔴 | High-energy volcanic heat | Bright Amber (`#f97316`), Crimson (`#ef4444`) |
| **Arctic** | 🔵 ⚪ 🔷 | Crisp, high-contrast daylight aesthetic | Royal Blue (`#3b82f6`), Sky Blue (`#06b6d4`), Ice White |

---

## 🛠️ Tech Stack & Architecture

### **Core Frontend**
- **[React 18](https://react.dev/)**: Component architecture, custom hooks, and React Context state.
- **[Vite 7](https://vitejs.dev/)**: Next-generation frontend build tooling and local dev server.
- **[Tailwind CSS 3](https://tailwindcss.com/)**: Utility-first responsive styling with custom animation keyframes.
- **[Framer Motion 11](https://www.framer.com/motion/)**: Physics-based animations, layout transitions, and scroll reveals.
- **[Lucide React](https://lucide.dev/)**: Clean, lightweight icon suite.

### **Typography**
- **Syne**: Geometric display heading typography.
- **DM Sans**: High-legibility modern body sans-serif.
- **JetBrains Mono**: Clean monospaced font for code snippets and tech badges.

### **Integrations & Services**
- **[EmailJS](https://www.emailjs.com/)**: Client-side transactional email service for the contact form.
- **[Vercel](https://vercel.com/)**: Preconfigured zero-configuration serverless hosting via `vercel.json`.

---

## 🚀 Featured Projects

The portfolio showcases key engineering work across deep learning, large language models, and full-stack software:

### 1. [VidMind](https://github.com/Satjot05/Vidmind)
> **LLM-Powered Video Intelligence, Notes & Quiz Generator**
> - **Tech**: React 18, Python (Flask), Meta LLaMA 3.3 70B (Groq API), Vite, YouTube Transcript API
> - Full-stack AI application that ingests any YouTube video URL and generates detailed 400–500 word summaries, structured study notes, interactive 10-question quizzes with scoring and explanations, and visual mind maps.
> - Features automated model rotation across rate limits, multi-strategy caption extraction, and styled PDF downloads.

### 2. [X-Ray Image Classifier](https://github.com/Satjot05/X-Ray-Image-Classifier)
> **Deep Learning Diagnostic Triage for Pediatric Chest Radiographs**
> - **Tech**: Python, PyTorch, Convolutional Neural Networks (CNN), Deep Learning, OpenCV
> - AI-assisted medical diagnostic triage system trained to evaluate pediatric chest X-rays and classify scans as `NORMAL` or `PNEUMONIA`.
> - Demonstrates clinical screening automation with medical image preprocessing, feature extraction, and prediction confidence scoring.

### 3. [Bus Attendance System](https://github.com/Satjot05/Bus-Attendance-System)
> **Automated Campus Transit Logistics & Student Attendance Tracking**
> - **Tech**: React, Node.js, Express.js, MongoDB (MERN Stack), REST APIs, Tailwind CSS
> - Full-stack web platform built to automate college bus transportation logistics and student boarding verification.
> - Replaces error-prone paper rosters with digital check-in records, route management, driver assignment, and transport administration controls.

---

## 📂 Project Directory Structure

```text
Personal-Portfolio/
├── public/
│   ├── favicon.svg                     # Custom SVG browser favicon
│   └── Satjot_Singh_Resume.docx        # Downloadable resume document
├── src/
│   ├── App.jsx                         # Main application layout, theme state, and sections
│   ├── main.jsx                        # React root entry point
│   └── index.css                       # Tailwind CSS directives and base layer
├── index.html                          # HTML shell, web fonts & SEO OpenGraph tags
├── package.json                        # Dependencies, scripts and package metadata
├── postcss.config.js                   # PostCSS configuration for Tailwind
├── tailwind.config.js                  # Tailwind themes, extended fonts, keyframes
├── vercel.json                         # Vercel deployment and routing rules
├── vite.config.js                      # Vite plugin pipeline and server config
└── README.md                           # Documentation
```

---

## ⚡ Getting Started

Follow these steps to run the portfolio locally on your machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (or `pnpm` / `yarn`)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Satjot05/Personal-Portfolio.git
   cd Personal-Portfolio
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port specified in terminal output).

---

## ⚙️ Available Scripts

In the project root, you can execute:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:3000` with instant HMR. |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` directory. |
| `npm run preview` | Locally serves the production build from `dist/` to verify optimizations. |
| `npm run lint` | Runs ESLint across all `.js` and `.jsx` files to ensure code quality. |

---

## 🔧 Customization Guide

If you'd like to fork or adapt this portfolio for your own profile:

### 1. Update Personal Profile & Copy
Open `src/App.jsx` and edit the personal details:
- **Hero Title & Subtitle**: Lines ~770–806
- **Typewriter Words**: Update `TYPING_TEXTS` array (~line 444)
- **About Bio & Code Terminal**: Inside the `<About />` component (~line 883)
- **Stats Counter**: Adjust numbers for projects built, hackathons, CGPA (~line 844)

### 2. Configure Projects
Locate the `PROJECTS_DATA` array in `src/App.jsx` (~line 412) and update:
```javascript
const PROJECTS_DATA = [
  {
    title: "Your Project Name",
    tagline: "Short one-line pitch",
    description: "Detailed description of the problem and solution...",
    tech: ["Tech 1", "Tech 2", "Tech 3"],
    icon: "🚀",
    link: "https://github.com/your-username/your-repo",
  },
  // Add additional projects as needed
];
```

### 3. Update Skills Matrix
Modify `SKILLS_DATA` in `src/App.jsx` (~line 373) to reflect your own technical proficiencies and percentages.

### 4. Enable EmailJS Contact Form
To connect the contact form to your own email address:
1. Register for a free account at [EmailJS](https://www.emailjs.com/).
2. Create an **Email Service** (e.g. Gmail) and obtain your `Service ID`.
3. Create an **Email Template** with variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{message}}`
   - `{{to_name}}`
4. Copy your **Public Key** from *Account → API Keys*.
5. In `src/App.jsx` (~line 24), fill in your credentials:
   ```javascript
   const EMAILJS_SERVICE_ID  = "your_service_id";
   const EMAILJS_TEMPLATE_ID = "your_template_id";
   const EMAILJS_PUBLIC_KEY  = "your_public_key";
   ```

### 5. Replace Resume & Favicon
- Place your new resume file in the `public/` directory and update the `href` and `download` attributes in `src/App.jsx`.
- Replace `public/favicon.svg` with your own personal logo or avatar.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

This project contains a `vercel.json` file ready for automatic deployment:

1. Push your repository to GitHub.
2. Visit [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Leave build settings as default:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

### Deploy to Netlify

1. Create a `_redirects` file in `public/` with:
   ```text
   /* /index.html 200
   ```
2. Connect your repository on [Netlify](https://www.netlify.com/).
3. Set **Build command** to `npm run build` and **Publish directory** to `dist`.

---

## 👤 Author & Connect

**Satjot Singh Saini**  
*AI/ML Engineer & Full-Stack Developer*

- **GitHub**: [@Satjot05](https://github.com/Satjot05)
- **LinkedIn**: [Satjot Singh Saini](https://www.linkedin.com/in/satjot-singh-saini/)
- **Portfolio**: [Satjot's Portfolio](https://github.com/Satjot05)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE). You are welcome to customize and use it for your own portfolio. A mention or star ⭐ is appreciated!
