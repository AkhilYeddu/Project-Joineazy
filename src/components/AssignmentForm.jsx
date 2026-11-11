import { useState, useContext } from 'react'
import { X, Cloud, User, Users, ShieldAlert } from 'lucide-react'
import { AuthContext } from '../utils/AuthContext'
import users from '../utils/users'

const AssignmentForm = ({ students, assignment, onSubmit, onCancel }) => {
    const isEditing = !!assignment
    const { groups, registeredUsers } = useContext(AuthContext)
    const allUsers = [...users, ...registeredUsers]

    // Convert date string to YYYY-MM-DDThh:mm for datetime-local input
    const formatInitialDate = (dateStr) => {
        if (!dateStr) return ""
        if (dateStr.includes("T")) return dateStr.slice(0, 16)
        return `${dateStr}T23:59`
    }

    const [title, setTitle] = useState(assignment?.title || "")
    const [description, setDescription] = useState(assignment?.description || "")
    const [dueDate, setDueDate] = useState(formatInitialDate(assignment?.dueDate))
    const [driveLink, setDriveLink] = useState(assignment?.driveLink || "")
    const [submissionType, setSubmissionType] = useState(assignment?.submissionType || "individual")

    // Course groups
    const courseId = assignment?.courseId
    const courseGroups = groups.filter(g => !courseId || g.courseId === courseId)

    // For group assignments: tracked by group IDs
    const [assignedGroups, setAssignedGroups] = useState(() => {
        if (assignment?.assignedGroups && assignment.assignedGroups.length > 0) {
            return assignment.assignedGroups
        }
        if (assignment?.assignedTo && assignment.submissionType === "group") {
            return courseGroups.filter(g => g.members.some(m => assignment.assignedTo.includes(m))).map(g => g.id)
        }
        return courseGroups.map(g => g.id)
    })

    // For individual assignments: tracked by student IDs
    const [assignedTo, setAssignedTo] = useState(() => {
        if (assignment?.assignedTo) {
            return assignment.assignedTo
        }
        return students.map(s => s.id)
    })

    const [selectAllStudents, setSelectAllStudents] = useState(
        assignment ? assignment.assignedTo?.length === students.length : true
    )
    const [selectAllGroups, setSelectAllGroups] = useState(
        assignment ? assignedGroups.length === courseGroups.length : true
    )
    const [errors, setErrors] = useState({})

    const isGroup = submissionType === "group"

    const validate = () => {
        const newErrors = {}
        if (!title.trim()) newErrors.title = "Title is required"
        if (!description.trim()) newErrors.description = "Description is required"
        if (!dueDate) newErrors.dueDate = "Deadline (date and time) is required"

        if (isGroup) {
            if (assignedGroups.length === 0) newErrors.assignedGroups = "Assign to at least one group"
        } else {
            if (assignedTo.length === 0) newErrors.assignedTo = "Assign to at least one student"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        let finalAssignedTo = assignedTo
        let finalAssignedGroups = []

        if (isGroup) {
            finalAssignedGroups = assignedGroups
            // For group assignments, assignedTo ONLY contains members of the assigned groups
            const selectedCourseGroups = courseGroups.filter(g => assignedGroups.includes(g.id))
            finalAssignedTo = [...new Set(selectedCourseGroups.flatMap(g => g.members))]
        }

        const data = {
            title: title.trim(),
            description: description.trim(),
            dueDate,
            driveLink: driveLink.trim(),
            submissionType,
            assignedTo: finalAssignedTo,
            assignedGroups: finalAssignedGroups
        }

        if (isEditing) {
            data.id = assignment.id
        }

        onSubmit(data)
    }

    const handleSelectAllStudents = () => {
        if (selectAllStudents) {
            setAssignedTo([])
            setSelectAllStudents(false)
        } else {
            setAssignedTo(students.map(s => s.id))
            setSelectAllStudents(true)
        }
    }

    const handleStudentToggle = (studentId) => {
        setAssignedTo(prev => {
            const updated = prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
            setSelectAllStudents(updated.length === students.length)
            return updated
        })
    }

    const handleSelectAllGroups = () => {
        if (selectAllGroups) {
            setAssignedGroups([])
            setSelectAllGroups(false)
        } else {
            setAssignedGroups(courseGroups.map(g => g.id))
            setSelectAllGroups(true)
        }
    }

    const handleGroupToggle = (groupId) => {
        setAssignedGroups(prev => {
            const updated = prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
            setSelectAllGroups(updated.length === courseGroups.length)
            return updated
        })
    }

    return (
        <div className="card bg-base-200 p-6 rounded-xl mb-6 border border-pink-600/30 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-lg text-base-content">
                        {isEditing ? "Edit Assignment" : "Create New Assignment"}
                    </h3>
                    <p className="text-xs text-base-content/60">Fill in all details to assign to students</p>
                </div>
                <button className="btn btn-ghost btn-sm btn-circle" onClick={onCancel}>
                    <X size={18}/>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="form-control sm:col-span-2">
                        <label className="label">
                            <span className="label-text font-semibold">Title *</span>
                        </label>
                        <input 
                            type="text"
                            placeholder="e.g. Full Stack Web Project"
                            className={`input input-bordered bg-base-300 w-full ${errors.title ? "input-error" : ""}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <span className="text-red-400 text-xs mt-1">{errors.title}</span>}
                    </div>

                    {/* Description */}
                    <div className="form-control sm:col-span-2">
                        <label className="label">
                            <span className="label-text font-semibold">Description *</span>
                        </label>
                        <textarea 
                            placeholder="Detailed requirements, instructions and evaluation criteria..."
                            className={`textarea textarea-bordered bg-base-300 w-full h-24 ${errors.description ? "textarea-error" : ""}`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <span className="text-red-400 text-xs mt-1">{errors.description}</span>}
                    </div>

                    {/* Submission Type */}
                    <div className="form-control sm:col-span-2">
                        <label className="label">
                            <span className="label-text font-semibold">Submission Type *</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                                    !isGroup
                                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                                        : "bg-base-300 text-base-content/80 border-base-content/10 hover:bg-base-100"
                                }`}
                                onClick={() => setSubmissionType("individual")}
                            >
                                <User size={16}/>
                                <span>Individual Submission</span>
                            </button>
                            <button
                                type="button"
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                                    isGroup
                                        ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                                        : "bg-base-300 text-base-content/80 border-base-content/10 hover:bg-base-100"
                                }`}
                                onClick={() => setSubmissionType("group")}
                            >
                                <Users size={16}/>
                                <span>Group Submission</span>
                            </button>
                        </div>
                    </div>

                    {/* Deadline (Date & Time) */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Deadline (Date & Time) *</span>
                        </label>
                        <input 
                            type="datetime-local"
                            className={`input input-bordered bg-base-300 w-full ${errors.dueDate ? "input-error" : ""}`}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        {errors.dueDate && <span className="text-red-400 text-xs mt-1">{errors.dueDate}</span>}
                    </div>

                    {/* OneDrive Link */}
                    <div className="form-control">
                        <label className="label flex justify-between">
                            <span className="label-text font-semibold flex items-center gap-1.5">
                                <Cloud size={14} className="text-blue-400"/> OneDrive Link
                            </span>
                            <span className="label-text-alt text-base-content/50">Optional</span>
                        </label>
                        <input 
                            type="url"
                            placeholder="https://onedrive.live.com/..."
                            className="input input-bordered bg-base-300 w-full"
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                        />
                    </div>

                    {/* Assign To Section: Groups vs Students */}
                    <div className="form-control sm:col-span-2">
                        {isGroup ? (
                            /* Group Selection */
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="label">
                                        <span className="label-text font-semibold text-purple-300 flex items-center gap-1.5">
                                            <Users size={15}/> Assign To Groups *
                                        </span>
                                    </label>
                                    <span className="text-xs text-base-content/60">
                                        {assignedGroups.length} of {courseGroups.length} groups selected
                                    </span>
                                </div>
                                <div className="bg-base-300 rounded-lg p-3 border border-purple-500/30">
                                    {courseGroups.length === 0 ? (
                                        <div className="flex items-center gap-2 p-3 text-xs text-yellow-300 bg-yellow-950/20 rounded-lg">
                                            <ShieldAlert size={16} className="shrink-0"/>
                                            <span>No groups have been created in this course yet. Students can form groups from their dashboard.</span>
                                        </div>
                                    ) : (
                                        <>
                                            <label className="flex items-center gap-2 mb-3 cursor-pointer border-b border-base-content/10 pb-2">
                                                <input 
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm checkbox-primary"
                                                    checked={selectAllGroups}
                                                    onChange={handleSelectAllGroups}
                                                />
                                                <span className="text-sm font-medium">Select All Groups in Course</span>
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {courseGroups.map(group => {
                                                    const leader = allUsers.find(u => u.id === group.leaderId)
                                                    const memberNames = group.members
                                                        .map(mid => allUsers.find(u => u.id === mid)?.name || mid)
                                                        .join(", ")

                                                    return (
                                                        <label key={group.id} className="flex items-start gap-2.5 cursor-pointer hover:bg-base-200 p-2.5 rounded-lg transition-colors border border-base-content/5">
                                                            <input 
                                                                type="checkbox"
                                                                className="checkbox checkbox-sm checkbox-secondary mt-0.5"
                                                                checked={assignedGroups.includes(group.id)}
                                                                onChange={() => handleGroupToggle(group.id)}
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-bold text-base-content">{group.name}</span>
                                                                    <span className="badge badge-xs badge-neutral">
                                                                        {group.members.length} {group.members.length === 1 ? "student" : "students"}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-base-content/60 mt-0.5">
                                                                    Leader: <span className="text-purple-300 font-medium">{leader?.name || "Student"}</span> • Members: {memberNames}
                                                                </p>
                                                            </div>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {errors.assignedGroups && <span className="text-red-400 text-xs mt-1">{errors.assignedGroups}</span>}
                            </div>
                        ) : (
                            /* Individual Students Selection */
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center gap-1.5">
                                            <User size={15}/> Assign To Students *
                                        </span>
                                    </label>
                                    <span className="text-xs text-base-content/60">
                                        {assignedTo.length} of {students.length} selected
                                    </span>
                                </div>
                                <div className="bg-base-300 rounded-lg p-3 border border-base-content/10">
                                    <label className="flex items-center gap-2 mb-3 cursor-pointer border-b border-base-content/10 pb-2">
                                        <input 
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-primary"
                                            checked={selectAllStudents}
                                            onChange={handleSelectAllStudents}
                                        />
                                        <span className="text-sm font-medium">Select All Students in Course</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                                        {students.map(student => (
                                            <label key={student.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded-lg transition-colors">
                                                <input 
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm checkbox-success"
                                                    checked={assignedTo.includes(student.id)}
                                                    onChange={() => handleStudentToggle(student.id)}
                                                />
                                                <span className="text-sm">{student.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {errors.assignedTo && <span className="text-red-400 text-xs mt-1">{errors.assignedTo}</span>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" className="btn btn-ghost" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn bg-pink-600 hover:bg-pink-700 text-white border-none">
                        {isEditing ? "Update Assignment" : "Create Assignment"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AssignmentForm
