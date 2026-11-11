import { useContext, useState } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, ChartNoAxesColumnDecreasing, CircleCheck, Clock, ArrowLeft, Users, Search, AlertCircle } from 'lucide-react'
import StudentAssignment from './StudentAssignment'
import GroupManager from './GroupManager'
import { useParams, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

const StudentCourseAssignments = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const {currentUserId, assignments, setAssignments, courses, groups, registeredUsers} = useContext(AuthContext)
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortBy, setSortBy] = useState("deadline-asc")
    
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

    // Find student's group in this course
    const myGroup = groups.find(g => g.courseId === courseId && g.members.includes(currentUserId))

    const myAssignments = assignments.filter(
      a => a.courseId === courseId && a.assignedTo?.includes(currentUserId)
    )

    // Filter and Search
    let filteredAssignments = myAssignments.filter(a => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      if (!matchesSearch) return false

      const isGroup = a.submissionType === "group"
      const groupSub = myGroup ? (a.submissions?.[myGroup.id] || a.submissions?.[myGroup.leaderId]) : null
      const isSub = isGroup ? groupSub?.status === "submitted" : a.submissions?.[currentUserId]?.status === "submitted"
      const isOverdue = a.dueDate ? new Date(a.dueDate) < new Date() && !isSub : false

      if (filterStatus === "submitted") return isSub
      if (filterStatus === "pending") return !isSub
      if (filterStatus === "overdue") return isOverdue
      if (filterStatus === "individual") return a.submissionType === "individual"
      if (filterStatus === "group") return a.submissionType === "group"

      return true
    })

    // Sorting
    filteredAssignments.sort((a, b) => {
      if (sortBy === "deadline-asc") {
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
      }
      if (sortBy === "deadline-desc") {
        return new Date(b.dueDate || 0) - new Date(a.dueDate || 0)
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    const totalAssignments = myAssignments.length
    const submittedAssignments = myAssignments.filter(a => {
      if (a.submissionType === "group") {
        return myGroup && (a.submissions?.[myGroup.id]?.status === "submitted" || a.submissions?.[myGroup.leaderId]?.status === "submitted")
      }
      return a.submissions?.[currentUserId]?.status === "submitted"
    }).length
    const pendingAssignments = totalAssignments - submittedAssignments
    const completionPercentage = totalAssignments === 0
      ? 0
      : Math.round((submittedAssignments / totalAssignments) * 100)

    const handleSubmission = (assignmentId, options = {}) => {
        const now = new Date().toISOString()

        setAssignments(prevAssignments =>
          prevAssignments.map(assignment => {
            if (assignment.id === assignmentId) {
              const newSubmissions = { ...assignment.submissions }

              if (options.isGroup && myGroup) {
                // Record for group ID
                newSubmissions[myGroup.id] = {
                  status: "submitted",
                  submittedAt: now,
                  submittedBy: currentUserId,
                  leaderName: options.leaderName,
                  groupId: myGroup.id
                }
                // Also record for all group members so everyone sees completed status
                myGroup.members.forEach(memberId => {
                  newSubmissions[memberId] = {
                    status: "submitted",
                    submittedAt: now,
                    acknowledgedBy: options.leaderName,
                    isGroupSubmission: true
                  }
                })
              } else {
                // Individual submission
                newSubmissions[currentUserId] = {
                  status: "submitted",
                  submittedAt: now
                }
              }

              return {
                ...assignment,
                submissions: newSubmissions
              }
            }
            return assignment;
          })
        )

        if (options.isGroup) {
          toast.success(`Group assignment acknowledged for ${myGroup.name}!`)
        } else {
          toast.success("Assignment submitted successfully!")
        }
    }

  return (
    <div className='p-4 m-2 sm:m-6 mb-20'>
      {/* Back Button */}
      <button className="btn btn-ghost btn-sm mb-4 text-base-content/60 hover:text-base-content flex items-center gap-1.5" onClick={() => navigate("/student")}>
        <ArrowLeft size={16}/> Back to Courses
      </button>

      {/* Course Header & Group Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className='font-bold text-2xl'>{course.name}</h1>
            <span className="badge badge-sm badge-neutral">{course.code}</span>
          </div>
          <p className='text-sm text-base-content/60 mt-0.5'>{course.semester}</p>
        </div>

        {/* Group Management Quick Access */}
        <button 
          className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none flex items-center gap-2 shadow-sm"
          onClick={() => setIsGroupModalOpen(true)}
        >
          <Users size={16}/>
          <span>{myGroup ? `Group: ${myGroup.name}` : "Manage / Join Groups"}</span>
        </button>
      </div>

      {/* My Group Quick Banner */}
      {myGroup ? (
        <div className="alert bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-xl mb-6 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-purple-300">
            <Users size={16} className="text-purple-400 shrink-0"/>
            <span>
              You are enrolled in <strong>{myGroup.name}</strong> ({myGroup.members.length} members). 
              {myGroup.leaderId === currentUserId ? " You are the group leader." : " You can collaborate on group assignments."}
            </span>
          </div>
          <button 
            className="btn btn-ghost btn-xs text-purple-300 hover:text-white"
            onClick={() => setIsGroupModalOpen(true)}
          >
            View Group Info
          </button>
        </div>
      ) : (
        <div className="alert bg-yellow-950/20 border border-yellow-500/30 p-3.5 rounded-xl mb-6 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2 text-yellow-300">
            <AlertCircle size={16} className="text-yellow-400 shrink-0"/>
            <span>You haven't joined a group in this course yet. Required for team assignments!</span>
          </div>
          <button 
            className="btn btn-xs bg-yellow-600 hover:bg-yellow-700 text-white border-none ml-2"
            onClick={() => setIsGroupModalOpen(true)}
          >
            Join a Group
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <BookOpen className='text-blue-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
          <p className='text-sm text-base-content/60'>Total Assignments</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <CircleCheck className='text-green-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{submittedAssignments}</h2>
          <p className='text-sm text-base-content/60'>Completed</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <Clock className="text-yellow-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{pendingAssignments}</h2>
          <p className='text-sm text-base-content/60'>Pending</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <ChartNoAxesColumnDecreasing className="text-purple-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{completionPercentage}%</h2>
          <p className='text-sm text-base-content/60'>Completion</p>
        </div>
      </div>

      {/* Progress */}
      <div className='card bg-base-200 p-6 rounded-xl mb-8 border border-base-content/5'>
        <div className="flex justify-between items-center mb-2">
          <h2 className='font-bold text-lg'>Course Completion</h2>
          <span className="text-sm font-semibold">{submittedAssignments} of {totalAssignments} assignments finished</span>
        </div>
        <progress className="progress progress-success w-full" value={completionPercentage} max="100"></progress>
      </div>

      {/* Search, Filter & Sort */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        <div className='relative flex-1'>
          <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40'/>
          <input 
            type="text"
            placeholder="Search assignments..."
            className="input input-bordered w-full pl-10 bg-base-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="select select-bordered bg-base-200 text-xs sm:text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Assignments</option>
            <option value="submitted">Completed</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="individual">Individual Only</option>
            <option value="group">Group Only</option>
          </select>

          <select
            className="select select-bordered bg-base-200 text-xs sm:text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="deadline-asc">Deadline (Soonest)</option>
            <option value="deadline-desc">Deadline (Latest)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Assignments Section */}
      <h2 className='font-bold text-xl mb-4'>Assignments ({filteredAssignments.length})</h2>
      {filteredAssignments.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center border border-base-content/5'>
          <BookOpen className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>
            {myAssignments.length === 0 
              ? "No assignments assigned in this course yet." 
              : "No assignments match your search or filter."
            }
          </p>
        </div>
      ) : (
        filteredAssignments.map(assignment => (
          <StudentAssignment 
            key={assignment.id} 
            assignment={assignment} 
            onSubmit={handleSubmission}
            myGroup={myGroup}
            onOpenGroupManager={() => setIsGroupModalOpen(true)}
          />
        ))
      )}

      {/* Group Manager Modal */}
      <GroupManager 
        courseId={courseId}
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </div>
  )
}

export default StudentCourseAssignments
