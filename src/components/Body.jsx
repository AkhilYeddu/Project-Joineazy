import { Outlet, useNavigate, useLocation } from "react-router"
import Header from "./Header"
import Footer from "./Footer"
import { useContext, useEffect } from "react"
import { AuthContext } from "../utils/AuthContext"
import users from "../utils/users"

export const Body = () => {
    const {currentUserId} = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(()=>{
        if(!currentUserId){
            navigate("/login")
        } else if (location.pathname === "/") {
            // If on root, redirect to appropriate dashboard
            const user = users.find(u => u.id === currentUserId)
            if(user?.role === "admin") navigate("/admin")
            else if(user?.role === "student") navigate("/student")
        }
    },[currentUserId, navigate, location.pathname])
   
  return (
    <div className="min-h-screen flex flex-col">   
        <Header></Header>
        <div className="flex-1">
          <Outlet></Outlet>
        </div>
        <Footer></Footer>
    </div>
    
  )
}
