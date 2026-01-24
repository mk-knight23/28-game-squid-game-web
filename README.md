# Squid Game Web - Red Light Green Light

A high-fidelity WebGL survival game built with **Vue 3**, **TresJS**, and **Tailwind CSS**. A professional reconstruction of the iconic "Red Light, Green Light" challenge, optimized for sub-second performance and immersive visual feedback.

## Overview
This project replaces the legacy React-based game with a modern Vue 3 architecture. It leverages declarative 3D scene management via TresJS and reactive state handling with Pinia, delivering a cinematic experience in the browser.

## Features Comparison

| Feature | Legacy (React) | Upgraded (Vue 3 v2.0) |
| :--- | :--- | :--- |
| **3D Engine** | Standard Three.js | **TresJS (Declarative WebGL)** |
| **Reactivity** | React Hooks | **Vue 3 Composition API (Signals-like)** |
| **State** | React Context | **Pinia (Enterprise State Management)** |
| **Design** | Basic CSS | **Tailwind CSS + Glassmorphism HUD** |
| **Performance**| Main-thread heavy | **Hardware-accelerated rendering** |
| **Mobile** | Limited | **Full Touch & Responsive Support** |

## Tech Stack
- **Framework:** Vue 3.5 (Script Setup)
- **3D Engine:** TresJS + Three.js
- **State:** Pinia
- **Styling:** Tailwind CSS (Suspense palette)
- **Icons:** Lucide Vue
- **Animations:** Motion One

## Setup & Build Instructions

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Deployment
Deployed to GitHub Pages via automated CI/CD workflows.

---

**License:** MIT
**Architect:** mk-knight23
