# Pravas Saathi

> **A thoughtful travel companion for planning journeys, organizing itineraries, managing travel expenses, and discovering destinations.**

Pravas Saathi is a modern travel-planning web application built for a hackathon. It combines a React/Vite frontend with Supabase authentication and database functionality.

The application is designed around the complete journey of a traveller:

```text
Discover → Plan → Create Trip → Add Stops → Add Activities → Track Expenses → Travel
```

---

## Table of Contents

- [About](#about)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Application Flow](#application-flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Supabase Architecture](#supabase-architecture)
- [Authentication](#authentication)
- [Routing](#routing)
- [Trip Management](#trip-management)
- [UI and Animation](#ui-and-animation)
- [Security](#security)
- [Git Workflow](#git-workflow)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [Free-Tier Considerations](#free-tier-considerations)
- [Hackathon MVP](#hackathon-mvp)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## About

**Pravas Saathi** means a travel companion.

The goal is to bring the major parts of travel planning into one workspace instead of forcing travellers to manage destinations, itineraries, activities, budgets, and personal preferences across multiple applications.

The product is designed to grow from a hackathon MVP into a complete travel-planning platform.

---

## Core Features

### Authentication

- User registration
- Login
- Logout
- Persistent Supabase session
- Protected application routes

### Personalized Dashboard

- Personalized greeting
- Journey count
- Travel style
- Preferred budget
- Profile completion
- Existing trips
- Planning tips
- Quick trip creation

### Trip Planning

Users can create a trip and open its dedicated trip-details page.

A trip can contain:

- Trip name
- Description
- Start date
- End date
- Budget
- Stops
- Activities
- Expenses

### Stops

Stops form the structure of an itinerary.

Example:

```text
Gujarat Journey
├── Ahmedabad
├── Vadodara
├── Statue of Unity
└── Surat
```

### Activities

Activities can be associated with individual stops.

```text
Ahmedabad
├── Visit Sabarmati Ashram
├── Explore old city
└── Try local food
```

### Expenses

The application includes expense-related functionality for managing travel costs and comparing planned spending with the trip budget.

### Profile

The profile stores travel-related information such as:

- Full name
- Home city
- Travel style
- Preferred budget

### Explore

A separate destination-discovery experience is provided for finding places before planning a journey.

### Planning Tips

Planning tips can be loaded from Supabase and displayed according to their priority.

---

# Technology Stack

## Frontend

- React
- Vite
- JavaScript / JSX
- CSS
- React Router

## Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)

## Development

- Node.js
- npm
- Git
- GitHub
- VS Code

---

# Application Flow

## Public Flow

```text
Landing
   ├── Login
   └── Sign Up
```

## Authenticated Flow

```text
Dashboard
   ├── Explore
   ├── Plan a Trip
   │      └── Create Trip
   │             └── Trip Details
   │                    ├── Add Stop
   │                    ├── Add Activity
   │                    └── Add Expense
   ├── Expenses
   └── Profile
```

---

# Project Structure

```text
src/
│
├── components/
│   ├── trips/
│   │   ├── AddActivity.jsx
│   │   ├── AddExpense.jsx
│   │   ├── AddStop.jsx
│   │   ├── CreateTrip.jsx
│   │   ├── StopCard.jsx
│   │   └── TripOverview.jsx
│   │
│   ├── ActivityCard.jsx
│   ├── HorizontalDestinations.jsx
│   ├── LoadingScreen.jsx
│   ├── Navbar.jsx
│   ├── Parallax.jsx
│   ├── PlanningTip.jsx
│   ├── ProtectedRoute.jsx
│   ├── Reveal.jsx
│   ├── ScrollProgress.jsx
│   └── StatCard.jsx
│
├── pages/
│   ├── CreateTripPage.jsx
│   ├── Dashboard.jsx
│   ├── Expenses.jsx
│   ├── Explore.jsx
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Signup.jsx
│   └── TripDetailsPage.jsx
│
├── styles/
│   ├── auth.css
│   ├── dashboard.css
│   ├── globals.css
│   └── landing.css
│
├── lib/
│   └── supabase.js
│
├── App.jsx
└── main.jsx
```

---

# Getting Started

## Prerequisites

Install Node.js, npm, and Git.

Check the installed versions:

```bash
node --version
npm --version
git --version
```

## Install Dependencies

From the project root:

```bash
npm install
```

## Start Development

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# Environment Variables

Create a local file:

```text
.env.local
```

Do **not** commit this file.

The frontend Supabase client uses public frontend configuration, for example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_public_key
```

Use the exact variable names expected by `src/lib/supabase.js`.

### Important

Never put a Supabase service-role key in frontend code.

Never commit:

- passwords
- service-role keys
- database credentials
- private API keys
- personal access tokens

Recommended `.gitignore` entries:

```gitignore
.env
.env.local
.env.*.local
node_modules/
dist/
```

---

# Supabase Architecture

The application uses Supabase for authentication and database operations.

High-level architecture:

```text
React
  ↓
Supabase JavaScript Client
  ↓
Supabase API
  ↓
PostgreSQL
```

Authentication:

```text
React
  ↓
Supabase Auth
  ↓
Session
  ↓
Protected Routes
```

A simplified data relationship is:

```text
auth.users
    │
    │ 1:1
    ↓
profiles
    │
    │ 1:N
    ↓
trips
    │
    │ 1:N
    ↓
trip_stops
    │
    │ 1:N
    ↓
trip_activities
```

The exact database schema and policies should remain synchronized with the SQL configured in the Supabase project.

---

# Authentication

Supabase Auth handles user authentication.

When the application starts, `App.jsx` checks the current session.

Conceptually:

```text
Application starts
       ↓
Check Supabase session
       ↓
Session exists?
   ┌───┴───┐
   │       │
  YES      NO
   │       │
Protected  Public
pages      pages
```

The application also listens for authentication state changes.

Logout uses:

```js
supabase.auth.signOut()
```

---

# Protected Routes

The application uses `ProtectedRoute` for pages that require authentication.

### Public

```text
/
 /login
 /signup
```

### Protected

```text
/dashboard
/explore
/expenses
/profile
/trips/new
/trips/:tripId
```

The wildcard route is kept last so it does not interfere with valid trip routes.

---

# Routing

Important routes:

| Route | Purpose | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Login | Public |
| `/signup` | Registration | Public |
| `/dashboard` | Personal dashboard | Protected |
| `/explore` | Destination discovery | Protected |
| `/expenses` | Expense management | Protected |
| `/profile` | Travel profile | Protected |
| `/trips/new` | Create a trip | Protected |
| `/trips/:tripId` | Trip details | Protected |

---

# Trip Management

## Create Trip

The flow is:

```text
Dashboard
   ↓
Plan a Trip
   ↓
CreateTripPage
   ↓
CreateTrip component
   ↓
Supabase
   ↓
Trip Details
```

After a successful creation, the application navigates to:

```text
/trips/<trip-id>
```

## Trip Details

A trip details page provides the central workspace for an individual journey.

It can display:

- Trip overview
- Number of stops
- Number of activities
- Budget
- Planned activity cost
- Budget progress
- Itinerary

## Add Stop

Stops are associated with a trip.

## Add Activity

Activities are associated with individual stops.

## Add Expense

Expenses belong to the trip-planning workflow and are used to track travel costs.

---

# UI and Animation

The project includes reusable components intended for a richer visual experience:

### `Reveal.jsx`

For reveal-on-scroll effects.

### `Parallax.jsx`

For depth and movement while scrolling.

### `HorizontalDestinations.jsx`

For horizontal destination layouts and scroll-driven presentation.

### `ScrollProgress.jsx`

For showing the user's progress through a page.

### `LoadingScreen.jsx`

For session/loading states.

The visual architecture is intentionally component-based so animations can be enhanced without rewriting the application logic.

---

# Security

Security is enforced at the backend/database level, not only through frontend UI.

## Row Level Security

User-owned data should be protected with Supabase RLS.

The intended model is:

```text
User A → User A's private data
User B → User B's private data
```

A user should not be able to access another user's private trips simply by changing a record ID in the browser.

## Never Trust Frontend Authorization

Hiding a button is not security.

Database policies must enforce who can:

- SELECT
- INSERT
- UPDATE
- DELETE

records.

## Keep Secrets Private

Never commit:

```text
.env.local
service-role keys
database passwords
private API keys
```

Frontend `VITE_*` values are exposed to browser code, so only public/client-safe configuration belongs there.

---

# Git Workflow

Check status:

```bash
git status
```

Stage changes:

```bash
git add .
```

Review staged changes:

```bash
git diff --cached
```

Commit:

```bash
git commit -m "Add trip planning flow"
```

Push:

```bash
git push
```

Pull latest changes:

```bash
git pull
```

Create a feature branch:

```bash
git checkout -b feature/trip-planning
```

Switch back:

```bash
git checkout main
```

## Recommended Commit Style

Prefer clear, focused commits:

```bash
git commit -m "Add Supabase authentication"
git commit -m "Build dashboard"
git commit -m "Add trip creation flow"
git commit -m "Add itinerary stops"
git commit -m "Add trip activities"
git commit -m "Add expense tracking"
git commit -m "Improve landing page animations"
```

---

# Common Commands

## npm

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Git

```bash
git status
git add .
git diff --cached
git commit -m "message"
git log --oneline
git branch
git push
git pull
```

---

# Troubleshooting

## Vite does not start

Try:

```bash
npm install
npm run dev
```

## Environment variables are not working

Check:

```text
.env.local
```

Make sure the names match `src/lib/supabase.js`.

Restart the Vite server after changing environment variables.

## Supabase RLS / permission error

Check:

1. RLS is enabled on the relevant table.
2. A matching SELECT/INSERT/UPDATE/DELETE policy exists.
3. The authenticated user's ID is used correctly.
4. The frontend column names match the database schema.

Do **not** disable RLS just to hide an error.

## Trip page does not open

Check:

```text
/trips/new
```

for creating a trip and:

```text
/trips/<trip-id>
```

for an existing trip.

## `.env.local` appears in Git status

Do not commit it.

If it was accidentally tracked already:

```bash
git rm --cached .env.local
```

Then commit the change.

---

# Free-Tier Considerations

The project is intended to be developed with free-tier services where possible.

Free tiers still have usage limits. Monitor:

- Database usage
- Authentication usage
- Storage
- Bandwidth
- API requests
- Third-party services
- Any AI APIs added later

For the hackathon MVP, the preferred foundation is:

```text
React
+
Supabase Auth
+
Supabase Database
+
CSS
```

Avoid adding paid services unless they are genuinely required.

---

# Hackathon MVP

The most important complete user journey is:

```text
Sign Up
   ↓
Login
   ↓
Dashboard
   ↓
Create Trip
   ↓
Trip Details
   ↓
Add Stop
   ↓
Add Activity
   ↓
Add Expense
```

A working end-to-end flow is more important than adding large numbers of animations before the core functionality is reliable.

---

# Suggested Hackathon Demo

A clean demo can follow this sequence:

### 1. Landing Page

Introduce Pravas Saathi.

### 2. Login

Authenticate the demo account.

### 3. Dashboard

Show personalized travel information.

### 4. Create Trip

Example:

```text
Trip:
Gujarat Heritage Journey

Description:
A cultural journey through Gujarat

Budget:
₹15,000
```

### 5. Add Stops

```text
Ahmedabad
Vadodara
Statue of Unity
```

### 6. Add Activities

```text
Visit Sabarmati Ashram
Explore heritage sites
Try Gujarati cuisine
```

### 7. Add Expenses

Demonstrate travel-budget management.

### 8. Return to Dashboard

Show the newly created journey.

This demonstrates a complete product loop rather than only a visual landing page.

---

# Future Improvements

Potential next-stage features include:

## Smart Itinerary Generation

Generate itineraries using:

- Destination
- Number of days
- Budget
- Travel style
- Interests

## Budget Intelligence

```text
Total Budget
- Transport
- Accommodation
- Food
- Activities
- Miscellaneous
= Remaining Budget
```

## Collaborative Trips

Allow multiple authenticated users to work on one journey.

## Maps

Display:

- Stops
- Routes
- Nearby attractions
- Distances

## Weather

Display destination weather for planned travel dates.

## AI Travel Assistant

Example:

> I have three days in Ahmedabad and a ₹5,000 activity budget. What should I do?

## Smart Recommendations

Use:

- Travel style
- Budget
- Interests
- Previous journeys
- Season

to improve destination recommendations.

## Offline-Friendly Itinerary

Allow important trip information to remain accessible with poor connectivity.

---

# Contributing

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make and test your changes.

Then:

```bash
git add .
git commit -m "Describe the change"
git push -u origin feature/your-feature
```

For a larger team, use pull requests before merging into `main`.

---

# Development Principles

### Functionality First

Make the feature work before spending excessive time on visual polish.

### Security First

Use Supabase RLS and database policies for authorization.

### User-Centered Design

Travel planning should remain understandable for non-technical users.

### Modular Architecture

Prefer reusable components over large monolithic files.

### Scalable Foundation

The MVP should make it possible to add maps, collaboration, recommendations, and AI features later.

---

# Project Status

**Pravas Saathi — Hackathon MVP**

Current development areas include:

- Authentication
- Dashboard
- Profile
- Destination exploration
- Trip creation
- Trip details
- Stops
- Activities
- Expenses
- Planning tips
- Advanced visual interactions

---

# Built With

**React + Vite + Supabase + React Router + CSS**

Built to make travel planning more personal, organized, and enjoyable.

---

## Pravas Saathi

> **Plan the journey. Keep the memories. Travel with a Saathi.**
