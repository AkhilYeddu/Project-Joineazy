import { Calendar, Edit, ExternalLink, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const AdminAssignment = ({ assignment, students, onEdit, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false)
    const { title, description, dueDate, id, driveLink, assignedTo, submissions } = assignment

    const assignedStudents = students.filter(s => assignedTo?.includes(s.id))
    const submittedCount = assignedStudents.filter(
        s => submissions[s.id]?.status === "submitted"
    ).length
    const totalAssigned = assignedStudents.length
    const completionRate = totalAssigned === 0 ? 0 : Math.round((submittedCount / totalAssigned) * 100)
    const isOverdue = new Date(dueDate) < new Date()

    const deleteModalId = `delete-modal-${id}`

    return (
        <div className={`card card-border bg-base-300 mb-4 p-4 w-full ${isOverdue ? "border-red-500/50" : ""}`}>
            <div className="card-body p-2 sm:p-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                        <h2 className="card-title text-lg">{title}</h2>
                        <p className="text-sm text-base-content/70 mt-1">{description}</p>
                        <div className='flex flex-wrap gap-3 mt-3 items-center'>
                            <span className={`flex items-center gap-1 text-sm ${isOverdue ? "text-red-400" : "text-base-content/60"}`}>
                                <Calendar size={14}/> {dueDate}
                                {isOverdue && <span className="badge badge-xs bg-red-800/40 text-red-400 ml-1">Overdue</span>}
                            </span>
                            {driveLink && (
                                <a href={driveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    <ExternalLink size={14}/> Drive Link
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button 
                            className="btn btn-sm bg-base-200 hover:bg-blue-600/20 text-blue-400 border-none"
                            onClick={() => onEdit(assignment)}
                        >
                            <Edit size={14}/> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button 
                            className="btn btn-sm bg-base-200 hover:bg-red-600/20 text-red-400 border-none"
                            onClick={() => document.getElementById(deleteModalId)?.showModal()}
                        >
                            <Trash2 size={14}/> <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-base-content/60">
                            Class Progress: {submittedCount}/{totalAssigned} submitted
                        </span>
                        <span className="text-sm font-semibold">{completionRate}%</span>
                    </div>
                    <progress 
                        className={`progress w-full ${completionRate === 100 ? "progress-success" : completionRate > 0 ? "progress-warning" : "progress-error"}`} 
                        value={completionRate} 
                        max="100"
                    ></progress>
                </div>

                {/* Toggle Student Details */}
                <button 
                    className="btn btn-ghost btn-sm mt-2 self-start text-base-content/60"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    {showDetails ? "Hide" : "Show"} Student Submissions ({totalAssigned})
                </button>

                {/* Student Submission Details */}
                {showDetails && (
                    <div className="mt-2 overflow-x-auto">
                        <table className="table table-sm bg-base-200 rounded-lg">
                            <thead>
                                <tr>
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
                                            <tr key={student.id}>
                                                <td className="font-medium">{student.name}</td>
                                                <td>
                                                    <span className={`badge badge-sm ${isSubmitted ? "bg-green-800/40 text-green-400" : "bg-yellow-800/40 text-yellow-400"}`}>
                                                        {isSubmitted ? "Submitted" : "Not Submitted"}
                                                    </span>
                                                </td>
                                                <td className="text-sm text-base-content/60">
                                                    {isSubmitted && sub.submittedAt 
                                                        ? new Date(sub.submittedAt).toLocaleDateString() 
                                                        : "—"
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <dialog id={deleteModalId} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Assignment</h3>
                    <p className="py-4">
                        Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                            <button
                                type="submit"
                                className="btn bg-red-600 hover:bg-red-700 text-white border-none ml-2"
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

