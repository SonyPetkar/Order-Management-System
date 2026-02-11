##### Culinaria
Advanced MERN Order Management System

High-performance, sustainability-focused food-tech ecosystem

Culinaria is a production-grade MERN stack platform that extends beyond traditional food delivery systems. It integrates sustainability metrics, contextual UX logic, and collaborative ordering workflows into a scalable, test-driven architecture.

1. Key Highlights

Sustainability-aware delivery tracking (CO₂ savings calculation)

Context-driven UX (mood-based discovery engine)

Real-time freshness decay algorithm

QR-based collaborative group ordering

Role-Based Access Control (RBAC) with JWT

Full-stack test coverage (API + UI)

2. Core Features
2.1 Lifestyle Intelligence Layer

Mood Engine

Lifestyle-driven filtering logic implemented in MenuPage.jsx

Context categories: Healthy, Hungover, Celebrating

Eco Dashboard

Real-time CO₂ impact tracking

Batch-delivery efficiency visualization

Ingredient Provenance

Transparent supply chain mapping per menu item

Group Session Ordering

Dynamic QR code generation (QR Server API)

Shared cart synchronization logic

2.2 Security & System Architecture (Phase 1)

Authentication & Authorization

JWT-based authentication

Role-Based Access Control (RBAC)

Stateless architecture for horizontal scaling

State Management

Custom React Hooks:

useCart

useAuth

useMenu

Persistent session handling

Backend Architecture

Decoupled MVC structure

Centralized error handling

Input validation middleware

Structured middleware pipeline

3. Technical Architecture
Frontend

React 18 (Vite-powered)

Tailwind CSS (Editorial-style UI + backdrop blur effects)

Custom hooks architecture

React Testing Library

Backend

Node.js + Express

RESTful API design

Middleware-based request lifecycle

Jest + Supertest testing suite

Database

MongoDB + Mongoose

Geo-spatial ready schema design

Document-based data modeling

4. Project Structure
Culinaria-App/
│
├── backend/
│   ├── src/
│   │   ├── models/        # Mongoose Schemas (User, Order, MenuItem)
│   │   ├── controllers/   # Business Logic & Seed Logic
│   │   ├── middleware/    # Auth, Validation, Error Handling
│   │   ├── routes/        # API Route Definitions
│   │   └── tests/         # Jest + Supertest Suites
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI Components
    │   ├── pages/         # Route-level Pages
    │   ├── hooks/         # Custom Hooks (State Logic)
    │   ├── services/      # API Layer
    │   └── __tests__/     # React Testing Library Suites
    └── package.json
5. Environment Setup
Prerequisites

Node.js v16+

MongoDB (Atlas or Local Instance)

Backend Environment Variables (/backend/.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
6. Installation
Start Backend
cd backend
npm install
npm run dev
Start Frontend
cd frontend
npm install
npm run dev
7. Self-Seeding Mechanism

If the database is empty, the system automatically populates Phase 2 metadata on the first GET request.
This enables rapid local setup without manual seeding scripts.

8. Testing Strategy (TDD)
Backend API Tests

CRUD operations

Validation checks

Order status transitions

Auth & RBAC verification

cd backend
npm test
Frontend UI Tests

Mood filtering logic

Component rendering

Cart state persistence

cd frontend
npm test
9. Performance Metrics

Lighthouse Score: 95+ (Performance & Accessibility)

API Latency: <150ms (Menu Discovery)

Stateless Auth Architecture: Horizontally scalable

10. Engineering Philosophy

Culinaria demonstrates:

Production-ready architecture patterns

Clean separation of concerns

Test-driven development

Scalable authentication design

Feature innovation beyond CRUD