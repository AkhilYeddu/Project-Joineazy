import { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import { Calendar, ExternalLink } from 'lucide-react'

const StudentAssignment = (props) => {
    const { currentUserId } = useContext(AuthContext)

    const { title, description, dueDate, id, driveLink } = props.assignment

    const didSubmit =
        props.assignment.submissions?.[currentUserId]?.status === "submitted"

    const isOverdue = new Date(dueDate) < new Date() && !didSubmit

    // Generate a unique ID for every assignment's modal
    const modalId = `modal-${id}`

    const handleSubmission = () => {
        props.onSubmit(id)
    }

    return (
        <div className={`card card-border bg-base-300 m-2 mb-4 p-4 w-full relative ${isOverdue ? "border-red-500/50" : ""}`}>

            <div className="absolute top-4 right-4">
                <span className={`badge p-3 ${
                    didSubmit
                        ? "text-green-400 bg-green-800/40"
                        : isOverdue
                        ? "text-red-400 bg-red-800/40"
                        : "text-yellow-400 bg-yellow-800/40"
                }`}>
                    {didSubmit ? "Completed" : isOverdue ? "Overdue" : "Pending"}
                </span>
            </div>

            <div className="card-body p-2 sm:p-4">
                <div>
                    <h2 className={`card-title text-lg ${didSubmit ? "line-through text-base-content/50" : ""}`}>{title}</h2>
                    <p className={`text-sm mt-1 ${didSubmit ? "line-through text-base-content/40" : "text-base-content/70"}`}>{description}</p>
                    <div className='flex flex-wrap gap-3 mt-3 items-center'>
                        <span className={`flex items-center gap-1 text-sm ${didSubmit ? "text-base-content/40" : isOverdue ? "text-red-400" : "text-base-content/60"}`}>
                            <Calendar size={14}/> {dueDate}
                        </span>
                        {driveLink && (
                            <a href={driveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                <ExternalLink size={14}/> Drive Link
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-2">
                    <button
                        className={`btn btn-sm sm:btn-md ${didSubmit ? "bg-base-content/10 text-base-content/40 cursor-not-allowed" : "bg-green-700 hover:bg-green-600 text-white border-none"}`}
                        disabled={didSubmit}
                        onClick={() =>
                            document.getElementById(modalId)?.showModal()
                        }
                    >
                        {didSubmit ? "✓ Submitted" : "I have submitted"}
                    </button>

                    <dialog id={modalId} className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                Confirm Submission
                            </h3>

                            <p className="py-4">
                                Are you sure you want to mark <strong>"{title}"</strong> as submitted? This action cannot be undone.
                            </p>

                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">Cancel</button>

                                    <button
                                        type="submit"
                                        className="btn bg-green-700 hover:bg-green-600 text-white border-none ml-2"
                                        onClick={handleSubmission}
                                    >
                                        Yes, I've submitted
                                    </button>
                                </form>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>
            </div>
        </div>
    )
}

export default StudentAssignment
