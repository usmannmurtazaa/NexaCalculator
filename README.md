# 🎓 Nexa Calculator | GPA, CGPA & Scientific Calculator

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Firebase-12.13-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge" alt="Version" />
</div>

<div align="center">
  <img src="https://img.shields.io/github/stars/usmannmurtazaa/NexaCalculator?style=social" alt="GitHub Stars" />
  <img src="https://img.shields.io/github/forks/usmannmurtazaa/NexaCalculator?style=social" alt="GitHub Forks" />
  <img src="https://img.shields.io/github/issues/usmannmurtazaa/NexaCalculator?style=social" alt="GitHub Issues" />
</div>

<br />

<div align="center">
  <h3>
    <a href="#-live-demo">🚀 Live Demo</a>
    <span> • </span>
    <a href="#-features">✨ Features</a>
    <span> • </span>
    <a href="#-installation">📦 Installation</a>
    <span> • </span>
    <a href="#-usage">📖 Usage</a>
    <span> • </span>
    <a href="#-contributing">🤝 Contributing</a>
  </h3>
</div>

<br />

<p align="center">
  <img src="./images/NexaCalculator.png" alt="Nexa Calculator Screenshot" width="800" />
</p>

---

## 📋 Overview

**Nexa Calculator** is a production‑ready, all‑in‑one academic calculator built with React + Vite and powered by Firebase analytics. It delivers a premium SaaS experience with glassmorphism UI, smooth animations, and full mobile responsiveness. Students can calculate semester GPA, cumulative CGPA, and perform advanced scientific calculations, while every interaction is tracked for insights.

### 🎯 Key Highlights

- **3‑in‑1 Academic Tool** – GPA, CGPA, and Scientific Calculator in one polished interface
- **Multiple GPA Scales** – 4.0, 5.0, and 10.0 grading systems supported
- **Premium UI/UX** – Glassmorphism, modern gradients, dark/light/system theme, fluid animations
- **Mobile‑First** – Fully responsive across all devices and screen sizes (zero horizontal scroll)
- **Real‑time Feedback** – Animated numerical counters and progress bars
- **Academic Insights** – Automatic standing evaluation (Dean’s List, Probation, etc.)
- **Professional Exports** – PDF & CSV with Firebase activity tracking
- **Firebase Integration** – Analytics, visitor metrics, export tracking, device/browser logging (retry‑safe)
- **Contact System** – EmailJS‑powered form with validation, success states, and analytics
- **SEO Optimized** – Structured data, meta tags, Open Graph, Twitter Cards, sitemap, robots.txt
- **PWA Ready** – Manifest, icons, installable standalone mode (offline pending)
- **Accessibility** – ARIA roles, keyboard navigation, screen‑reader support

---

## ✨ Features

### 📊 Semester GPA Calculator

- Up to **8 courses** per semester
- Credit hour selection (1‑6 credits)
- Course code input for identification
- Quality points auto‑computed
- Animated GPA display with smooth transitions
- **Target GPA Calculator** – Plan your academic goals
- **Academic standing** evaluation:
  - 🏆 Outstanding — Dean’s List (92.5%+)
  - ⭐ Very Good Standing (80%+)
  - 👍 Good Standing (65%+)
  - 📊 Satisfactory (50%+)
  - ⚠️ Below Average (35%+)
  - 🚫 Academic Probation (<35%)
- Visual progress bar with color feedback
- Export to **PDF / CSV** with Firebase tracking

### 📈 Cumulative CGPA Calculator

- Up to **8 semesters** of GPA values
- Automatic CGPA calculation
- Best semester tracking
- Total GPA sum display
- Real‑time input validation
- Same academic standing evaluation
- Export with full student metadata

### 🧮 Scientific Calculator

- Normal mode: basic arithmetic, memory functions (MC, MR, M+, M‑), percentage
- Scientific mode: sin, cos, tan (deg/rad), inverse trig, sqrt, cbrt, powers, log, ln, π, e, absolute value, factorial, reciprocal, sign toggle
- Calculation history with clear option
- Glassmorphism‑styled button grid
- Keyboard support (numbers, operators, Enter, Escape)

### 🎨 Premium UI/UX

- Dark/Light/System theme (persisted in localStorage, instant transitions)
- Glassmorphism cards, buttons, inputs, modals
- Smooth CSS animations (fade, slide, scale, shimmer)
- Interactive hover states and focus indicators
- Responsive grids and clamp‑based typography
- Professional loading spinners and skeletons

### 🔥 Firebase Integration

- **Analytics** – Track page loads, tab switches, GPA/CGPA calculations, theme changes, exports
- **Firestore** – Stores export records (with retry and server timestamps)
- **Export Tracker** – Logs student name, ID, university, semester, GPA, credits, date, export type, timestamp, device info
- **Visitor Analytics** – Simulates active users with milestone events
- All Firebase functions are modular, async, and error‑handled

### 📧 Contact System

- EmailJS for direct messaging (kept only for contact form)
- Required field validation and email format check
- Success confirmation with “Send Another Message” button
- Loading spinner on submit
- Firebase logs contact form submissions

---

## 🚀 Live Demo

**[https://nexacalculator.netlify.app/](https://nexacalculator.netlify.app/)**

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite 5** | Build tool and dev server |
| **JavaScript ES6+** | Language |
| **Firebase 12** | Analytics, Firestore, export tracking |
| **EmailJS** | Contact form emails |
| **jsPDF** | PDF export (dynamic import for code splitting) |
| **Google Fonts** | DM Sans, Playfair Display, JetBrains Mono |
| **CSS Animations** | Custom keyframes and transitions |

---

## 📦 Installation

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- A Firebase project (optional for analytics; the app works without it)

### 1. Clone the repository

```bash
git clone https://github.com/usmannmurtazaa/NexaCalculator.git
cd NexaCalculator

2. Install dependencies
bash
npm install

3. Start development server
bash
npm run dev
```
---

📖 Usage
Choose a tab – GPA, CGPA, or Scientific Calculator.

Select your scale – 4.0, 5.0, or 10.0.

Add courses / semesters – Fill in details and calculate.

View results – GPA with standing, progress bar, target GPA calculator.

Export – Click “Export Academic Record” to save as PDF or CSV (data logged to Firebase).

Contact – Use the contact form to send feedback.

---


🧱 Project Structure
text
src/
├── App.jsx
├── main.jsx
├── constants/
│   ├── grades.js
│   ├── limits.js
│   └── theme.js
├── hooks/
│   ├── useGPA.js
│   ├── useCGPA.js
│   ├── useContactForm.js
│   ├── useVisitors.js
│   └── useDarkMode.js
├── utils/
│   ├── gpa.js
│   ├── pdfExport.js
│   └── csvExport.js
├── firebase/
│   ├── firebase.js
│   ├── analytics.js
│   └── exportTracker.js
├── components/
│   ├── Header.jsx
│   ├── Navigation.jsx
│   ├── GPACalculator.jsx
│   ├── CGPACalculator.jsx
│   ├── CalculatorPanel.jsx
│   ├── ContactSection.jsx
│   ├── Footer.jsx
│   ├── LoadingSpinner.jsx
│   ├── CourseCard.jsx
│   ├── ResultCard.jsx
│   ├── CGPAResultCard.jsx
│   ├── GradeExtras.jsx
│   ├── ExportModal.jsx
│   ├── Toast.jsx
│   └── AnimatedNumber.jsx
└── styles/
    └── global.css

---

🔮 Roadmap

PWA – Offline support and service worker

LocalStorage history – Save past calculations

User accounts – Cloud sync (Firebase Auth)

Graphs – GPA trends across semesters

i18n – Multi‑language support

---


👨‍💻 Author
Usman Murtaza

https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white

https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white

https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white

---

📄 License
MIT License – see the LICENSE file for details.

⭐ Support
If you find this project helpful, please consider starring the repository, reporting bugs, or sharing it with others. Contributions are welcome!

---
