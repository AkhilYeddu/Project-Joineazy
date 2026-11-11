import { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, ChartNoAxesColumnDecreasing, CircleCheck, Clock, ArrowLeft } from 'lucide-react'
import StudentAssignment from './StudentAssignment'
import { useParams, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

const StudentCourseAssignments = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const {currentUserId, assignments, setAssignments, courses, groups, registeredUsers} = useContext(AuthContext)
    
    const allUsers = [...users, ...registeredUsers]
    const course = courses.find(c => c.id === courseId)
    const user = allUsers.find(u => u.id === currentUserId)

    if (!course || !user) {
        return (
          <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
            <BookOpen className="text-base-content/30" size={48}/>
            <p className="text-base-content/60">Course not found</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/student")}>Go Back</button>
          </div>
        )
    }

    const myAssignments = assignments.filter(
      a => a.courseId === courseId && a.assignedTo?.includes(currentUserId)
    )

    const totalAssignments = myAssignments.length
    const submittedAssignments = myAssignments.filter(
      a => a.submissions[currentUserId]?.status === "submitted"
    ).length
    const pendingAssignments = totalAssignments - submittedAssignments
    const completionPercentage = totalAssignments === 0
      ? 0
      : Math.round((submittedAssignments / totalAssignments) * 100)

    const handleSubmission = (assignmentId) => {
        setAssignments(prevAssignments =>
          prevAssignments.map(assignment => {
            if(assignment.id === assignmentId) {
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
        toast.success("Assignment marked as submitted!")
    }

    // Find the student's group in this course
    const myGroup = groups.find(g => g.courseId === courseId && g.members.includes(currentUserId))

  return (
    <div className='p-4 m-2 sm:m-6 mb-20'>
      {/* Back Button */}
      <button className="btn btn-ghost btn-sm mb-4 text-base-content/60" onClick={() => navigate("/student")}>
        <ArrowLeft size={16}/> Back to Courses
      </button>

      <h1 className='font-bold text-2xl mb-1'>{course.name}</h1>
      <p className='text-sm text-base-content/60 mb-6'>{course.code} • {course.semester}</p>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='card bg-base-200 p-4 rounded-xl'>
          <BookOpen className='text-blue-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
          <p className='text-sm text-base-content/60'>Total</p>
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

      {/* Progress */}
      <div className='card bg-base-200 p-6 rounded-xl mb-8'>
        <h2 className='font-bold text-lg mb-2'>Course Progress</h2>
        <p className='text-sm text-base-content/60 mb-3'>{submittedAssignments} out of {totalAssignments} assignments completed</p>
        <div className='flex items-center gap-3'>
          <progress className="progress progress-success w-full" value={completionPercentage} max="100"></progress>
          <span className='font-semibold text-sm whitespace-nowrap'>{completionPercentage}%</span>
        </div>
      </div>

      {/* Assignments */}
      <h2 className='font-bold text-xl mb-4'>Assignments</h2>
      {myAssignments.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center'>
          <BookOpen className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>No assignments for this course yet.</p>
        </div>
      ) : (
        myAssignments.map(assignment => (
          <StudentAssignment 
            key={assignment.id} 
            assignment={assignment} 
            onSubmit={handleSubmission}
            myGroup={myGroup}
          />
        ))
      )}
    </div>
  )
}

export default StudentCourseAssignments

