import { useState } from 'react'
import { X, Cloud, User, Users } from 'lucide-react'

const AssignmentForm = ({ students, assignment, onSubmit, onCancel }) => {
    const isEditing = !!assignment

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
    const [assignedTo, setAssignedTo] = useState(
        assignment?.assignedTo || students.map(s => s.id)
    )
    const [selectAll, setSelectAll] = useState(
        assignment ? assignment.assignedTo?.length === students.length : true
    )
    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {}
        if (!title.trim()) newErrors.title = "Title is required"
        if (!description.trim()) newErrors.description = "Description is required"
        if (!dueDate) newErrors.dueDate = "Deadline (date and time) is required"
        if (assignedTo.length === 0) newErrors.assignedTo = "Assign to at least one student"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        const data = {
            title: title.trim(),
            description: description.trim(),
            dueDate,
            driveLink: driveLink.trim(),
            submissionType,
            assignedTo,
        }

        if (isEditing) {
            data.id = assignment.id
        }

        onSubmit(data)
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setAssignedTo([])
            setSelectAll(false)
        } else {
            setAssignedTo(students.map(s => s.id))
            setSelectAll(true)
        }
    }

    const handleStudentToggle = (studentId) => {
        setAssignedTo(prev => {
            const updated = prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
            setSelectAll(updated.length === students.length)
            return updated
        })
    }

    return (
        <div className="card bg-base-200 p-6 rounded-xl mb-6 border border-pink-600/30 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-bold text-lg">
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
                                    submissionType === "individual"
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
                                    submissionType === "group"
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

                    {/* Assign To Students */}
                    <div className="form-control sm:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="label">
                                <span className="label-text font-semibold">Assign To Students *</span>
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
                                    checked={selectAll}
                                    onChange={handleSelectAll}
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
