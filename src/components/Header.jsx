import { useContext } from "react"
import { AuthContext } from "../utils/AuthContext"

const Header = () => {
     const {currentUserId, setCurrentUserId} = useContext(AuthContext)
     
  const handleLogout = ()=>{
   
    setCurrentUserId(null)
    
  }


  return (
    <div className="navbar bg-base-300 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-2xl font-extrabold">ClassPilot.</a>
  </div>
  <div className="flex gap-2">
    <button className="btn bg-red-500 text-white  p-2" onClick={handleLogout}>Logout</button>
  </div>
</div>
  )
}

export default Header