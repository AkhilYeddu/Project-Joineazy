/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import assignmentsData from "./assignments";
import coursesData from "./courses";
import groupsData from "./groups";

export const AuthContext = createContext()

// Simple JWT-style token simulation
const generateToken = (userId) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(JSON.stringify({ userId, iat: Date.now(), exp: Date.now() + 86400000 }))
    const signature = btoa(`${header}.${payload}.classpilotsecret`)
    return `${header}.${payload}.${signature}`
}

const parseToken = (token) => {
    try {
        const parts = token.split(".")
        const payload = JSON.parse(atob(parts[1]))
        if (payload.exp < Date.now()) return null
        return payload.userId
    } catch {
        return null
    }
}

// Automatic backfill and migration for legacy localStorage assignments
const loadInitialAssignments = () => {
    try {
        const saved = localStorage.getItem("assignments")
        if (!saved) return assignmentsData
        const parsed = JSON.parse(saved)
        if (!Array.isArray(parsed) || parsed.length === 0) return assignmentsData

        const courseMap = {
            assignment1: "course1",
            assignment2: "course1",
            assignment3: "course2",
            assignment4: "course3",
            assignment5: "course2",
            assignment6: "course1",
            assignment7: "course4",
            assignment8: "course3",
        }
        const typeMap = {
            assignment6: "group",
            assignment7: "group",
        }

        return parsed.map(a => {
            const defaultMatch = assignmentsData.find(d => d.id === a.id)
            const courseId = a.courseId || courseMap[a.id] || defaultMatch?.courseId || "course1"
            const submissionType = a.submissionType || typeMap[a.id] || defaultMatch?.submissionType || "individual"
            const isGroup = submissionType === "group"

            const dueDate = a.dueDate && !a.dueDate.includes("T") ? `${a.dueDate}T23:59` : (a.dueDate || defaultMatch?.dueDate)
            const driveLink = a.driveLink || defaultMatch?.driveLink || ""

            // Group assignments must ONLY assign members of the designated group(s)
            let assignedGroups = a.assignedGroups || defaultMatch?.assignedGroups || []
            let assignedTo = a.assignedTo || defaultMatch?.assignedTo || []

            if (isGroup && defaultMatch) {
                assignedGroups = defaultMatch.assignedGroups || assignedGroups
                assignedTo = defaultMatch.assignedTo || assignedTo
            }

            return {
                ...defaultMatch,
                ...a,
                courseId,
                submissionType,
                dueDate,
                driveLink,
                assignedGroups,
                assignedTo,
                submissions: a.submissions || defaultMatch?.submissions || {}
            }
        })
    } catch {
        return assignmentsData
    }
}

const loadInitialCourses = () => {
    try {
        const saved = localStorage.getItem("courses")
        if (!saved) return coursesData
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : coursesData
    } catch {
        return coursesData
    }
}

const loadInitialGroups = () => {
    try {
        const saved = localStorage.getItem("groups")
        if (!saved) return groupsData
        const parsed = JSON.parse(saved)
        if (!Array.isArray(parsed) || parsed.length === 0) return groupsData
        // Ensure group3 in course4 exists
        if (!parsed.some(g => g.id === "group3")) {
            return groupsData
        }
        return parsed
    } catch {
        return groupsData
    }
}

export const AuthProvider = ({children})=> {
    const [token, setToken] = useState(()=> localStorage.getItem("authToken") || null)
    const [currentUserId, setCurrentUserIdState] = useState(()=> {
        const savedToken = localStorage.getItem("authToken")
        return savedToken ? parseToken(savedToken) : null
    })
    const [registeredUsers, setRegisteredUsers] = useState(()=>{
        const saved = localStorage.getItem("registeredUsers")
        return saved ? JSON.parse(saved) : []
    })
    const [assignments, setAssignments] = useState(loadInitialAssignments)
    const [courses, setCourses] = useState(loadInitialCourses)
    const [groups, setGroups] = useState(loadInitialGroups)

    // Login: generate token and set userId
    const login = (userId) => {
        const newToken = generateToken(userId)
        setToken(newToken)
        setCurrentUserIdState(userId)
    }

    // Logout: clear token
    const logout = () => {
        setToken(null)
        setCurrentUserIdState(null)
    }

    // Register a new user
    const register = (user) => {
        setRegisteredUsers(prev => [...prev, user])
    }

    // Persist token
    useEffect(()=>{
        if(token){
            localStorage.setItem("authToken", token)
        } else {
            localStorage.removeItem("authToken")
        }
    },[token])

    // Persist registeredUsers
    useEffect(()=>{
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
    },[registeredUsers])

    // Persist assignments
    useEffect(()=>{
        localStorage.setItem("assignments", JSON.stringify(assignments))
    },[assignments])

    // Persist courses
    useEffect(()=>{
        localStorage.setItem("courses", JSON.stringify(courses))
    },[courses])

    // Persist groups
    useEffect(()=>{
        localStorage.setItem("groups", JSON.stringify(groups))
    },[groups])

    return(
        <AuthContext.Provider value={{
            currentUserId, 
            token,
            login, 
            logout,
            register,
            registeredUsers,
            assignments, 
            setAssignments,
            courses,
            setCourses,
            groups,
            setGroups
        }}>
            {children}
        </AuthContext.Provider>
    );
    
};
