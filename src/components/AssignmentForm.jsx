import { useState } from 'react'
import { X } from 'lucide-react'

const AssignmentForm = ({ students, assignment, onSubmit, onCancel }) => {
    const isEditing = !!assignment

    const [title, setTitle] = useState(assignment?.title || "")
    const [description, setDescription] = useState(assignment?.description || "")
    const [dueDate, setDueDate] = useState(assignment?.dueDate || "")
    const [driveLink, setDriveLink] = useState(assignment?.driveLink || "")
    const [assignedTo, setAssignedTo] = useState(assignment?.assignedTo || [])
    const [selectAll, setSelectAll] = useState(
        assignment ? assignment.assignedTo?.length === students.length : false
    )
    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {}
        if (!title.trim()) newErrors.title = "Title is required"
        if (!description.trim()) newErrors.description = "Description is required"
        if (!dueDate) newErrors.dueDate = "Due date is required"
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
        <div className="card bg-base-200 p-6 rounded-xl mb-6 border border-pink-600/30">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">
                    {isEditing ? "Edit Assignment" : "Create New Assignment"}
                </h3>
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
                            placeholder="Assignment title"
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
                            placeholder="Assignment description"
                            className={`textarea textarea-bordered bg-base-300 w-full h-24 ${errors.description ? "textarea-error" : ""}`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <span className="text-red-400 text-xs mt-1">{errors.description}</span>}
                    </div>

                    {/* Due Date */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Due Date *</span>
                        </label>
                        <input 
                            type="date"
                            className={`input input-bordered bg-base-300 w-full ${errors.dueDate ? "input-error" : ""}`}
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        {errors.dueDate && <span className="text-red-400 text-xs mt-1">{errors.dueDate}</span>}
                    </div>

                    {/* Drive Link */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Google Drive Link</span>
                        </label>
                        <input 
                            type="url"
                            placeholder="https://drive.google.com/..."
                            className="input input-bordered bg-base-300 w-full"
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                        />
                    </div>

                    {/* Assign To Students */}
                    <div className="form-control sm:col-span-2">
                        <label className="label">
                            <span className="label-text font-semibold">Assign To *</span>
                        </label>
                        <div className="bg-base-300 rounded-lg p-3">
                            <label className="flex items-center gap-2 mb-3 cursor-pointer border-b border-base-content/10 pb-2">
                                <input 
                                    type="checkbox"
                                    className="checkbox checkbox-sm checkbox-primary"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                                <span className="text-sm font-medium">Select All Students</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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

