import { Outlet, useNavigate } from "react-router"
import Header from "./Header"
import Footer from "./Footer"
import { useContext, useEffect } from "react"
import { AuthContext } from "../utils/AuthContext"

export const Body = () => {
    const {currentUserId} = useContext(AuthContext)
    const navigate = useNavigate()

    const fetchUser = ()=>{
        if(!currentUserId){
            navigate("/login")
        }
    }

    useEffect(()=>{
        fetchUser()
    },[currentUserId, navigate])
   
  return (
    <div>   
        <Header></Header>
        <Outlet></Outlet>
        <Footer></Footer>
    </div>
    
  )
}
