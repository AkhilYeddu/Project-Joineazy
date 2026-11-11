import { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, Users, ChartNoAxesColumnDecreasing, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router'

const AdminDb = () => {
    const {currentUserId, assignments, courses, registeredUsers} = useContext(AuthContext)
    const navigate = useNavigate()
    
    const allUsers = [...users, ...registeredUsers]
    const user = allUsers.find(u => u.id === currentUserId)

    if (!user) {
        return (
          <div className="flex justify-center items-center min-h-[60vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )
    }

    const {name} = user

    // Courses taught by this professor
    const myCourses = courses.filter(c => c.professorId === currentUserId)

    // Overall stats
    const totalCourses = myCourses.length
    const totalStudents = new Set(myCourses.flatMap(c => c.enrolledStudents || [])).size
    const myAssignments = assignments.filter(a => a.createdBy === currentUserId)
    const totalAssignments = myAssignments.length
    const totalStudentAssignments = myAssignments.reduce((sum, a) => sum + (a.assignedTo?.length || 0), 0)
    const totalSubmissions = myAssignments.reduce((sum, a) => {
      return sum + (a.assignedTo || []).filter(sid => a.submissions[sid]?.status === "submitted").length
    }, 0)
    const overallRate = totalStudentAssignments === 0 ? 0 : Math.round((totalSubmissions / totalStudentAssignments) * 100)

  return (
    <div className='p-4 m-2 sm:m-6 mb-20'>
      <h1 className='font-bold text-2xl mb-6'>Hello, {name}! 👋🏻</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='card bg-base-200 p-4 rounded-xl'>
          <GraduationCap className='text-blue-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalCourses}</h2>
          <p className='text-sm text-base-content/60'>Courses</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl'>
          <Users className='text-green-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalStudents}</h2>
          <p className='text-sm text-base-content/60'>Students</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl'>
          <BookOpen className="text-yellow-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
          <p className='text-sm text-base-content/60'>Assignments</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl'>
          <ChartNoAxesColumnDecreasing className="text-purple-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{overallRate}%</h2>
          <p className='text-sm text-base-content/60'>Completion</p>
        </div>
      </div>

      {/* Courses Grid */}
      <h2 className='font-bold text-2xl mb-4'>My Courses</h2>
      {myCourses.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center'>
          <GraduationCap className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>No courses assigned yet.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {myCourses.map(course => {
            const courseAssignments = assignments.filter(a => a.courseId === course.id && a.createdBy === currentUserId)
            const courseSubmissions = courseAssignments.reduce((sum, a) => {
              return sum + (a.assignedTo || []).filter(sid => a.submissions[sid]?.status === "submitted").length
            }, 0)
            const courseTotalSubs = courseAssignments.reduce((sum, a) => sum + (a.assignedTo?.length || 0), 0)
            const courseRate = courseTotalSubs === 0 ? 0 : Math.round((courseSubmissions / courseTotalSubs) * 100)

            return (
              <div 
                key={course.id}
                className="card bg-base-300 border border-base-content/10 rounded-xl hover:border-pink-600/50 transition-all cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/admin/course/${course.id}`)}
              >
                <div className={`h-2 rounded-t-xl ${course.color}`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{course.name}</h3>
                      <p className="text-xs text-base-content/50">{course.code} • {course.semester}</p>
                    </div>
                  </div>
                  <p className="text-sm text-base-content/60 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-1 text-base-content/50">
                      <Users size={14}/> {course.enrolledStudents?.length || 0} students
                    </span>
                    <span className="flex items-center gap-1 text-base-content/50">
                      <BookOpen size={14}/> {courseAssignments.length} assignments
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-base-content/50 mb-1">
                      <span>Completion</span>
                      <span>{courseRate}%</span>
                    </div>
                    <progress 
                      className={`progress w-full ${courseRate === 100 ? "progress-success" : courseRate > 0 ? "progress-warning" : "progress-error"}`} 
                      value={courseRate} 
                      max="100"
                    ></progress>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminDb
