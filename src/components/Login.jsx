
import { useContext, useEffect, useRef, useState } from "react";
import CardAdmin from "./CardAdmin";
import CardStudent from "./CardStudent";
import users from "../utils/users";

import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router";




const Login = () => {
    const [selectedRole, setselectedRole] = useState(null)
    const [selectedUser, setSelectedUser] = useState("")
    const [selectedUserId, setSelectedUserId] = useState("")
    const dropDownRef = useRef(null)
    const filteredUsers = users.filter(user => user.role == selectedRole)
    const{currentUserId, setCurrentUserId} = useContext(AuthContext)
    const navigate = useNavigate()
    
    // If already logged in, redirect
    useEffect(()=>{
        if(currentUserId){
            const user = users.find(u => u.id === currentUserId)
            if(user?.role === "admin") navigate("/admin")
            else if(user?.role === "student") navigate("/student")
        }
    },[currentUserId, navigate])
    
    const handleLogin = ()=>{
        if (!selectedUserId) {
        alert("Please select a user!");
        return;
        }

       setCurrentUserId(selectedUserId)

       if(selectedUser.role === "admin"){
            navigate("/admin")
       }
       else{
            navigate("/student")
       }

    }

  return (
    <div className="flex justify-center mt-20 p-2 m-2">

           
            
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">

            <label className="label font-bold text-white">Login As :</label>
            <div className="flex m-2 p-2 text-sm font-semibold justify-center">
                <CardAdmin isSelected = {selectedRole === "admin"} onselect={()=>{setselectedRole("admin"); setSelectedUser(""); setSelectedUserId("")}}/>
                <CardStudent isSelected = {selectedRole === "student"} onselect={()=>{setselectedRole("student"); setSelectedUser(""); setSelectedUserId("")}}  />
            </div>
                
           <div>
            <label className="label font-bold text-white">Select User : </label>
            <details className="dropdown" ref={dropDownRef}>
                <summary className="btn m-1 bg-base-100 ">
                    {
                        !selectedUser ? "Select User" : <p>{selectedUser.name}</p>
                    }</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <>
                     {
                       !selectedRole ? (<li>Please select a role</li>)  : (filteredUsers.map(user=>(
                        <li key={user.id} className="m-2 p-2 hover:bg-base-200 rounded-lg cursor-pointer" onClick={()=>{
                            setSelectedUser(user)
                            setSelectedUserId(user.id)
                            dropDownRef.current.open = false
                        }}>
                            {user.name}
                        </li>
                    )))
                    
                }
                </>
                
                </ul>
            </details>
               
           </div>
           
                <button className="btn btn-primary mt-10 flex justify-center" onClick={handleLogin}>Login</button>
          
           
                
            </fieldset>
    </div>
    
  )
}

export default Login
