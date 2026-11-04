import React, { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
const AdminDb = () => {
    console.log("admin dashboard called")
    const {currentUserId} = useContext(AuthContext)
    const user = users.find(user => user.id === currentUserId)
    console.log(user)

    if (!user) {
        return <div>Loading user...</div>
    }

    const {name, role, id} = user
    console.log(name)
    
    

  return (
    <div>
      <h1 className='font-bold text-2xl p-2 m-2'>Hello, {name}👋🏻</h1>
    </div>
  )
}

export default AdminDb