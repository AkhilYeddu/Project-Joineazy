const assignments = [
    {
        id: "assignment1",
        title: "React Fundamentals",
        description: "Build a React application using components, props, and state.",
        dueDate: "2026-11-10T23:59",
        driveLink: "https://onedrive.live.com/react1",
        createdBy: "admin1",
        courseId: "course1",
        submissionType: "individual",
        assignedTo: ["student1", "student2", "student3", "student5"],
        submissions: {
            student1: { status: "submitted", submittedAt: "2026-11-02T14:30:00" },
            student2: { status: "not_submitted", submittedAt: null },
            student3: { status: "submitted", submittedAt: "2026-11-03T09:15:00" },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment2",
        title: "JavaScript ES6 Practice",
        description: "Practice promises, async/await, destructuring, and array methods.",
        dueDate: "2026-11-12T23:59",
        driveLink: "https://onedrive.live.com/js2",
        createdBy: "admin1",
        courseId: "course1",
        submissionType: "individual",
        assignedTo: ["student1", "student2", "student3", "student5"],
        submissions: {
            student1: { status: "not_submitted", submittedAt: null },
            student2: { status: "submitted", submittedAt: "2026-11-04T16:45:00" },
            student3: { status: "not_submitted", submittedAt: null },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment3",
        title: "SQL Queries",
        description: "Write SQL queries involving joins, grouping, and subqueries.",
        dueDate: "2026-11-15T23:59",
        driveLink: "https://onedrive.live.com/db3",
        createdBy: "admin2",
        courseId: "course2",
        submissionType: "individual",
        assignedTo: ["student2", "student3", "student4", "student5"],
        submissions: {
            student2: { status: "submitted", submittedAt: "2026-11-03T11:20:00" },
            student3: { status: "not_submitted", submittedAt: null },
            student4: { status: "not_submitted", submittedAt: null },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment4",
        title: "Node.js REST API",
        description: "Create REST APIs with Express and implement middleware.",
        dueDate: "2026-11-18T23:59",
        driveLink: "https://onedrive.live.com/node4",
        createdBy: "admin1",
        courseId: "course3",
        submissionType: "individual",
        assignedTo: ["student1", "student4", "student5"],
        submissions: {
            student1: { status: "submitted", submittedAt: "2026-11-04T08:30:00" },
            student4: { status: "submitted", submittedAt: "2026-11-04T12:00:00" },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment5",
        title: "Algorithm Problem Set",
        description: "Solve problems involving arrays, linked lists, and binary trees.",
        dueDate: "2026-11-20T23:59",
        driveLink: "https://onedrive.live.com/dsa5",
        createdBy: "admin2",
        courseId: "course2",
        submissionType: "individual",
        assignedTo: ["student2", "student3", "student4", "student5"],
        submissions: {
            student2: { status: "not_submitted", submittedAt: null },
            student3: { status: "submitted", submittedAt: "2026-11-03T18:00:00" },
            student4: { status: "not_submitted", submittedAt: null },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment6",
        title: "Full Stack Group Project",
        description: "Build a full-stack task management app as a team using MERN stack.",
        dueDate: "2026-11-30T23:59",
        driveLink: "https://onedrive.live.com/mern6",
        createdBy: "admin1",
        courseId: "course1",
        submissionType: "group",
        assignedTo: ["student1", "student2", "student3", "student5"],
        submissions: {}
    },
    {
        id: "assignment7",
        title: "Group Research Presentation",
        description: "Research and present on a modern software engineering methodology.",
        dueDate: "2026-11-28T23:59",
        driveLink: "https://onedrive.live.com/se7",
        createdBy: "admin2",
        courseId: "course4",
        submissionType: "group",
        assignedTo: ["student1", "student2", "student3", "student4"],
        submissions: {}
    },
    {
        id: "assignment8",
        title: "Database Design Project",
        description: "Design and implement a normalized database schema for an e-commerce platform.",
        dueDate: "2026-11-25T23:59",
        driveLink: "https://onedrive.live.com/dbdesign8",
        createdBy: "admin1",
        courseId: "course3",
        submissionType: "individual",
        assignedTo: ["student1", "student4", "student5"],
        submissions: {
            student1: { status: "not_submitted", submittedAt: null },
            student4: { status: "not_submitted", submittedAt: null },
            student5: { status: "submitted", submittedAt: "2026-11-04T20:30:00" }
        }
    }
];

export default assignments;
