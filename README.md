# Vue 3 Social Feed Application – Implementation Specification

## Purpose
Build a Vue 3 Single Page Application that consumes a local Node.js API to implement a simplified social-network-style application. The application supports authentication, post feeds, user profiles, post creation and editing, post detail views, and replies. This document defines the structure, responsibilities, constraints, and rules for implementing the first fully working model so that an automated coding assistant (e.g. Codex) can expand the repository deterministically.

---

## Repository Structure
/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   ├── services/
│   │   ├── styles-reference/        # Reference CSS provided by the PRA (not imported globally)
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── backend/
│   ├── index.js
│   └── README.md
└── README.md

---

## Technology Stack

### Frontend (Allowed)
- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Plain CSS (scoped at component or view level)

### Backend
- Node.js
- Provided API only

---

## Forbidden Libraries and Patterns (Strict)

The following are NOT allowed and must not be introduced at any point:
- UI frameworks or design systems (Vuetify, Tailwind, Bootstrap, Material UI, etc.)
- TypeScript
- Additional state managers (Vuex, Redux, etc.)
- CSS frameworks or utility-first CSS libraries
- Third-party component libraries
- Global CSS dumping instead of scoped styles
- Excessive or unnecessary use of `:deep()` selectors
- Direct Axios usage inside views or components (must go through API service)

Only the libraries explicitly listed as allowed may be used.

---

## Backend Specification

- Start backend with: node index.js
- Base URL: http://localhost:3000
- Provides authentication and CRUD endpoints for posts and replies
- Uses in-memory storage (data resets on restart)
- Restricted endpoints require an authentication token in request headers
- API documentation: https://documenter.getpostman.com/view/16221291/2sB3WsQKwW

---

## Frontend Architecture

### Layout Rules
- Persistent header at the top
- Scrollable main content area
- Persistent bottom navigation menu
- App.vue is responsible only for layout and rendering `<router-view />`

---

## Routing Rules

Routes managed by Vue Router:
- / → Home feed
- /login → Login view
- /post/form/:id? → Post creation or editing
- /post/:id → Post detail and replies
- /profile/:username → User profile

Restricted routes require authentication.
Unauthenticated access must redirect to /login.

---

## State Management (Pinia)

Create a session store at:
frontend/src/store/session.js

Store responsibilities:
- Track authentication status
- Store logged-in user data
- Store authentication token

Pinia is the single source of truth for authentication and session state.

---

## Views

Views orchestrate routing, data fetching, and high-level logic.

Required views:
- HomeView
- LoginView
- ProfileView
- PostDetailView
- PostFormView

Views must not duplicate reusable markup.

---

## Components

Reusable presentational components:
- Header
- BottomMenu
- PostCard
- PostForm
- UserInfo

Component rules:
- One responsibility per component
- Scoped CSS only
- Receive data via props
- Emit events upward
- Access global state only through Pinia
- Do not perform direct HTTP requests

---

## API Layer

Centralize all API calls in:
frontend/src/services/api.js

API layer responsibilities:
- Configure Axios base URL
- Inject authentication token into headers when available
- Expose functions for:
  - login
  - fetch posts (with pagination)
  - fetch user data
  - fetch post detail
  - create post
  - edit post
  - delete post
  - create reply
  - upload image using FormData

Axios must not be used directly outside this service.

---

## Functional Requirements

Authentication:
- Authenticate via API
- Store user and token in Pinia
- Redirect to profile after successful login
- Update navigation menu based on login state

Home Feed:
- Fetch posts with limit and offset
- Load 10 posts per request
- Display load-more button until total is reached
- Resolve relative image paths using backend base URL

Profile View:
- Fetch user data and user posts separately
- Paginate user posts
- Provide logout action
- Do not repeat user info inside post cards

Post Detail:
- Fetch post and replies
- Show edit and delete actions only if post belongs to logged-in user
- Allow text-only replies
- Hide reply form after submission

Post Creation and Editing:
- Single form for create and edit modes
- Text content required
- Image optional
- Upload image using FormData
- Redirect to post detail after success

---

## Styling Rules
- Reference CSS files are stored in src/styles-reference and used as guidance only
- Styles must be split and applied inside the corresponding component or view
- All styles must be scoped
- Preserve the reference UI structure

---

## Implementation Goal
This document defines a strict implementation contract. Any automated assistant or developer extending this repository must implement the first fully working version of the application by following this structure, respecting all constraints, implementing all required features, and avoiding all forbidden libraries and patterns.
