import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children})=> {
    const [currentUserId, setCurrentUserId] = useState(null)

    return(
        <AuthContext.Provider value={{currentUserId, setCurrentUserId}}>
            {children}
        </AuthContext.Provider>
    );
    
};

