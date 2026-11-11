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
    const [assignments, setAssignments] = useState(()=>{
        const saved = localStorage.getItem("assignments")
        return saved ? JSON.parse(saved) : assignmentsData
    })
    const [courses, setCourses] = useState(()=>{
        const saved = localStorage.getItem("courses")
        return saved ? JSON.parse(saved) : coursesData
    })
    const [groups, setGroups] = useState(()=>{
        const saved = localStorage.getItem("groups")
        return saved ? JSON.parse(saved) : groupsData
    })

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
