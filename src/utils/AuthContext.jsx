import { createContext, useState, useEffect } from "react";
import assignmentsData from "./assignments";

export const AuthContext = createContext()

export const AuthProvider = ({children})=> {
    const [currentUserId, setCurrentUserId] = useState(()=>{
        return localStorage.getItem("currentUserId") || null
    })
    const [assignments, setAssignments] = useState(()=>{
        const saved = localStorage.getItem("assignments")
        return saved ? JSON.parse(saved) : assignmentsData
    })

    // Persist currentUserId to localStorage
    useEffect(()=>{
        if(currentUserId){
            localStorage.setItem("currentUserId", currentUserId)
        } else {
            localStorage.removeItem("currentUserId")
        }
    },[currentUserId])

    // Persist assignments to localStorage
    useEffect(()=>{
        localStorage.setItem("assignments", JSON.stringify(assignments))
    },[assignments])

    return(
        <AuthContext.Provider value={{currentUserId, setCurrentUserId, assignments, setAssignments}}>
            {children}
        </AuthContext.Provider>
    );
    
};
