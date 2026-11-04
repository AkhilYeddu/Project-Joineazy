const assignments = [
    {
        id: "assignment1",
        title: "React Fundamentals",
        description: "Build a React application using components, props, and state.",
        dueDate: "2026-11-10",
        driveLink: "https://drive.google.com/drive/folders/react1",
        createdBy: "admin1",
        assignedTo: ["student1", "student2", "student3"],
        submissions: {
            student1: { status: "submitted", submittedAt: "2026-11-02" },
            student2: { status: "not_submitted", submittedAt: null },
            student3: { status: "submitted", submittedAt: "2026-11-03" }
        }
    },
    {
        id: "assignment2",
        title: "JavaScript ES6",
        description: "Practice promises, async/await, destructuring, and array methods.",
        dueDate: "2026-11-12",
        driveLink: "https://drive.google.com/drive/folders/js2",
        createdBy: "admin1",
        assignedTo: ["student1", "student4"],
        submissions: {
            student1: { status: "not_submitted", submittedAt: null },
            student4: { status: "submitted", submittedAt: "2026-11-04" }
        }
    },
    {
        id: "assignment3",
        title: "Database Management",
        description: "Write SQL queries involving joins, grouping, and subqueries.",
        dueDate: "2026-11-15",
        driveLink: "https://drive.google.com/drive/folders/db3",
        createdBy: "admin2",
        assignedTo: ["student2", "student3", "student5"],
        submissions: {
            student2: { status: "submitted", submittedAt: "2026-11-03" },
            student3: { status: "not_submitted", submittedAt: null },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment4",
        title: "Node.js and Express",
        description: "Create REST APIs with Express and implement middleware.",
        dueDate: "2026-11-18",
        driveLink: "https://drive.google.com/drive/folders/node4",
        createdBy: "admin1",
        assignedTo: ["student1", "student2", "student5"],
        submissions: {
            student1: { status: "submitted", submittedAt: "2026-11-04" },
            student2: { status: "submitted", submittedAt: "2026-11-04" },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment5",
        title: "Data Structures and Algorithms",
        description: "Solve problems involving arrays, linked lists, and binary trees.",
        dueDate: "2026-11-20",
        driveLink: "https://drive.google.com/drive/folders/dsa5",
        createdBy: "admin2",
        assignedTo: ["student3", "student4"],
        submissions: {
            student3: { status: "submitted", submittedAt: "2026-11-03" },
            student4: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment6",
        title: "Tailwind CSS Dashboard",
        description: "Design a responsive admin dashboard using Tailwind CSS.",
        dueDate: "2026-11-22",
        driveLink: "https://drive.google.com/drive/folders/tailwind6",
        createdBy: "admin1",
        assignedTo: ["student1", "student3", "student4", "student5"],
        submissions: {
            student1: { status: "submitted", submittedAt: "2026-11-04" },
            student3: { status: "not_submitted", submittedAt: null },
            student4: { status: "submitted", submittedAt: "2026-11-04" },
            student5: { status: "not_submitted", submittedAt: null }
        }
    },
    {
        id: "assignment7",
        title: "MongoDB CRUD Operations",
        description: "Implement CRUD operations using MongoDB and Mongoose.",
        dueDate: "2026-11-25",
        driveLink: "https://drive.google.com/drive/folders/mongo7",
        createdBy: "admin2",
        assignedTo: ["student1", "student2", "student5"],
        submissions: {
            student1: { status: "not_submitted", submittedAt: null },
            student2: { status: "not_submitted", submittedAt: null },
            student5: { status: "submitted", submittedAt: "2026-11-04" }
        }
    },
    {
        id: "assignment8",
        title: "Full Stack Mini Project",
        description: "Build a full-stack task management application using MERN.",
        dueDate: "2026-11-30",
        driveLink: "https://drive.google.com/drive/folders/mern8",
        createdBy: "admin2",
        assignedTo: ["student1", "student2", "student3", "student4", "student5"],
        submissions: {
            student1: { status: "not_submitted", submittedAt: null },
            student2: { status: "not_submitted", submittedAt: null },
            student3: { status: "not_submitted", submittedAt: null },
            student4: { status: "not_submitted", submittedAt: null },
            student5: { status: "not_submitted", submittedAt: null }
        }
    }
];

export default assignments;
