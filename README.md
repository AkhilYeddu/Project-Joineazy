# ClassPilot

ClassPilot is a React dashboard for managing class assignments. Administrators can create and manage assignments and review submission progress. Students can see their assigned work and mark assignments as submitted.

## Setup

### Requirements

- Node.js and npm

### Install and run

From the project root, install the dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. The app uses sample users and assignments; choose a role and user on the login screen to explore the dashboards.

### Other commands

```bash
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Folder structure

```text
.
├── index.html                 # HTML entry point and document theme
├── public/                    # Static public assets
├── src/
│   ├── main.jsx               # React entry point and provider setup
│   ├── App.jsx                # Router and application routes
│   ├── index.css              # Tailwind CSS and DaisyUI configuration
│   ├── assets/                # Imported images and starter assets
│   ├── components/            # Layout, dashboards, forms, and UI components
│   └── utils/
│       ├── AuthContext.jsx    # Shared user/assignment state and persistence
│       ├── assignments.js     # Sample assignment data
│       └── users.js           # Sample admin and student accounts
├── package.json               # Dependencies and npm scripts
└── vite.config.js             # Vite, React, and Tailwind CSS plugins
```

## Component architecture

- **Application bootstrap:** `main.jsx` mounts the React app, imports the global stylesheet, and wraps the app in `AuthProvider` and `StrictMode`.
- **Routing and layout:** `App.jsx` defines the `/login`, `/student`, and `/admin` routes beneath `Body`. `Body` provides the shared header/footer and redirects users to the appropriate page based on their selected account.
- **Shared state:** `AuthContext` exposes the current user ID and assignments to the component tree. It restores and persists both values using browser `localStorage`.
- **Login and navigation:** `Login` lets a user choose a sample role and account. `Header` displays the signed-in user and handles logout.
- **Admin dashboard:** `AdminDb` shows assignment statistics and supports searching, filtering, creating, editing, and deleting assignments. `AssignmentForm` handles assignment input and student selection; `AdminAssignment` displays progress and submission details.
- **Student dashboard:** `StudentDb` shows the current student's assignment and completion summaries. `StudentAssignment` displays assignment details and confirms marking work as submitted.
- **Shared UI:** `CardAdmin` and `CardStudent` are role selectors; `Footer` renders the site footer.

## Key design decisions

- **Client-side demo data:** Users and initial assignments are defined in `src/utils/users.js` and `src/utils/assignments.js`, so the project can be explored without configuring a server or database.
- **Browser persistence:** The current user and assignment updates are saved in `localStorage`. This is convenient for a frontend demo but is limited to the current browser and device.
- **Role-based views:** The selected sample user's role determines the dashboard route and the assignments shown. This is a demonstration flow, not production authentication or authorization.
- **Context for shared app state:** Authentication selection and assignments are used by several screens, so they are shared through React Context rather than passed through many layers of props.
- **Component-based UI:** Dashboard sections, assignment forms/cards, and common layout elements are separated into focused components to keep each screen easier to maintain.
- **Utility-first styling:** Tailwind CSS and DaisyUI provide responsive layout and component styles; Lucide React supplies interface icons.
