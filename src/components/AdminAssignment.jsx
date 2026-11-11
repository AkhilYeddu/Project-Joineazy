import { Calendar, Edit, ExternalLink, Trash2, ChevronDown, ChevronUp, User, Users, Cloud } from 'lucide-react'
import { useState, useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'

const AdminAssignment = ({ assignment, students, onEdit, onDelete }) => {
    const { groups } = useContext(AuthContext)
    const [showDetails, setShowDetails] = useState(false)
    const { 
        title, 
        description, 
        dueDate, 
        id, 
        driveLink, 
        assignedTo = [], 
        submissions = {},
        submissionType = "individual",
        courseId 
    } = assignment

    const isGroup = submissionType === "group"

    // Group calculation
    const courseGroups = groups.filter(g => g.courseId === courseId)
    const submittedGroupsCount = courseGroups.filter(
        g => submissions[g.id]?.status === "submitted" || submissions[g.leaderId]?.status === "submitted"
    ).length
    const totalGroups = courseGroups.length
    const groupCompletionRate = totalGroups === 0 ? 0 : Math.round((submittedGroupsCount / totalGroups) * 100)

    // Individual calculation
    const assignedStudents = students.filter(s => assignedTo?.includes(s.id))
    const submittedCount = assignedStudents.filter(
        s => submissions[s.id]?.status === "submitted"
    ).length
    const totalAssigned = assignedStudents.length
    const completionRate = totalAssigned === 0 ? 0 : Math.round((submittedCount / totalAssigned) * 100)

    // Overdue calculation
    const isOverdue = dueDate ? new Date(dueDate) < new Date() : false

    const formatDeadline = (dateStr) => {
        if (!dateStr) return "No deadline"
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const deleteModalId = `delete-modal-${id}`

    const activeCompletionRate = isGroup ? groupCompletionRate : completionRate

    return (
        <div className={`card card-border bg-base-300 mb-4 p-4 w-full shadow-sm hover:border-pink-600/40 transition-all ${isOverdue ? "border-red-500/50" : "border-base-content/10"}`}>
            <div className="card-body p-2 sm:p-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`badge badge-sm font-semibold flex items-center gap-1 ${
                                isGroup ? "bg-purple-800/40 text-purple-300 border-purple-500/30" : "bg-blue-800/40 text-blue-300 border-blue-500/30"
                            }`}>
                                {isGroup ? <Users size={12}/> : <User size={12}/>}
                                {isGroup ? "Group Submission" : "Individual Submission"}
                            </span>
                            {isOverdue && (
                                <span className="badge badge-sm bg-red-900/50 text-red-300 border-red-500/40">
                                    Overdue
                                </span>
                            )}
                        </div>

                        <h2 className="card-title text-lg font-bold text-base-content">{title}</h2>
                        <p className="text-sm text-base-content/70 mt-1 whitespace-pre-line">{description}</p>
                        
                        <div className='flex flex-wrap gap-4 mt-3 items-center text-xs'>
                            <span className={`flex items-center gap-1.5 font-medium ${isOverdue ? "text-red-400" : "text-base-content/60"}`}>
                                <Calendar size={14}/> 
                                <span>Deadline: {formatDeadline(dueDate)}</span>
                            </span>
                            {driveLink && (
                                <a 
                                    href={driveLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
                                >
                                    <Cloud size={14}/>
                                    <span>OneDrive Resource</span>
                                    <ExternalLink size={12}/>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button 
                            className="btn btn-sm bg-base-200 hover:bg-blue-600/20 text-blue-400 border border-base-content/10"
                            onClick={() => onEdit(assignment)}
                        >
                            <Edit size={14}/> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button 
                            className="btn btn-sm bg-base-200 hover:bg-red-600/20 text-red-400 border border-base-content/10"
                            onClick={() => document.getElementById(deleteModalId)?.showModal()}
                        >
                            <Trash2 size={14}/> <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>

                {/* Progress Bar & Summary */}
                <div className="mt-4 pt-4 border-t border-base-content/10">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs sm:text-sm font-medium text-base-content/70">
                            {isGroup 
                                ? `Group Completion: ${submittedGroupsCount} of ${totalGroups} groups submitted` 
                                : `Class Completion: ${submittedCount} of ${totalAssigned} students submitted`
                            }
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-base-content">{activeCompletionRate}%</span>
                    </div>
                    <progress 
                        className={`progress w-full ${activeCompletionRate === 100 ? "progress-success" : activeCompletionRate > 0 ? "progress-warning" : "progress-error"}`} 
                        value={activeCompletionRate} 
                        max="100"
                    ></progress>
                </div>

                {/* Drill-down Toggle Button */}
                <button 
                    className="btn btn-ghost btn-sm mt-2 self-start text-base-content/70 hover:text-base-content flex items-center gap-1.5 px-1"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    <span>
                        {showDetails ? "Hide" : "Drill-down"} Submission Details ({isGroup ? `${totalGroups} groups` : `${totalAssigned} students`})
                    </span>
                </button>

                {/* Drill-down List */}
                {showDetails && (
                    <div className="mt-3 overflow-x-auto rounded-xl border border-base-content/10">
                        {isGroup ? (
                            /* Group Drill-down */
                            <table className="table table-sm bg-base-200 w-full">
                                <thead>
                                    <tr className="border-b border-base-content/10 text-base-content/70">
                                        <th>Group Name</th>
                                        <th>Leader</th>
                                        <th>Members</th>
                                        <th>Status</th>
                                        <th>Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseGroups.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-base-content/40 py-4">
                                                No groups formed in this course yet
                                            </td>
                                        </tr>
                                    ) : (
                                        courseGroups.map(group => {
                                            const sub = submissions[group.id] || submissions[group.leaderId]
                                            const isSubmitted = sub?.status === "submitted"
                                            const leader = students.find(s => s.id === group.leaderId)
                                            const memberNames = group.members
                                                .map(mid => students.find(s => s.id === mid)?.name || mid)
                                                .join(", ")

                                            return (
                                                <tr key={group.id} className="border-b border-base-content/5 hover:bg-base-300/50">
                                                    <td className="font-semibold text-base-content">{group.name}</td>
                                                    <td className="text-sm font-medium text-purple-300">
                                                        {leader?.name || "Assigned Leader"}
                                                    </td>
                                                    <td className="text-xs text-base-content/60 max-w-xs truncate" title={memberNames}>
                                                        {memberNames}
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge-sm font-semibold ${
                                                            isSubmitted ? "bg-green-800/40 text-green-400 border-green-600/30" : "bg-yellow-800/40 text-yellow-400 border-yellow-600/30"
                                                        }`}>
                                                            {isSubmitted ? "Submitted" : "Not Submitted"}
                                                        </span>
                                                    </td>
                                                    <td className="text-xs text-base-content/60">
                                                        {isSubmitted && sub?.submittedAt 
                                                            ? new Date(sub.submittedAt).toLocaleString() 
                                                            : "—"
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            /* Individual Drill-down */
                            <table className="table table-sm bg-base-200 w-full">
                                <thead>
                                    <tr className="border-b border-base-content/10 text-base-content/70">
                                        <th>Student</th>
                                        <th>Status</th>
                                        <th>Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center text-base-content/40 py-4">
                                                No students assigned
                                            </td>
                                        </tr>
                                    ) : (
                                        assignedStudents.map(student => {
                                            const sub = submissions[student.id]
                                            const isSubmitted = sub?.status === "submitted"
                                            return (
                                                <tr key={student.id} className="border-b border-base-content/5 hover:bg-base-300/50">
                                                    <td className="font-medium text-base-content">{student.name}</td>
                                                    <td>
                                                        <span className={`badge badge-sm font-semibold ${
                                                            isSubmitted ? "bg-green-800/40 text-green-400 border-green-600/30" : "bg-yellow-800/40 text-yellow-400 border-yellow-600/30"
                                                        }`}>
                                                            {isSubmitted ? "Submitted" : "Not Submitted"}
                                                        </span>
                                                    </td>
                                                    <td className="text-xs text-base-content/60">
                                                        {isSubmitted && sub?.submittedAt 
                                                            ? new Date(sub.submittedAt).toLocaleString() 
                                                            : "—"
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <dialog id={deleteModalId} className="modal">
                <div className="modal-box bg-base-200 border border-base-300">
                    <h3 className="font-bold text-lg text-base-content">Delete Assignment</h3>
                    <p className="py-4 text-sm text-base-content/70">
                        Are you sure you want to delete <strong>"{title}"</strong>? This will remove all associated submissions and progress data.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-ghost">Cancel</button>
                            <button
                                type="submit"
                                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none ml-2"
                                onClick={() => onDelete(id)}
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}

export default AdminAssignment
