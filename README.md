# ClassPilot — Student, Group & Assignment Management System

ClassPilot is a responsive, modern assignment management system built with React.js and Tailwind CSS (DaisyUI forest theme). It provides role-based workflows for **Professors (Admins)** and **Students**, including simulated JWT authentication, course-based assignment tracking, group management, and two-step submission acknowledgements.

---

## 🚀 Quick Setup & Run

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Development
From the project root directory, install dependencies and launch the Vite development server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open the printed localhost URL (typically `http://localhost:5173`) in your browser.

### Other Commands
```bash
npm run build    # Create optimized production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint (zero errors/warnings)
```

---

## 🔑 Demo Login Credentials

You can use the built-in seeded accounts or use the **Register** page to create a new Professor or Student account.

| Role | Name | Email | Password |
|---|---|---|---|
| **Professor** | Prof. Sarah Wilson | `sarah@classpilot.com` | `admin123` |
| **Professor** | Prof. James Chen | `james@classpilot.com` | `admin123` |
| **Student (Leader)** | Alice Johnson | `alice@student.com` | `student123` |
| **Student** | Bob Smith | `bob@student.com` | `student123` |
| **Student (Leader)** | Charlie Davis | `charlie@student.com` | `student123` |
| **Student** | Diana Patel | `diana@student.com` | `student123` |
| **Student** | Ethan Brown | `ethan@student.com` | `student123` |

---

## 🌟 Feature Breakdown (Round 2 Enhancements)

### 1. Authentication & JWT-Style Session
- **Login & Register:** Form validation with real-time error messaging, email format verification, and min-password length checks.
- **Role Selection:** New users register as either **Student** or **Professor**.
- **Simulated JWT Session:** Base64-encoded JWT token containing user ID, issue time (`iat`), and expiration (`exp`) stored in `localStorage`.
- **Protected Routes:** Unauthorized visits automatically redirect to `/login`. Logging out clears session credentials.

### 2. Professor (Admin) Flow
- **Courses Dashboard (`/admin`):**
  - Course cards for each course taught by the professor (e.g. Web Development, Database Systems).
  - Metrics per course: enrolled student counts, assignment volume, and course-wide submission rate.
- **Course Assignments Page (`/admin/course/:courseId`):**
  - **Create & Edit Assignments:** Form with title, description, deadline (date and time via datetime-local), OneDrive resource link, and submission type (**Individual** or **Group**).
  - **Filter & Search:** Search by title/keywords; filter by status (All, Completed, In Progress, Pending, Overdue, Individual, Group); sort by deadline (Soonest, Latest, Title A-Z).
  - **Assignment Tracking & Drill-down:**
    - Live progress bar showing class completion rate.
    - Drill-down list for **Individual assignments**: shows each student's submission status and ISO timestamp.
    - Drill-down list for **Group assignments**: shows each group's name, leader, members, status, and submission timestamp.
  - **Delete Confirmation:** Modal dialog to prevent accidental deletion.

### 3. Student Flow
- **Courses Dashboard (`/student`):**
  - Displays cards for all courses in which the student is enrolled for the semester.
  - Overall semester progress bar and completion statistics.
  - Clicking a course opens its dedicated assignment page.
- **Course Assignments Page (`/student/course/:courseId`):**
  - Lists assignments with title, description, deadline date/time, OneDrive link, and submission type badge.
  - **Individual Submissions:** Two-step acknowledgement ("Yes, I have submitted" → confirm modal dialog). Records timestamp on confirmation.
  - **Group Submissions:**
    - If the student is **not in a group**: displays a prompt: *"You are not part of any group. Create or join one to submit this assignment"* with a one-click button to create or join a group.
    - If the student is in a group and is **not the leader**: displays pending notice: *"Only group leader can acknowledge submission"*.
    - Once acknowledged by leader: every member sees *"Acknowledged by [Leader] on [date and time]"*.
    - If student **is the leader**: provides the two-step acknowledgement on behalf of their team.

### 4. Group Management
- Accessible via the **"Manage / Join Groups"** button on the student course page.
- **Create Group:** Enter group name to create a new team; creator automatically becomes the group leader.
- **Join Group:** Browse available teams in the course and join with one click.
- **View Roster:** Displays group name, leader badge, and all active members.
- **Leave Group:** Option to leave a team (with automatic leadership transfer if applicable).

### 5. Progress, Overdue Highlighting & Polish
- **Overdue Highlighting:** Assignments past their deadline display high-contrast red overdue badges and subtle border warnings.
- **Toast Notifications:** React Hot Toast confirmations for login, register, logout, assignment creation/update/deletion, and submission acknowledgements.
- **Responsive Layout:** Optimized for mobile, tablet, and desktop screens with Tailwind grid and flex utilities.

---

## 🏛️ Component Architecture & Structure

```
src/
├── App.jsx                        # Route definitions and global Toaster configuration
├── index.css                      # Tailwind CSS v4 & DaisyUI theme settings
├── main.jsx                       # Root renderer with AuthProvider
│
├── components/
│   ├── Body.jsx                   # Layout wrapper with route protection & header/footer
│   ├── Header.jsx                 # Navbar with role badge, username, and logout
│   ├── Footer.jsx                 # Application footer
│   ├── Login.jsx                  # Sign-in form with demo credential presets
│   ├── Register.jsx               # Registration form with role selector
│   │
│   ├── AdminDb.jsx                # Professor dashboard: taught courses & metrics
│   ├── CourseAssignments.jsx      # Professor view: course assignment manager & drill-downs
│   ├── AdminAssignment.jsx        # Professor view: per-assignment tracking card
│   ├── AssignmentForm.jsx         # Create/edit assignment modal/form
│   │
│   ├── StudentDb.jsx              # Student dashboard: enrolled courses & progress
│   ├── StudentCourseAssignments.jsx # Student view: course assignments & group status
│   ├── StudentAssignment.jsx      # Student view: assignment card with 2-step submit
│   └── GroupManager.jsx           # Group creation, joining, and roster modal
│
└── utils/
    ├── AuthContext.jsx            # State store (auth, token, assignments, courses, groups)
    ├── users.js                   # Seeded users (Professors and Students)
    ├── courses.js                 # Seeded course catalog and enrollments
    ├── assignments.js             # Seeded assignments with individual/group types
    └── groups.js                  # Seeded student groups per course
```

### Component Structure Diagram

```
+-----------------------------------------------------------+
|                          App.jsx                          |
|                       (AuthProvider)                      |
+-----------------------------+-----------------------------+
                              |
                     +--------v-------+
                     |    Body.jsx    |
                     +---+---------+--+
                         |         |
          +--------------+         +--------------+
          |                                       |
+---------v----------+                  +---------v----------+
|  Professor Flow    |                  |    Student Flow    |
|                    |                  |                    |
| - AdminDb (Courses)|                  | - StudentDb        |
|   |                |                  |   | (Enrolled)     |
|   v                |                  |   v                |
| - CourseAssignments|                  | - StudentCourse    |
|   |                |                  |   Assignments      |
|   +-> AdminAssign- |                  |   |                |
|   |   ment (drill) |                  |   +-> StudentAssign|
|   |                |                  |   |   (2-step ack) |
|   +-> Assignment-  |                  |   |                |
|       Form (modal) |                  |   +-> GroupManager |
+--------------------+                  +--------------------+
```

---

## 💡 Key Design Decisions

1. **Simulated JWT Token & LocalStorage Persistence:**
   - Designed to mimic a production backend without external server dependencies. Authentication tokens and mutable state (assignments, submissions, groups, registered users) persist across page reloads in `localStorage`.
2. **Normalized Relationship Model:**
   - Courses hold references to professors (`professorId`) and students (`enrolledStudents`).
   - Assignments belong to courses (`courseId`) and specify `submissionType` ("individual" vs "group").
   - Groups link to courses (`courseId`) and maintain a designated `leaderId` alongside a `members` array.
3. **Multi-Recipient Group Submission Sync:**
   - When a team leader acknowledges a group assignment, the system records the submission under both the `groupId` and each individual team member's ID with attribution (`acknowledgedBy: leaderName`). This guarantees immediate feedback for both students and instructors.
4. **Tailwind CSS & DaisyUI Design System:**
   - Dark mode `forest` palette with clear semantic accents: pink for professor management actions, green for student completion, purple for group features, and red for overdue warnings.
