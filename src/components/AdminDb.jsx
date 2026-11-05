import { useContext, useState } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from "../utils/users"
import { BookOpen, ChartNoAxesColumnDecreasing, CircleCheck, Clock, Plus, Search } from 'lucide-react'
import AdminAssignment from './AdminAssignment'
import AssignmentForm from './AssignmentForm'

const AdminDb = () => {
    const {currentUserId, assignments, setAssignments} = useContext(AuthContext)
    const [showForm, setShowForm] = useState(false)
    const [editingAssignment, setEditingAssignment] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    
    const user = users.find(user => user.id === currentUserId)
    const students = users.filter(u => u.role === "student")

    if (!user) {
        return (
          <div className="flex justify-center items-center min-h-[60vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )
    }

    const {name} = user

    // Only show assignments created by this admin
    const myAssignments = assignments.filter(a => a.createdBy === currentUserId)
    
    // Apply search & filter
    let filteredAssignments = myAssignments
    
    if(searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filteredAssignments = filteredAssignments.filter(a => 
        a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      )
    }

    if(filterStatus !== "all") {
      filteredAssignments = filteredAssignments.filter(a => {
        const assignedStudents = a.assignedTo || []
        const submittedCount = assignedStudents.filter(
          sid => a.submissions[sid]?.status === "submitted"
        ).length
        if(filterStatus === "complete") return submittedCount === assignedStudents.length && assignedStudents.length > 0
        if(filterStatus === "in-progress") return submittedCount > 0 && submittedCount < assignedStudents.length
        if(filterStatus === "pending") return submittedCount === 0
        return true
      })
    }

    // Stats
    const totalAssignments = myAssignments.length
    const totalStudentAssignments = myAssignments.reduce((sum, a) => sum + (a.assignedTo?.length || 0), 0)
    const totalSubmissions = myAssignments.reduce((sum, a) => {
      return sum + (a.assignedTo || []).filter(sid => a.submissions[sid]?.status === "submitted").length
    }, 0)
    const overallRate = totalStudentAssignments === 0 ? 0 : Math.round((totalSubmissions / totalStudentAssignments) * 100)

    const handleCreateAssignment = (newAssignment) => {
      const assignment = {
        ...newAssignment,
        id: `assignment_${Date.now()}`,
        createdBy: currentUserId,
        submissions: {}
      }
      // Initialize submissions for all assigned students
      newAssignment.assignedTo.forEach(sid => {
        assignment.submissions[sid] = { status: "not_submitted", submittedAt: null }
      })
      setAssignments(prev => [...prev, assignment])
      setShowForm(false)
    }

    const handleEditAssignment = (updatedAssignment) => {
      setAssignments(prev => prev.map(a => {
        if(a.id === updatedAssignment.id) {
          const newSubmissions = {...a.submissions}
          // Add submissions entries for newly assigned students
          updatedAssignment.assignedTo.forEach(sid => {
            if(!newSubmissions[sid]) {
              newSubmissions[sid] = { status: "not_submitted", submittedAt: null }
            }
          })
          // Remove entries for unassigned students
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
            assignedTo: updatedAssignment.assignedTo,
            submissions: newSubmissions
          }
        }
        return a
      }))
      setEditingAssignment(null)
      setShowForm(false)
    }

    const handleDeleteAssignment = (assignmentId) => {
      setAssignments(prev => prev.filter(a => a.id !== assignmentId))
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
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
        <h1 className='font-bold text-2xl'>Hello, {name}! 👋🏻</h1>
        <button 
          className='btn bg-pink-600 hover:bg-pink-700 text-white border-none btn-sm sm:btn-md'
          onClick={() => { setEditingAssignment(null); setShowForm(true) }}
        >
          <Plus size={18}/> New Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='card bg-base-200 p-4 rounded-xl'>
          <BookOpen className='text-blue-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalAssignments}</h2>
          <p className='text-sm text-base-content/60'>Assignments Created</p>
        </div>

        <div className='card bg-base-200 p-4 rounded-xl'>
          <CircleCheck className='text-green-400 mb-2' size={24}/>
          <h2 className='text-2xl font-bold'>{totalSubmissions}</h2>
          <p className='text-sm text-base-content/60'>Submissions Received</p>
        </div>

        <div className='card bg-base-200 p-4 rounded-xl'>
          <Clock className="text-yellow-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{totalStudentAssignments - totalSubmissions}</h2>
          <p className='text-sm text-base-content/60'>Pending Reviews</p>
        </div>

        <div className='card bg-base-200 p-4 rounded-xl'>
          <ChartNoAxesColumnDecreasing className="text-purple-400 mb-2" size={24}/>
          <h2 className='text-2xl font-bold'>{overallRate}%</h2>
          <p className='text-sm text-base-content/60'>Completion Rate</p>
        </div>
      </div>

      {/* Assignment Form Modal */}
      {showForm && (
        <AssignmentForm 
          students={students}
          assignment={editingAssignment}
          onSubmit={editingAssignment ? handleEditAssignment : handleCreateAssignment}
          onCancel={handleCancelForm}
        />
      )}

      {/* Search & Filter */}
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
        <select 
          className="select select-bordered bg-base-200 w-full sm:w-48"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="complete">Fully Submitted</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">No Submissions</option>
        </select>
      </div>

      {/* Assignments List */}
      <h2 className='font-bold text-2xl mb-4'>My Assignments</h2>
      {filteredAssignments.length === 0 ? (
        <div className='card bg-base-200 p-8 rounded-xl text-center'>
          <BookOpen className='mx-auto text-base-content/30 mb-3' size={48}/>
          <p className='text-base-content/60'>
            {myAssignments.length === 0 
              ? "You haven't created any assignments yet. Click 'New Assignment' to get started!"
              : "No assignments match your search or filter."
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

export default AdminDb
