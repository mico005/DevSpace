# 🚀 DevSpace — Indie Games Platform

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

**Live Demo:** [https://mico005.github.io/DevSpace/](https://mico005.github.io/DevSpace/)

## 📖 Project Overview

**DevSpace** is a lightweight, frontend-only digital distribution platform for indie games. This project was developed as a midterm group project for the **Pemrograman Web** course at Atma Jaya Catholic University of Indonesia.

The primary goal of this project is to demonstrate a fully functional e-commerce user journey—from browsing and filtering a catalog to managing a cart and owning a digital library—using strictly Vanilla HTML, CSS, and modular JavaScript without relying on heavy frontend frameworks.

## ✨ Key Features

- **Advanced Catalog Browsing:** \* Custom dual-slider for price range filtering.
  - Multi-select tag filtering (e.g., RPG, Management, Puzzle, etc).
  - Custom **Sequential Fuzzy Search** algorithm to handle typos and partial matches across game titles, developers, and tags.
- **Dynamic Cart Management:** Add, remove, and review items with state persisted locally via `localStorage`. Features dynamic total calculations and selected-item checkout.
- **Simulated Checkout Flow:** A modal-based checkout system that processes mock payments and securely clears purchased items.
- **Personal Library:** Purchased games are automatically routed to a persistent "My Library" interface managed via `sessionStorage`, complete with simulated download actions.
- **Responsive UI/UX:** A dark-themed, modern interface inspired by desktop gaming clients, fully responsive for both desktop and mobile views.

## 🏗️ Technical Architecture

The codebase strictly adheres to clean code principles, specifically the **Single Responsibility Principle (SRP)** and **Separation of Concerns**:

- **Modular ES6 JavaScript:** Logic is split into specialized modules (e.g., `api/data.js` for fetching, `components/cartModal.js` for UI, `utils/cartState.js` for storage).
- **Flat Logic & Performance:** Deep nesting is avoided. Search algorithms utilize early returns and bounded `while` loops to prevent memory leaks and ensure rapid DOM updates.
- **Pure DOM Manipulation:** UI updates and template generation (HTML strings) are handled cleanly without external templating engines.

## 📂 Project Structure

```text
├── data/
│   └── games.json            # Mock database of games
├── media/                    # Local assets (Images & Videos)
├── scripts/
│   ├── api/                  # Data fetching logic
│   ├── components/           # UI controllers (Grid, Modals, Filters, Hero)
│   ├── pages/                # Page-specific orchestrators (home, game, library)
│   └── utils/                # State management and pure helper functions
├── styles/                   # Modular CSS stylesheets
├── index.html                # Homepage / Storefront
├── game.html                 # Dynamic Game Detail Page
└── library.html              # User's Owned Games Collection
```

## 👥 Meet the Team

This project was collaboratively designed and developed by:

* **Michael Devon Eka Putra**
* **Ezekiel Matheo Barus**
* **Hesekiel Andhika Nainggolan**

---

*Developed for Pemrograman Web Midterm Project — 2026*
