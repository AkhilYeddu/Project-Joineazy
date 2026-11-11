import { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, GraduationCap, CircleCheck, ChartNoAxesColumnDecreasing, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'

const StudentDb = () => {
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

    // Courses enrolled by this student
    const enrolledCourses = courses.filter(c => c.enrolledStudents?.includes(currentUserId))

    // Overall stats across enrolled courses
    const myAssignments = assignments.filter(
      a => a.assignedTo?.includes(currentUserId)
    )
    const totalAssignments = myAssignments.length
    const submittedAssignments = myAssignments.filter(
      a => a.submissions?.[currentUserId]?.status === "submitted"
    ).length
    const completionPercentage = totalAssignments === 0
      ? 0
      : Math.round((submittedAssignments / totalAssignments) * 100)

  return (
    <div className='p-4 m-2 sm:m-6 mb-20'>
        <div className='mb-6'>
          <h1 className='font-bold text-2xl'>Hello, {name}! 👋🏻</h1>
          <p className='text-sm text-base-content/60 mt-1'>Welcome to your student dashboard. Select a course to view assignments and groups.</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
            <GraduationCap className='text-blue-400 mb-2' size={24}/>
            <h2 className='text-2xl font-bold'>{enrolledCourses.length}</h2>
            <p className='text-sm text-base-content/60'>Enrolled Courses</p>
          </div>

          <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
            <BookOpen className='text-yellow-400 mb-2' size={24}/>
            <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
            <p className='text-sm text-base-content/60'>Total Assignments</p>
          </div>

          <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
            <CircleCheck className='text-green-400 mb-2' size={24}/>
            <h2 className='text-2xl font-bold'>{submittedAssignments}</h2>
            <p className='text-sm text-base-content/60'>Completed</p>
          </div>

          <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
            <ChartNoAxesColumnDecreasing className="text-purple-400 mb-2" size={24}/>
            <h2 className='text-2xl font-bold'>{completionPercentage}%</h2>
            <p className='text-sm text-base-content/60'>Overall Completion</p>
          </div>
        </div>
    
      {/* Overall Progress Section */}
      <div className='card bg-base-200 p-6 rounded-xl mb-8 border border-base-content/5'>
        <div className='flex justify-between items-center mb-2'>
          <h2 className='font-bold text-lg'>Semester Progress</h2>
          <span className='font-semibold text-sm'>{submittedAssignments} / {totalAssignments} assignments submitted</span>
        </div>
        <progress className="progress progress-success w-full" value={completionPercentage} max="100"></progress>
      </div>

      {/* Enrolled Courses Grid */}
      <h2 className='font-bold text-2xl mb-4'>My Enrolled Courses</h2>
      {enrolledCourses.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center border border-base-content/5'>
          <GraduationCap className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>You are not enrolled in any courses for this semester.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {enrolledCourses.map(course => {
            const courseAssignments = assignments.filter(
              a => a.courseId === course.id && a.assignedTo?.includes(currentUserId)
            )
            const courseTotal = courseAssignments.length
            const courseSubmitted = courseAssignments.filter(
              a => a.submissions?.[currentUserId]?.status === "submitted"
            ).length
            const courseRate = courseTotal === 0 ? 0 : Math.round((courseSubmitted / courseTotal) * 100)
            const professor = allUsers.find(u => u.id === course.professorId)

            return (
              <div 
                key={course.id}
                className="card bg-base-300 border border-base-content/10 rounded-xl hover:border-green-500/50 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 group"
                onClick={() => navigate(`/student/course/${course.id}`)}
              >
                <div className={`h-2 rounded-t-xl ${course.color || "bg-green-600"}`}></div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="badge badge-sm badge-neutral">{course.code}</span>
                      <span className="text-xs text-base-content/60 font-medium">{course.semester}</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-green-400 transition-colors">{course.name}</h3>
                    <p className="text-xs text-base-content/60 mt-1">Instructor: {professor?.name || "Professor"}</p>
                    <p className="text-sm text-base-content/70 mt-3 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-base-content/10">
                    <div className="flex justify-between items-center text-xs text-base-content/60 mb-2">
                      <span>{courseSubmitted} of {courseTotal} submitted</span>
                      <span className="font-semibold">{courseRate}%</span>
                    </div>
                    <progress 
                      className={`progress w-full ${courseRate === 100 ? "progress-success" : courseRate > 0 ? "progress-warning" : "progress-error"}`} 
                      value={courseRate} 
                      max="100"
                    ></progress>
                    
                    <div className="flex justify-end items-center gap-1 mt-4 text-xs font-semibold text-green-400 group-hover:translate-x-1 transition-transform">
                      <span>View Course Assignments</span>
                      <ArrowRight size={14}/>
                    </div>
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

export default StudentDb
