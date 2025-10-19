✨ Astro Talk — Open Commit Fest 2025

Welcome to the repository for my talk on Astro at the Open Commit Fest 2025!

The Open Commit Fest is Openbank’s internal tech festival, created by and for employees to share their expertise, ideas, and passion for technology. During the event, teams from different hubs come together to deliver inspiring talks, live demos, and deep technical sessions.

This repository contains all the materials and demos from my session about Astro — a modern web framework designed for building fast, content-driven websites with an exceptional developer experience. 🌟

It’s split into two main parts:

- 📘 **00-astro-101** — fundamentals, each demo with its own README.
- 🛠️ **01-real-project** — a progressive build of a real blog with good design and a headless CMS, solving challenges step by step (from component tweaks to page-level work, content islands, server actions, and a final hands-on lab).

Each subfolder includes a **README** with the precise steps for that demo.

---

## 📂 Repository structure

```
/
├── 00-astro-101/            # Fundamentals (each demo has its own README)
│   ├── 00-fences
│   ├── 02-collections
│   ├── 03-components
│   ├── 04-styles
│   └── 05-layout
└── 01-real-project/         # Real blog, progressively built (each step has a README)
    ├── 01-post-list
    ├── 02-post-detail
    ├── 03-react-component
    ├── 04-server-action
    ├── 05-server-action-form
    └── 06-view-transitions
```

> 💡 **Tip:** Run each demo/step from inside its own folder and follow its local README.

---

## 🎯 Goals

- 🌟 Learn Astro fundamentals **from a React developer’s perspective**.
- ⚛️ Use **React inside Astro** effectively (only where it’s needed).
- 📡 Integrate a **headless CMS** to manage the content.
- 🏝️ Apply **client islands** for selective interactivity.
- 🔧 Implement **server actions** for real forms/mutations.

---

## ⚙️ Requirements

- 🔑 **Node.js** installed (LTS recommended)
- 📦 A package manager (**npm**, **pnpm**, or **yarn**)
- 💡 Basic familiarity with **React/JSX** and modern **JavaScript/TypeScript**

---

## ▶️ How to run a demo/step

1. 📥 Install dependencies (from the **demo/step folder** you want to run):

   ```bash
   npm install
   ```

   _(Use `pnpm` or `yarn` if you prefer.)_

2. 🚀 Start the dev server:

   ```bash
   npm run dev
   ```

3. ✅ Follow the **local README** in that folder for step-by-step instructions and challenges.
