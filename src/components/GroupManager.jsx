import { useState, useContext } from 'react'
import { AuthContext } from '../utils/AuthContext'
import users from '../utils/users'
import { Users, UserPlus, LogIn, Crown, User, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const GroupManager = ({ courseId, isOpen, onClose }) => {
    const { currentUserId, groups, setGroups, registeredUsers } = useContext(AuthContext)
    const [groupName, setGroupName] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    if (!isOpen) return null

    const allUsers = [...users, ...registeredUsers]
    const courseGroups = groups.filter(g => g.courseId === courseId)
    const myGroup = courseGroups.find(g => g.members.includes(currentUserId))

    const handleCreateGroup = (e) => {
        e.preventDefault()
        if (!groupName.trim()) {
            toast.error("Please enter a group name")
            return
        }

        const newGroup = {
            id: `group_${Date.now()}`,
            name: groupName.trim(),
            courseId: courseId,
            leaderId: currentUserId,
            members: [currentUserId]
        }

        setGroups(prev => [...prev, newGroup])
        setGroupName("")
        setIsCreating(false)
        toast.success(`Group "${newGroup.name}" created! You are the leader.`)
    }

    const handleJoinGroup = (group) => {
        if (group.members.includes(currentUserId)) return

        setGroups(prev => prev.map(g => {
            if (g.id === group.id) {
                return {
                    ...g,
                    members: [...g.members, currentUserId]
                }
            }
            return g
        }))

        toast.success(`Joined "${group.name}" successfully!`)
    }

    const handleLeaveGroup = () => {
        if (!myGroup) return

        if (myGroup.leaderId === currentUserId && myGroup.members.length > 1) {
            // Assign next member as leader
            const nextLeader = myGroup.members.find(m => m !== currentUserId)
            setGroups(prev => prev.map(g => {
                if (g.id === myGroup.id) {
                    return {
                        ...g,
                        leaderId: nextLeader,
                        members: g.members.filter(m => m !== currentUserId)
                    }
                }
                return g
            }))
        } else if (myGroup.members.length === 1) {
            // Delete group if only 1 member
            setGroups(prev => prev.filter(g => g.id !== myGroup.id))
        } else {
            // Regular member leaving
            setGroups(prev => prev.map(g => {
                if (g.id === myGroup.id) {
                    return {
                        ...g,
                        members: g.members.filter(m => m !== currentUserId)
                    }
                }
                return g
            }))
        }

        toast.success("Left group successfully")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="card bg-base-200 border border-base-content/10 w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-base-content/10 flex justify-between items-center bg-base-300">
                    <div className="flex items-center gap-2">
                        <Users className="text-purple-400" size={20}/>
                        <h3 className="font-bold text-lg text-base-content">Course Groups</h3>
                    </div>
                    <button className="btn btn-ghost btn-xs btn-circle text-base-content/60" onClick={onClose}>
                        <X size={18}/>
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                    {/* Current Group Status */}
                    {myGroup ? (
                        <div className="card bg-purple-950/20 border border-purple-500/30 p-4 rounded-xl">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-base text-purple-300">{myGroup.name}</h4>
                                        <span className="badge badge-sm bg-purple-900/50 text-purple-300 border-purple-500/30">
                                            Your Group
                                        </span>
                                    </div>
                                    <p className="text-xs text-base-content/60 mt-0.5">
                                        Leader: {allUsers.find(u => u.id === myGroup.leaderId)?.name || "Unknown"}
                                        {myGroup.leaderId === currentUserId && " (You)"}
                                    </p>
                                </div>
                                <button 
                                    className="btn btn-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30"
                                    onClick={handleLeaveGroup}
                                >
                                    Leave Group
                                </button>
                            </div>

                            <div className="mt-3">
                                <p className="text-xs font-semibold text-base-content/70 mb-2">Group Members ({myGroup.members.length}):</p>
                                <div className="space-y-1.5">
                                    {myGroup.members.map(memberId => {
                                        const member = allUsers.find(u => u.id === memberId)
                                        const isLeader = memberId === myGroup.leaderId
                                        const isMe = memberId === currentUserId
                                        return (
                                            <div key={memberId} className="flex items-center justify-between bg-base-300/80 px-3 py-1.5 rounded-lg text-xs">
                                                <div className="flex items-center gap-2">
                                                    <User size={13} className="text-base-content/40"/>
                                                    <span className={`font-medium ${isMe ? "text-purple-300 font-bold" : "text-base-content"}`}>
                                                        {member?.name || "Student"} {isMe && "(You)"}
                                                    </span>
                                                </div>
                                                {isLeader && (
                                                    <span className="flex items-center gap-1 text-yellow-400 font-semibold text-xs">
                                                        <Crown size={12}/> Leader
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card bg-base-300 p-4 rounded-xl border border-dashed border-base-content/20 text-center">
                            <Users size={32} className="mx-auto text-base-content/40 mb-2"/>
                            <p className="font-semibold text-sm text-base-content">You are not part of any group in this course</p>
                            <p className="text-xs text-base-content/60 mt-1 mb-4">
                                Create your own group or join one of the existing groups below to submit group assignments.
                            </p>
                            {!isCreating && (
                                <button 
                                    className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none self-center flex items-center gap-1.5"
                                    onClick={() => setIsCreating(true)}
                                >
                                    <UserPlus size={15}/> Create a New Group
                                </button>
                            )}
                        </div>
                    )}

                    {/* Create Group Form */}
                    {isCreating && !myGroup && (
                        <form onSubmit={handleCreateGroup} className="card bg-base-300 p-4 rounded-xl border border-purple-500/30">
                            <h4 className="font-bold text-sm text-base-content mb-2 flex items-center gap-1.5">
                                <UserPlus size={16} className="text-purple-400"/> Create Group
                            </h4>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    placeholder="Enter group name (e.g. Code Warriors)"
                                    className="input input-bordered input-sm bg-base-200 flex-1 text-sm"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none">
                                    Create
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-ghost"
                                    onClick={() => setIsCreating(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Available Groups List */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-sm text-base-content">
                                All Groups in this Course ({courseGroups.length})
                            </h4>
                            {!myGroup && !isCreating && (
                                <button 
                                    className="btn btn-ghost btn-xs text-purple-400"
                                    onClick={() => setIsCreating(true)}
                                >
                                    + Create Group
                                </button>
                            )}
                        </div>

                        {courseGroups.length === 0 ? (
                            <p className="text-xs text-base-content/50 italic text-center py-4">
                                No groups created in this course yet. Be the first to create one!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {courseGroups.map(group => {
                                    const isMyCurrentGroup = group.id === myGroup?.id
                                    const leader = allUsers.find(u => u.id === group.leaderId)
                                    const memberNames = group.members
                                        .map(m => allUsers.find(u => u.id === m)?.name || "Student")
                                        .join(", ")

                                    return (
                                        <div 
                                            key={group.id} 
                                            className={`card p-3 rounded-xl border transition-all ${
                                                isMyCurrentGroup 
                                                    ? "bg-purple-950/20 border-purple-500/40" 
                                                    : "bg-base-300 border-base-content/10"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-base-content">{group.name}</span>
                                                        <span className="badge badge-xs badge-neutral">
                                                            {group.members.length} {group.members.length === 1 ? "member" : "members"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-base-content/60 mt-0.5">
                                                        Leader: <span className="font-medium text-purple-300">{leader?.name || "Student"}</span>
                                                    </p>
                                                    <p className="text-xs text-base-content/50 mt-1 line-clamp-1" title={memberNames}>
                                                        Members: {memberNames}
                                                    </p>
                                                </div>

                                                {!myGroup && (
                                                    <button 
                                                        className="btn btn-xs bg-purple-600 hover:bg-purple-700 text-white border-none flex items-center gap-1 shrink-0"
                                                        onClick={() => handleJoinGroup(group)}
                                                    >
                                                        <LogIn size={12}/> Join
                                                    </button>
                                                )}

                                                {isMyCurrentGroup && (
                                                    <span className="badge badge-sm badge-success gap-1 text-xs">
                                                        <Check size={11}/> Joined
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-base-content/10 flex justify-end bg-base-300">
                    <button className="btn btn-sm btn-primary" onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GroupManager
