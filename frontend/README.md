# 🌍 Job Connect-DE Monorepo

### 🇬🇧 English / 🇩🇪 Deutsch

**A bilingual open-source job posting, resume upload, and AI candidate-matching platform built with Angular 18 + Spring Boot 3.5.**

---

![Angular](https://img.shields.io/badge/Frontend-Angular_18-red?logo=angular)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.5-green?logo=springboot)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS_&_shadcn/ui-blue?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-purple)
![Languages](https://img.shields.io/badge/i18n-English%20%2F%20German-yellow)

---

## 🧭 Table of Contents

* [🧩 Overview](#-overview)
* [🏗️ Repository Structure](#️-repository-structure)
* [✨ Features](#-features)
* [💡 Architecture](#-architecture)
* [🧠 Tech Stack](#-tech-stack)
* [⚙️ Installation](#️-installation)
* [📦 Environment Variables](#-environment-variables)
* [🌐 Frontend Setup (Angular 18)](#-frontend-setup-angular-18)
* [🖥️ Backend Setup (Spring Boot 3.5)](#️-backend-setup-spring-boot-35)
* [📄 API Overview](#-api-overview)
* [🗂️ Folder Structure](#️-folder-structure)
* [🧠 Candidate Matching Logic (ATS)](#-candidate-matching-logic-ats)
* [🌍 Internationalization (i18n)](#-internationalization-i18n)
* [📈 Future Roadmap](#-future-roadmap)
* [🧑‍💻 Contributors](#-contributors)
* [📜 License](#-license)

---

## 🧩 Overview

**Job Connect-DE** is a modern bilingual career platform that connects job seekers and employers with features like:

* 🧾 Resume uploads
* 💼 Job postings
* 🧠 AI-style ATS candidate matching
* 🌐 English / German translation
* 🌓 Light/Dark mode
* 🧩 Admin dashboards

This is a **monorepo** setup — housing both frontend and backend for better version control, deployment, and CI/CD integration.

---

## 🏗️ Repository Structure

```
job-connect-de/
│
├── frontend/               # Angular 18 standalone application
│   ├── src/app/
│   ├── tailwind.config.js
│   ├── package.json
│   └── ...
│
├── backend/                # Spring Boot 3.5 REST API service
│   ├── src/main/java/com/jobconnectde/
│   ├── src/main/resources/
│   ├── pom.xml
│   └── ...
│
├── docs/                   # Documentation, ERD, architecture diagrams
├── README.md               # You are here
└── LICENSE
```

---

## ✨ Features

### 🌐 General

* English 🇬🇧 & German 🇩🇪 language support (ngx-translate)
* Monorepo structure (Angular + Spring Boot)
* Responsive TailwindCSS + shadcn/ui
* RESTful API endpoints
* PostgreSQL integration
* Role-based access control (Admin / Employer / Candidate)
* Dark & Light mode

### 👩‍💼 Frontend Features

* Resume upload & management
* Candidate-job matching (mock ATS logic)
* Job browsing with filters
* User profile with skill & resume linking
* Login / Register pages
* Admin dashboard (CRUD mock data)

### 🧠 Backend Features

* REST APIs for Jobs, Resumes, Users, Matches
* JWT Authentication
* File upload handling for resumes
* Spring Data JPA + PostgreSQL integration
* Candidate matching endpoint using text similarity (TF-IDF / cosine)
* Logging + Validation layers

---

## 💡 Architecture

```
Angular 18 Frontend (Tailwind + shadcn/ui + i18n)
      │
      ▼
Spring Boot 3.5 REST API (JWT, Validation, JPA)
      │
      ▼
PostgreSQL Database (jobs, resumes, users, matches)
```

**Communication:** JSON over HTTPS
**Authentication:** JWT Bearer Tokens
**Hosting:** Vercel (frontend) + Railway / Hetzner (backend)

---

## 🧠 Tech Stack

| Layer      | Technology                      | Description                 |
| ---------- | ------------------------------- | --------------------------- |
| Frontend   | Angular 18 (Standalone)         | Bilingual UI                |
| Styling    | TailwindCSS + shadcn/ui         | Modern design system        |
| i18n       | ngx-translate                   | English/German translations |
| State      | Angular Signals + RxJS          | Reactive UI                 |
| Backend    | Spring Boot 3.5                 | REST API service            |
| Database   | PostgreSQL                      | Persistent storage          |
| ORM        | Hibernate (JPA)                 | Object mapping              |
| Auth       | Spring Security (JWT)           | Authentication              |
| Build Tool | Maven                           | Backend build               |
| CI/CD      | GitLab Runner or GitHub Actions | Automation                  |
| Container  | Docker (optional)               | Deployment                  |

---

## ⚙️ Installation

### 🧩 Prerequisites

* Node.js 20+
* npm or yarn
* Angular CLI 18+
* JDK 21+
* Maven 3.9+
* PostgreSQL 15+

---

## 📦 Environment Variables

### Frontend (`frontend/src/environments/environment.ts`)

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

### Backend (`backend/src/main/resources/application.yml`)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jobconnectde
    username: postgres
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    database-platform: org.hibernate.dialect.PostgreSQLDialect

jwt:
  secret: YOUR_SECRET_KEY
```

---

## 🌐 Frontend Setup (Angular 18)

```bash
cd frontend
npm install
npm run start
```

Access: [http://localhost:4200](http://localhost:4200)

---

## 🖥️ Backend Setup (Spring Boot 3.5)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

API base URL: [http://localhost:8080/api](http://localhost:8080/api)

---

## 📄 API Overview

| Endpoint             | Method | Description                 |
| -------------------- | ------ | --------------------------- |
| `/api/auth/register` | POST   | Register a new user         |
| `/api/auth/login`    | POST   | Login and get JWT           |
| `/api/jobs`          | GET    | Get all job listings        |
| `/api/jobs/{id}`     | GET    | Job detail                  |
| `/api/resumes`       | POST   | Upload resume               |
| `/api/resumes`       | GET    | List uploaded resumes       |
| `/api/match/{jobId}` | GET    | Candidate-job match results |

> ⚙️ All secured endpoints require `Authorization: Bearer <token>` header.

---

## 🗂️ Folder Structure

```
frontend/
 ├── src/app/
 │    ├── features/
 │    │    ├── home/
 │    │    ├── jobs/
 │    │    ├── resume-upload/
 │    │    ├── resumes/
 │    │    ├── candidate-matching/
 │    │    ├── profile/
 │    │    ├── admin/
 │    │    └── auth/
 │    │         ├── login/
 │    │         └── register/
 │    ├── shared/
 │    └── layout/
 └── assets/
      ├── i18n/
      └── data/

backend/
 ├── src/main/java/com/jobconnectde/
 │    ├── controller/
 │    ├── service/
 │    ├── repository/
 │    ├── model/
 │    └── config/
 ├── src/main/resources/
 │    ├── application.yml
 │    └── static/
 └── pom.xml
```

---

## 🧠 Candidate Matching Logic (ATS)

Planned for future backend integration:

* Parse resumes using Apache Tika
* Extract keywords (NLP)
* Match against job descriptions using TF-IDF
* Return top 5 candidates with `matchScore`
* Integrate with Angular `/candidate-matching` view

Example API Response:

```json
[
  {
    "candidateName": "John Müller",
    "matchScore": 92.5,
    "skillsMatched": ["Java", "Spring Boot", "PostgreSQL"]
  }
]
```

---

## 🌍 Internationalization (i18n)

| Language | File                  | Example                                                    |
| -------- | --------------------- | ---------------------------------------------------------- |
| English  | `assets/i18n/en.json` | `"home.headline": "Connect Talent. Empower Careers."`      |
| German   | `assets/i18n/de.json` | `"home.headline": "Talente verbinden. Karrieren fördern."` |

Language toggle in the navbar saves preference to `localStorage`.

---

## 📈 Future Roadmap

| Phase | Feature                      | Status     |
| ----- | ---------------------------- | ---------- |
| 1     | Monorepo setup               | ✅ Done     |
| 2     | Job posting + resume upload  | ✅ Done     |
| 3     | Candidate matching (mock)    | ✅ Done     |
| 4     | Real ATS NLP logic           | 🚧 Planned |
| 5     | Stripe payment for employers | 🚧 Planned |
| 6     | Docker + CI/CD               | 🚧 Planned |
| 7     | Deployment to Hetzner Cloud  | 🚧 Planned |

---

## 🧑‍💻 Contributors

| Name                  | Role                                 |
| --------------------- | ------------------------------------ |
| **Sarvess Veeriyah**  | Full-Stack Developer / Project Owner |
| Open Source Community | Contributor                          |

---

## 📜 License

Licensed under the **MIT License**.
You are free to use, modify, and distribute this software.

---

## 🚀 Summary

**Job Connect-DE** is a bilingual, monorepo-based full-stack project built with **Angular 18 + Spring Boot 3.5** — featuring **resume uploads**, **ATS candidate matching**, **i18n**, and **responsive UI**.

It’s designed for **real-world deployment** and serves as a **reference for full-stack developers building multilingual SaaS systems**.
