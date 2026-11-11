import { Outlet, useNavigate, useLocation } from "react-router"
import Header from "./Header"
import Footer from "./Footer"
import { useContext, useEffect } from "react"
import { AuthContext } from "../utils/AuthContext"
import users from "../utils/users"

export const Body = () => {
    const {currentUserId, registeredUsers} = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const allUsers = [...users, ...registeredUsers]
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

    useEffect(()=>{
        if(!currentUserId && !isAuthPage){
            navigate("/login")
        } else if (currentUserId && (location.pathname === "/" || isAuthPage)) {
            const user = allUsers.find(u => u.id === currentUserId)
            if(user?.role === "admin") navigate("/admin")
            else if(user?.role === "student") navigate("/student")
        }
    },[currentUserId, navigate, location.pathname])
   
  return (
    <div className="min-h-screen flex flex-col">   
        {!isAuthPage && <Header/>}
        <div className="flex-1">
          <Outlet/>
        </div>
        <Footer/>
    </div>
    
  )
}
