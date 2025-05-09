# Online-Learning-System


# 📚 Online Learning System (NestJS + TypeORM)

[![Node](https://img.shields.io/badge/node-≥18.x-brightgreen?logo=node.js)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/nestjs-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An extensible backend for an online learning platform. Built using **NestJS**, **TypeORM**, and **PostgreSQL**, this system supports user authentication, course management, and student enrollment features.

---

## ✨ Features

* JWT Authentication & Role-Based Authorization (`admin`, `student`, etc.)
* User Management (register, login, profile update, secure password hashing)
* Full Course CRUD (create, read, update, delete)
* Enrollment System (students can enroll/unenroll in courses)
* Built-in Guards (`JwtAuthGuard`, `RolesGuard`) and global validation pipes
* Unit & E2E Testing with Jest
* Docker/cloud deployment ready with environment config

---

## 🗂️ Project Structure

src/
├── auth/         - JWT auth logic, guards, strategies
├── user/         - User entities, DTOs, controller, service
├── course/       - Course management module
├── enroll/       - Enrollment functionality
├── app.module.ts
└── main.ts       - App bootstrap, global middleware

---

## 🛠️ Tech Stack

| Layer     | Tech                        |
| --------- | --------------------------- |
| Language  | TypeScript                  |
| Framework | NestJS 11                   |
| Database  | PostgreSQL 14 + TypeORM 0.3 |
| Auth      | Passport-JWT, bcrypt        |
| Testing   | Jest, SuperTest             |
| Dev Tools | ESLint, Prettier            |

---

## 🚀 Getting Started

1. Clone the repository and install dependencies:

   git clone [https://github.com/](https://github.com/)<your-org>/online-learning.git
   cd online-learning
   npm install

2. Configure environment variables:

   Copy `.env.example` to `.env` and update values:

   * DB\_HOST=localhost
   * DB\_PORT=5432
   * DB\_USERNAME=postgres
   * DB\_PASSWORD=1234
   * DB\_NAME=postgres
   * JWT\_SECRET=supersecret

3. Run the application:

   * Development mode:
     npm run start\:dev
   * Production build:
     npm run build && npm run start\:prod

4. Run tests:

   * Unit tests:
     npm test
   * End-to-end tests:
     npm run test\:e2e
   * Coverage report:
     npm run test\:cov

---

## 📖 API Overview

| Method | Endpoint      | Guard                     | Description         |
| ------ | ------------- | ------------------------- | ------------------- |
| POST   | /auth/signup  | –                         | Register new user   |
| POST   | /auth/login   | –                         | Login and get JWT   |
| GET    | /user/profile | JwtAuthGuard              | View user profile   |
| PATCH  | /user/profile | JwtAuthGuard              | Update user profile |
| POST   | /course       | JwtAuthGuard + RolesGuard | Create a course     |
| GET    | /course/\:id  | Public                    | View course details |
| POST   | /enroll       | JwtAuthGuard              | Enroll in a course  |

Note: API is self-documented using decorators. You can integrate Swagger (`@nestjs/swagger`) for interactive API docs.

