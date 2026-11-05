import { useContext } from "react"
import { AuthContext } from "../utils/AuthContext"
import { useNavigate } from "react-router"
import users from "../utils/users"
import { LogOut, User } from "lucide-react"

const Header = () => {
     const {currentUserId, setCurrentUserId} = useContext(AuthContext)
     const navigate = useNavigate()
     const user = users.find(u => u.id === currentUserId)
     
  const handleLogout = ()=>{
    setCurrentUserId(null)
    navigate("/login")
  }


  return (
    <div className="navbar bg-base-300 shadow-sm px-4">
  <div className="flex-1">
    <a className="btn btn-ghost text-2xl font-extrabold" onClick={()=> navigate(user?.role === "admin" ? "/admin" : "/student")}>ClassPilot.</a>
  </div>
  <div className="flex gap-3 items-center">
    {user && (
      <div className="flex items-center gap-2">
        <User size={18} className="text-base-content/60"/>
        <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
        <span className={`badge badge-sm ${user.role === "admin" ? "bg-pink-600 text-white" : "bg-green-600 text-white"}`}>
          {user.role}
        </span>
      </div>
    )}
    <button className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none" onClick={handleLogout}>
      <LogOut size={16}/>
      <span className="hidden sm:inline">Logout</span>
    </button>
  </div>
</div>
  )
}

export default Header
