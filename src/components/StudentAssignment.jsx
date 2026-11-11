import { useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from '../utils/users'
import { Calendar, ExternalLink, Cloud, User, Users, AlertCircle, CheckCircle2 } from 'lucide-react'

const StudentAssignment = ({ assignment, onSubmit, myGroup, onOpenGroupManager }) => {
    const { currentUserId, registeredUsers } = useContext(AuthContext)
    const allUsers = [...users, ...registeredUsers]

    const { 
        title, 
        description, 
        dueDate, 
        id, 
        driveLink, 
        submissionType = "individual" 
    } = assignment

    const isGroup = submissionType === "group"

    // Group submission check
    const groupSubmission = myGroup 
        ? (assignment.submissions?.[myGroup.id] || assignment.submissions?.[myGroup.leaderId])
        : null
    const isGroupSubmitted = groupSubmission?.status === "submitted"

    // Individual submission check
    const individualSubmission = assignment.submissions?.[currentUserId]
    const isIndividualSubmitted = individualSubmission?.status === "submitted"

    const didSubmit = isGroup ? isGroupSubmitted : isIndividualSubmitted
    const isOverdue = dueDate ? new Date(dueDate) < new Date() && !didSubmit : false

    const isGroupLeader = myGroup?.leaderId === currentUserId
    const leaderUser = myGroup ? allUsers.find(u => u.id === myGroup.leaderId) : null
    const leaderName = leaderUser?.name || "Group Leader"

    const modalId = `modal-${id}`

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

    const formatSubmittedAt = (dateStr) => {
        if (!dateStr) return ""
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleConfirm = () => {
        if (isGroup) {
            onSubmit(id, {
                isGroup: true,
                groupId: myGroup.id,
                leaderName: leaderName
            })
        } else {
            onSubmit(id, {
                isGroup: false
            })
        }
    }

    return (
        <div className={`card card-border bg-base-300 mb-4 p-4 w-full relative shadow-sm transition-all ${
            isOverdue ? "border-red-500/50" : didSubmit ? "border-green-600/30" : "border-base-content/10"
        }`}>
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className={`badge p-3 font-semibold text-xs flex items-center gap-1 ${
                    didSubmit
                        ? "text-green-400 bg-green-900/40 border-green-600/30"
                        : isOverdue
                        ? "text-red-400 bg-red-900/40 border-red-600/30"
                        : "text-yellow-400 bg-yellow-900/40 border-yellow-600/30"
                }`}>
                    {didSubmit ? "Completed" : isOverdue ? "Overdue" : "Pending"}
                </span>
            </div>

            <div className="card-body p-2 sm:p-4">
                <div>
                    {/* Submission Type Tag */}
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`badge badge-sm font-semibold flex items-center gap-1 ${
                            isGroup 
                                ? "bg-purple-900/40 text-purple-300 border-purple-500/30" 
                                : "bg-blue-900/40 text-blue-300 border-blue-500/30"
                        }`}>
                            {isGroup ? <Users size={12}/> : <User size={12}/>}
                            {isGroup ? "Group Assignment" : "Individual Assignment"}
                        </span>
                    </div>

                    <h2 className={`card-title text-lg font-bold ${didSubmit ? "text-base-content/70" : "text-base-content"}`}>
                        {title}
                    </h2>
                    <p className={`text-sm mt-1 whitespace-pre-line ${didSubmit ? "text-base-content/50" : "text-base-content/70"}`}>
                        {description}
                    </p>

                    {/* Metadata: Deadline and OneDrive */}
                    <div className='flex flex-wrap gap-4 mt-3 items-center text-xs'>
                        <span className={`flex items-center gap-1.5 font-medium ${
                            didSubmit ? "text-base-content/40" : isOverdue ? "text-red-400" : "text-base-content/60"
                        }`}>
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

                    {/* Group Assignment Status Notifications */}
                    {isGroup && (
                        <div className="mt-4 pt-3 border-t border-base-content/10">
                            {!myGroup ? (
                                /* No group message required by PDF */
                                <div className="alert bg-yellow-950/30 border border-yellow-600/40 py-2.5 px-3 rounded-xl flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-yellow-300">
                                        <AlertCircle size={16} className="shrink-0"/>
                                        <span>You are not part of any group. Create or join one to submit this assignment.</span>
                                    </div>
                                    <button 
                                        className="btn btn-xs bg-purple-600 hover:bg-purple-700 text-white border-none ml-2 shrink-0"
                                        onClick={onOpenGroupManager}
                                    >
                                        Create / Join Group
                                    </button>
                                </div>
                            ) : didSubmit ? (
                                /* Acknowledged by leader message required by PDF */
                                <div className="alert bg-green-950/30 border border-green-600/40 py-2 px-3 rounded-xl flex items-center gap-2 text-xs text-green-300">
                                    <CheckCircle2 size={16} className="shrink-0 text-green-400"/>
                                    <span>
                                        Acknowledged by <strong>{leaderName}</strong> on {formatSubmittedAt(groupSubmission?.submittedAt)}
                                        {isGroupLeader && " (You)"}
                                    </span>
                                </div>
                            ) : !isGroupLeader ? (
                                /* Only leader can submit */
                                <div className="alert bg-base-200 border border-base-content/10 py-2 px-3 rounded-xl flex items-center gap-2 text-xs text-base-content/70">
                                    <Users size={16} className="shrink-0 text-purple-400"/>
                                    <span>
                                        Your group: <strong>{myGroup.name}</strong>. Only group leader (<strong>{leaderName}</strong>) can acknowledge submission.
                                    </span>
                                </div>
                            ) : (
                                /* Leader submission ready */
                                <div className="alert bg-purple-950/30 border border-purple-500/30 py-2 px-3 rounded-xl flex items-center gap-2 text-xs text-purple-300">
                                    <Users size={16} className="shrink-0 text-purple-400"/>
                                    <span>
                                        You are the leader of <strong>{myGroup.name}</strong>. You can acknowledge submission on behalf of your team.
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Submission Action */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-base-content/10">
                    <div className="text-xs text-base-content/50">
                        {didSubmit && !isGroup && individualSubmission?.submittedAt && (
                            <span>Submitted on {formatSubmittedAt(individualSubmission.submittedAt)}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 2-Step Submission Button */}
                        {isGroup ? (
                            /* Group Submission Button */
                            <button
                                className={`btn btn-sm ${
                                    didSubmit 
                                        ? "bg-green-800/30 text-green-400 border border-green-600/30 cursor-not-allowed" 
                                        : !myGroup 
                                        ? "bg-base-200 text-base-content/40 border border-base-content/10 cursor-not-allowed"
                                        : !isGroupLeader
                                        ? "bg-base-200 text-base-content/40 border border-base-content/10 cursor-not-allowed"
                                        : "bg-purple-600 hover:bg-purple-700 text-white border-none shadow-sm"
                                }`}
                                disabled={didSubmit || !myGroup || !isGroupLeader}
                                onClick={() => document.getElementById(modalId)?.showModal()}
                            >
                                {didSubmit ? "✓ Acknowledged" : "Yes, I have submitted"}
                            </button>
                        ) : (
                            /* Individual Submission Button */
                            <button
                                className={`btn btn-sm ${
                                    didSubmit 
                                        ? "bg-green-800/30 text-green-400 border border-green-600/30 cursor-not-allowed" 
                                        : "bg-green-700 hover:bg-green-600 text-white border-none shadow-sm"
                                }`}
                                disabled={didSubmit}
                                onClick={() => document.getElementById(modalId)?.showModal()}
                            >
                                {didSubmit ? "✓ Submitted" : "Yes, I have submitted"}
                            </button>
                        )}

                        {/* Confirmation Dialog (Step 2) */}
                        <dialog id={modalId} className="modal">
                            <div className="modal-box bg-base-200 border border-base-300">
                                <h3 className="font-bold text-lg text-base-content">
                                    Confirm Submission
                                </h3>

                                <p className="py-4 text-sm text-base-content/80">
                                    {isGroup ? (
                                        <>
                                            Are you sure you want to acknowledge submission for <strong>"{title}"</strong> on behalf of <strong>{myGroup?.name}</strong>? A timestamp will be recorded for all team members.
                                        </>
                                    ) : (
                                        <>
                                            Are you sure you want to mark <strong>"{title}"</strong> as submitted? A timestamp will be recorded.
                                        </>
                                    )}
                                </p>

                                <div className="modal-action">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-ghost">Cancel</button>

                                        <button
                                            type="submit"
                                            className={`btn btn-sm text-white border-none ml-2 ${isGroup ? "bg-purple-600 hover:bg-purple-700" : "bg-green-700 hover:bg-green-600"}`}
                                            onClick={handleConfirm}
                                        >
                                            Confirm Submission
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
        </div>
    )
}

export default StudentAssignment
