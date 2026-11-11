import { useContext, useState } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, ChartNoAxesColumnDecreasing, CircleCheck, Clock, Plus, Search, ArrowLeft } from 'lucide-react'
import AdminAssignment from './AdminAssignment'
import AssignmentForm from './AssignmentForm'
import { useParams, useNavigate } from 'react-router'
import toast from 'react-hot-toast'

const CourseAssignments = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const {currentUserId, assignments, setAssignments, courses, registeredUsers} = useContext(AuthContext)
    const [showForm, setShowForm] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [sortBy, setSortBy] = useState("deadline-asc")
    
    const allUsers = [...users, ...registeredUsers]
    const course = courses.find(c => c.id === courseId)
    const students = allUsers.filter(u => u.role === "student" && course?.enrolledStudents?.includes(u.id))

    if (!course) {
        return (
          <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
            <BookOpen className="text-base-content/30" size={48}/>
            <p className="text-base-content/60">Course not found</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/admin")}>Go Back</button>
          </div>
        )
    }

    // Only show assignments for this course created by this admin
    const myAssignments = assignments.filter(a => a.createdBy === currentUserId && a.courseId === courseId)
    
    // Apply search & filter
    let filteredAssignments = myAssignments.filter(a => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      if (!matchesSearch) return false

      const assignedStudents = a.assignedTo || []
      const submittedCount = assignedStudents.filter(
        sid => a.submissions?.[sid]?.status === "submitted"
      ).length
      const isOverdue = a.dueDate ? new Date(a.dueDate) < new Date() : false

      if (filterStatus === "complete") return submittedCount === assignedStudents.length && assignedStudents.length > 0
      if (filterStatus === "in-progress") return submittedCount > 0 && submittedCount < assignedStudents.length
      if (filterStatus === "pending") return submittedCount === 0
      if (filterStatus === "overdue") return isOverdue && submittedCount < assignedStudents.length
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

    // Stats
    const totalAssignments = myAssignments.length
    const totalStudentAssignments = myAssignments.reduce((sum, a) => sum + (a.assignedTo?.length || 0), 0)
    const totalSubmissions = myAssignments.reduce((sum, a) => {
      return sum + (a.assignedTo || []).filter(sid => a.submissions?.[sid]?.status === "submitted").length
    }, 0)
    const overallRate = totalStudentAssignments === 0 ? 0 : Math.round((totalSubmissions / totalStudentAssignments) * 100)

    const handleCreateAssignment = (newAssignment) => {
      const assignment = {
        ...newAssignment,
        id: `assignment_${Date.now()}`,
        createdBy: currentUserId,
        courseId: courseId,
        submissions: {}
      }
      newAssignment.assignedTo.forEach(sid => {
        assignment.submissions[sid] = { status: "not_submitted", submittedAt: null }
      })
      setAssignments(prev => [...prev, assignment])
      setShowForm(false)
      toast.success("Assignment created successfully!")
    }

    const handleEditAssignment = (updatedAssignment) => {
      setAssignments(prev => prev.map(a => {
        if(a.id === updatedAssignment.id) {
          const newSubmissions = {...a.submissions}
          updatedAssignment.assignedTo.forEach(sid => {
            if(!newSubmissions[sid]) {
              newSubmissions[sid] = { status: "not_submitted", submittedAt: null }
            }
          })
          Object.keys(newSubmissions).forEach(sid => {
            if(!updatedAssignment.assignedTo.includes(sid)) {
              delete newSubmissions[sid]
            }
          })
          return {
            ...a,
            title: updatedAssignment.title,
            description: updatedAssignment.description,
            dueDate: updatedAssignment.dueDate,
            driveLink: updatedAssignment.driveLink,
            submissionType: updatedAssignment.submissionType,
            assignedTo: updatedAssignment.assignedTo,
            submissions: newSubmissions
          }
        }
        return a
      }))
      setEditingAssignment(null)
      setShowForm(false)
      toast.success("Assignment updated successfully!")
    }

    const handleDeleteAssignment = (assignmentId) => {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId))
      toast.success("Assignment deleted")
    }

    const handleEditClick = (assignment) => {
      setEditingAssignment(assignment)
      setShowForm(true)
    }

    const handleCancelForm = () => {
      setShowForm(false)
      setEditingAssignment(null)
    }

  return (
    <div className='p-4 m-2 sm:m-6 mb-20'>
      {/* Back Button & Header */}
      <button className="btn btn-ghost btn-sm mb-4 text-base-content/60 hover:text-base-content flex items-center gap-1.5" onClick={() => navigate("/admin")}>
        <ArrowLeft size={16}/> Back to Courses
      </button>

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
        <div>
          <div className="flex items-center gap-2">
            <h1 className='font-bold text-2xl'>{course.name}</h1>
            <span className="badge badge-sm badge-neutral">{course.code}</span>
          </div>
          <p className='text-sm text-base-content/60 mt-0.5'>{course.semester} • {course.enrolledStudents?.length || 0} enrolled students</p>
        </div>
        <button 
          className='btn bg-pink-600 hover:bg-pink-700 text-white border-none btn-sm sm:btn-md shadow-sm'
          onClick={() => { setEditingAssignment(null); setShowForm(true) }}
        >
          <Plus size={18}/> New Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <BookOpen className='text-blue-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
          <p className='text-sm text-base-content/60'>Assignments</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <CircleCheck className='text-green-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalSubmissions}</h2>
          <p className='text-sm text-base-content/60'>Submissions</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <Clock className="text-yellow-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{totalStudentAssignments - totalSubmissions}</h2>
          <p className='text-sm text-base-content/60'>Pending</p>
        </div>
        <div className='card bg-base-200 p-4 rounded-xl border border-base-content/5'>
          <ChartNoAxesColumnDecreasing className="text-purple-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{overallRate}%</h2>
          <p className='text-sm text-base-content/60'>Completion</p>
        </div>
      </div>

      {/* Assignment Form */}
      {showForm && (
        <AssignmentForm 
          students={students}
          assignment={editingAssignment}
          onSubmit={editingAssignment ? handleEditAssignment : handleCreateAssignment}
          onCancel={handleCancelForm}
        />
      )}

      {/* Search, Filter & Sort Bar */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        <div className='relative flex-1'>
          <Search size={18} className='absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40'/>
          <input 
            type="text"
            placeholder="Search assignments by title or keyword..."
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
            <option value="all">All Status</option>
            <option value="complete">Fully Submitted</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">No Submissions</option>
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

      {/* Assignments List */}
      <div className="flex justify-between items-center mb-4">
        <h2 className='font-bold text-xl'>Course Assignments ({filteredAssignments.length})</h2>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center border border-base-content/5'>
          <BookOpen className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>
            {myAssignments.length === 0 
              ? "No assignments yet for this course. Click 'New Assignment' to create one!"
              : "No assignments match your filter or search query."
            }
          </p>
        </div>
      ) : (
        filteredAssignments.map(assignment => (
          <AdminAssignment 
            key={assignment.id}
            assignment={assignment}
            students={students}
            onEdit={handleEditClick}
            onDelete={handleDeleteAssignment}
          />
        ))
      )}
    </div>
  )
}

export default CourseAssignments
