import React, { useContext } from 'react'
import assignments from '../utils/assignments'
import { AuthContext } from '../utils/AuthContext'
const StudentAssignment = (props) => {
    const {currentUserId} = useContext(AuthContext)
    
    const {title, description, dueDate} = props.assignment

    const didSubmit = props.assignment?.submissions[currentUserId]?.status === "submitted"
    console.log(didSubmit)
  return (
        <div className="card card-border bg-base-300 w-96 m-4 p-4 w-full">
           
             <div className="absolute top-4 right-4">
                <span className={`badge p-3 ${didSubmit ? "text-green-400 bg-green-800" : "text-yellow-400 bg-yellow-800"}`}>
                    {didSubmit ? <p>Completed</p> : <p>Pending</p>}
                </span>
            </div>
        <div className="card-body">
            <div>
                    <h2 className="card-title p-2">{title}</h2>
                    <p className='p-2'>{description}</p>
                    <p className='p-2'>{dueDate}</p>
            </div>

            <div className="flex justify-end mt-2 -mr-7">

            <button className={`btn bg-green-700  ${didSubmit? "btn-disabled": "text-white"}`}>
                    Submit Assignment
            </button>
        </div>
            
            
        </div>
        </div>
  )
}

export default StudentAssignment