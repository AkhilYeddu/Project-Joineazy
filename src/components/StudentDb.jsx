import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import assignments from '../utils/assignments'
import { BookOpen, ChartNoAxesColumnDecreasing, CircleCheck, Clock } from 'lucide-react'
import StudentAssignment from './StudentAssignment'
const StudentDb = () => {
    console.log("Student dashboard called")
    const {currentUserId} = useContext(AuthContext)
    const user = users.find(user => user.id === currentUserId)
    console.log(user)

    if (!user) {
        return <div>Loading user...</div>
    }

    const {name, role, id} = user

    
  const filteredAssignments = assignments.filter(
    assignment => assignment.assignedTo?.includes(currentUserId)
    )



  const totalAssignments = filteredAssignments.length
  const submittedAssignments = filteredAssignments.filter(
    assigment => assigment.submissions[currentUserId]?.status === "submitted"
  ).length
  const pendingAssignments = totalAssignments - submittedAssignments
  const completionPercentage = totalAssignments === 0
    ? 0
    : Math.round((submittedAssignments / totalAssignments) * 100)


  
  return (
    <div className='p-2 m-6'>
        <div className='flex '>
      <h1 className='font-bold text-2xl'>Hello, {name}! 👋🏻</h1>

                <div className='justify-center m-20'>
                    <BookOpen className='text-blue-400'></BookOpen>
                    
                      <h1>{totalAssignments}</h1>
                    <p>Total assignments</p>
                  </div>
        
                  <div className='justify-center m-20'>
                    <CircleCheck className='text-green-400'></CircleCheck>
                    
                    <h1>{submittedAssignments}</h1>
                    <p>Submitted</p>
                  </div>
       


              <div className='justify-center m-20'>
                
                <Clock className="text-yellow-400"></Clock>
                
                <h1>{pendingAssignments}</h1>
                <p>Pending</p>
              </div>

        
                <div className='justify-center m-20'>
                <ChartNoAxesColumnDecreasing className="text-purple-400"></ChartNoAxesColumnDecreasing>
                
                <h1>{completionPercentage}%</h1>
                <p>Completion</p>
              </div>
          
        
      </div>
    
    <div className='flex-col justify-center text-center'>
      
      <h1 className='font-bold text-lg m-2 p-2 '>My Progress</h1>
      <p className='text-sm'>{submittedAssignments} out of {totalAssignments} assignments completed </p>
      <progress className="progress w-56 " value={completionPercentage} max="100"></progress> <p>{completionPercentage}%</p>
    </div>
      <h1 className='font-bold text-2xl'>My Assignments</h1>
      {
      filteredAssignments.map(assignment => <StudentAssignment key = {assignment.id} assignment = {assignment}></StudentAssignment>)
      }
    </div>
    
    
  )
}

export default StudentDb


