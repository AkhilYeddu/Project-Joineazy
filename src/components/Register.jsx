import { useContext, useState } from "react"
import { AuthContext } from "../utils/AuthContext"
import { useNavigate, Link } from "react-router"
import users from "../utils/users"
import toast from "react-hot-toast"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const { register, login, registeredUsers } = useContext(AuthContext)
    const navigate = useNavigate()

    const allUsers = [...users, ...registeredUsers]

    const validate = () => {
        const newErrors = {}
        if (!name.trim()) newErrors.name = "Name is required"
        if (!email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email"
        else if (allUsers.find(u => u.email === email)) newErrors.email = "Email already registered"
        if (!password) newErrors.password = "Password is required"
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        if (!role) newErrors.role = "Please select a role"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleRegister = (e) => {
        e.preventDefault()
        if (!validate()) return

        const newUser = {
            id: `${role}_${Date.now()}`,
            name: name.trim(),
            email: email.trim(),
            password,
            role: role === "professor" ? "admin" : "student"
        }

        register(newUser)
        login(newUser.id)
        toast.success(`Account created! Welcome, ${newUser.name}!`)

        if (newUser.role === "admin") {
            navigate("/admin")
        } else {
            navigate("/student")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-4">
            <div className="card bg-base-200 border border-base-300 rounded-xl w-full max-w-sm p-6">
                <h2 className="text-2xl font-extrabold text-center mb-1">ClassPilot.</h2>
                <p className="text-sm text-base-content/60 text-center mb-6">Create your account</p>

                <form onSubmit={handleRegister}>
                    {/* Name */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Full Name</span>
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"/>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={`input input-bordered bg-base-300 w-full pl-10 ${errors.name ? "input-error" : ""}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {errors.name && <span className="text-red-400 text-xs mt-1">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"/>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`input input-bordered bg-base-300 w-full pl-10 ${errors.email ? "input-error" : ""}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email}</span>}
                    </div>

                    {/* Role Selection */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">I am a</span>
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className={`flex-1 rounded-xl text-sm border p-3 hover:cursor-pointer transition-colors ${
                                    role === "student" 
                                        ? "bg-green-600 text-white border-green-600" 
                                        : "bg-base-300 text-white border-success"
                                }`}
                                onClick={() => setRole("student")}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={`flex-1 rounded-xl text-sm border p-3 hover:cursor-pointer transition-colors ${
                                    role === "professor" 
                                        ? "bg-pink-600 text-white border-pink-600" 
                                        : "bg-base-300 text-white border-pink-600"
                                }`}
                                onClick={() => setRole("professor")}
                            >
                                Professor
                            </button>
                        </div>
                        {errors.role && <span className="text-red-400 text-xs mt-1">{errors.role}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"/>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min. 6 characters"
                                className={`input input-bordered bg-base-300 w-full pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                            </button>
                        </div>
                        {errors.password && <span className="text-red-400 text-xs mt-1">{errors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-control mb-6">
                        <label className="label">
                            <span className="label-text font-semibold">Confirm Password</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"/>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                className={`input input-bordered bg-base-300 w-full pl-10 ${errors.confirmPassword ? "input-error" : ""}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {errors.confirmPassword && <span className="text-red-400 text-xs mt-1">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full">Create Account</button>
                </form>

                <p className="text-sm text-center mt-4 text-base-content/60">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default Register

