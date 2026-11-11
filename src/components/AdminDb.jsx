import { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, Users, ChartNoAxesColumnDecreasing, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router'

const AdminDb = () => {
    const {currentUserId, assignments, courses, groups, registeredUsers} = useContext(AuthContext)
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
    const myCourseIds = new Set(myCourses.map(c => c.id))

    // Helper to calculate exact progress metrics for any course
    const getCourseMetrics = (course) => {
      const courseAssignments = assignments.filter(a => a.courseId === course.id)
      const courseGroups = groups.filter(g => g.courseId === course.id)

      let totalRateSum = 0
      let totalExpectedSubs = 0
      let totalActualSubs = 0

      courseAssignments.forEach(a => {
        if (a.submissionType === "group") {
          const groupCount = courseGroups.length || 1
          const submittedGroups = courseGroups.filter(
            g => a.submissions?.[g.id]?.status === "submitted" || a.submissions?.[g.leaderId]?.status === "submitted"
          ).length
          totalExpectedSubs += groupCount
          totalActualSubs += submittedGroups
          totalRateSum += (submittedGroups / groupCount) * 100
        } else {
          const studentCount = (a.assignedTo || []).length
          const submittedStudents = (a.assignedTo || []).filter(
            sid => a.submissions?.[sid]?.status === "submitted"
          ).length
          totalExpectedSubs += studentCount
          totalActualSubs += submittedStudents
          totalRateSum += studentCount > 0 ? (submittedStudents / studentCount) * 100 : 0
        }
      })

      const courseRate = courseAssignments.length > 0 
        ? Math.round(totalRateSum / courseAssignments.length)
        : 0

      return {
        assignmentsCount: courseAssignments.length,
        totalExpectedSubs,
        totalActualSubs,
        courseRate
      }
    }

    // Overall stats across all courses of this professor
    const totalCourses = myCourses.length
    const totalStudents = new Set(myCourses.flatMap(c => c.enrolledStudents || [])).size
    const totalEnrollments = myCourses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0)
    
    // Assignments in professor's courses (or created by professor)
    const myAssignments = assignments.filter(a => 
      myCourseIds.has(a.courseId) || (myCourses.length === 0 && a.createdBy === currentUserId)
    )
    const totalAssignments = myAssignments.length

    // Average completion across all courses
    const allCourseMetrics = myCourses.map(c => getCourseMetrics(c))
    const totalRateSums = allCourseMetrics.reduce((sum, m) => sum + m.courseRate, 0)
    const overallRate = totalCourses > 0 ? Math.round(totalRateSums / totalCourses) : 0

  return (
    <div className='p-4 m-2 sm:m-6 mb-20'>
      <div className="mb-6">
        <h1 className='font-bold text-2xl'>Hello, {name}! 👋🏻</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Welcome to your professor dashboard. Select any course card below to manage assignments and review student submissions.
        </p>
      </div>

      {/* Top Summary Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <GraduationCap className='text-blue-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalCourses}</h2>
          <p className='text-sm text-base-content/60'>Courses Taught</p>
          <span className="text-xs text-base-content/40 mt-0.5">Active this semester</span>
        </div>

        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <Users className='text-green-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalStudents}</h2>
          <p className='text-sm text-base-content/60'>Total Students</p>
          <span className="text-xs text-base-content/40 mt-0.5">{totalEnrollments} course enrollments</span>
        </div>

        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <BookOpen className="text-yellow-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
          <p className='text-sm text-base-content/60'>Assignments</p>
          <span className="text-xs text-base-content/40 mt-0.5">Across {totalCourses} courses</span>
        </div>

        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <ChartNoAxesColumnDecreasing className="text-purple-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{overallRate}%</h2>
          <p className='text-sm text-base-content/60'>Average Completion</p>
          <span className="text-xs text-base-content/40 mt-0.5">Across all courses</span>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="flex justify-between items-center mb-4">
        <h2 className='font-bold text-2xl'>My Courses ({totalCourses})</h2>
      </div>

      {myCourses.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center border border-base-content/5'>
          <GraduationCap className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>No courses assigned to your profile yet.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {myCourses.map(course => {
            const metrics = getCourseMetrics(course)

            return (
              <div 
                key={course.id}
                className="card bg-base-300 border border-base-content/10 rounded-xl hover:border-pink-600/50 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 group"
                onClick={() => navigate(`/admin/course/${course.id}`)}
              >
                <div className={`h-2 rounded-t-xl ${course.color || "bg-pink-600"}`}></div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="badge badge-sm badge-neutral">{course.code}</span>
                      <span className="text-xs text-base-content/50 font-medium">{course.semester}</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-pink-400 transition-colors">{course.name}</h3>
                    <p className="text-sm text-base-content/60 mt-2 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-base-content/10">
                    <div className="flex justify-between items-center text-xs text-base-content/60 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-base-content/40"/> {course.enrolledStudents?.length || 0} students
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <BookOpen size={14} className="text-base-content/40"/> {metrics.assignmentsCount} assignments
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-base-content/70">
                        <span>Class Completion</span>
                        <span className="font-bold">{metrics.courseRate}%</span>
                      </div>
                      <progress 
                        className={`progress w-full ${metrics.courseRate === 100 ? "progress-success" : metrics.courseRate > 0 ? "progress-warning" : "progress-error"}`} 
                        value={metrics.courseRate} 
                        max="100"
                      ></progress>
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

export default AdminDb
