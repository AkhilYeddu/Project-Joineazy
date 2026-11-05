import { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, ChartNoAxesColumnDecreasing, CircleCheck, Clock } from 'lucide-react'
import StudentAssignment from './StudentAssignment'

const StudentDb = () => {
    const {currentUserId, assignments, setAssignments} = useContext(AuthContext)
    
    const myAssignments = assignments.filter(
      assignment => assignment.assignedTo?.includes(currentUserId)
    )

    const user = users.find(user => user.id === currentUserId)

    if (!user) {
        return (
          <div className="flex justify-center items-center min-h-[60vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )
    }

    const {name} = user

  const totalAssignments = myAssignments.length
  const submittedAssignments = myAssignments.filter(
    assigment => assigment.submissions[currentUserId]?.status === "submitted"
  ).length
  const pendingAssignments = totalAssignments - submittedAssignments
  const completionPercentage = totalAssignments === 0
    ? 0
    : Math.round((submittedAssignments / totalAssignments) * 100)

  const handleSubmission = (assignmentId)=>{
      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>{
          if(assignment.id === assignmentId)
          {
            return {
                        ...assignment,
                        submissions: {
                            ...assignment.submissions,
                            [currentUserId]: {
                                status: "submitted",
                                submittedAt: new Date().toISOString()
                            }
                        }
                    }
          }
           return assignment;
        })
      )
  }

  return (
    <div className='p-4 m-2 sm:m-6 mb-20'>
        <h1 className='font-bold text-2xl mb-6'>Hello, {name}! 👋🏻</h1>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <div className='card bg-base-200 p-4 rounded-xl'>
            <BookOpen className='text-blue-400 mb-2' size={24}/>
            <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
            <p className='text-sm text-base-content/60'>Total Assignments</p>
          </div>

          <div className='card bg-base-200 p-4 rounded-xl'>
            <CircleCheck className='text-green-400 mb-2' size={24}/>
            <h2 className='text-2xl font-bold'>{submittedAssignments}</h2>
            <p className='text-sm text-base-content/60'>Submitted</p>
          </div>

          <div className='card bg-base-200 p-4 rounded-xl'>
            <Clock className="text-yellow-400 mb-2" size={24}/>
            <h2 className='text-2xl font-bold'>{pendingAssignments}</h2>
            <p className='text-sm text-base-content/60'>Pending</p>
          </div>

          <div className='card bg-base-200 p-4 rounded-xl'>
            <ChartNoAxesColumnDecreasing className="text-purple-400 mb-2" size={24}/>
            <h2 className='text-2xl font-bold'>{completionPercentage}%</h2>
            <p className='text-sm text-base-content/60'>Completion</p>
          </div>
        </div>
    
      {/* Progress Section */}
      <div className='card bg-base-200 p-6 rounded-xl mb-8'>
        <h2 className='font-bold text-lg mb-2'>My Progress</h2>
        <p className='text-sm text-base-content/60 mb-3'>{submittedAssignments} out of {totalAssignments} assignments completed</p>
        <div className='flex items-center gap-3'>
          <progress className="progress progress-success w-full" value={completionPercentage} max="100"></progress>
          <span className='font-semibold text-sm whitespace-nowrap'>{completionPercentage}%</span>
        </div>
      </div>

      {/* Assignments List */}
      <h2 className='font-bold text-2xl mb-4'>My Assignments</h2>
      {myAssignments.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center'>
          <BookOpen className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>No assignments assigned to you yet.</p>
        </div>
      ) : (
        myAssignments.map(assignment => (
          <StudentAssignment 
            key={assignment.id} 
            assignment={assignment} 
            onSubmit={handleSubmission}
          />
        ))
      )}
    </div>
  )
}

export default StudentDb
