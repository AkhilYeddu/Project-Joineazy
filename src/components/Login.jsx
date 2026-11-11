import { useContext, useState } from "react"
import { AuthContext } from "../utils/AuthContext"
import { useNavigate, Link } from "react-router"
import users from "../utils/users"
import toast from "react-hot-toast"
import { Eye, EyeOff, Mail, Lock, GraduationCap, Users, ArrowRight } from "lucide-react"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [demoTab, setDemoTab] = useState("admin")
    const { login, registeredUsers } = useContext(AuthContext)
    const navigate = useNavigate()

    const allUsers = [...users, ...registeredUsers]
    const admins = allUsers.filter(u => u.role === "admin")
    const students = allUsers.filter(u => u.role === "student")

    const validate = () => {
        const newErrors = {}
        if (!email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email"
        if (!password) newErrors.password = "Password is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLogin = (e) => {
        e.preventDefault()
        if (!validate()) return

        const user = allUsers.find(u => u.email === email && u.password === password)
        if (!user) {
            toast.error("Invalid email or password")
            return
        }

        login(user.id)
        toast.success(`Welcome back, ${user.name}!`)

        if (user.role === "admin") {
            navigate("/admin")
        } else {
            navigate("/student")
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[85vh] p-4">
            <div className="card bg-base-200 border border-base-300 rounded-xl w-full max-w-md p-6 shadow-xl">
                <h2 className="text-2xl font-extrabold text-center mb-1 text-base-content">ClassPilot.</h2>
                <p className="text-sm text-base-content/60 text-center mb-6">Sign in to your account</p>

                <form onSubmit={handleLogin}>
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

                    {/* Password */}
                    <div className="form-control mb-6">
                        <label className="label">
                            <span className="label-text font-semibold">Password</span>
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"/>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
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

                    <button type="submit" className="btn btn-primary w-full shadow-sm">Sign In</button>
                </form>

                {/* Demo Credentials List */}
                <div className="mt-6 p-3.5 bg-base-300 rounded-xl border border-base-content/10">
                    <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[11px] font-bold text-base-content/70 uppercase tracking-wider">
                            Demo Accounts
                        </span>
                        <div className="flex gap-1 bg-base-200 p-0.5 rounded-lg border border-base-content/10">
                            <button
                                type="button"
                                className={`btn btn-xs border-none ${
                                    demoTab === "admin" 
                                        ? "bg-pink-600 text-white shadow-xs" 
                                        : "btn-ghost text-base-content/70 hover:text-base-content"
                                }`}
                                onClick={() => setDemoTab("admin")}
                            >
                                <GraduationCap size={12}/> Admins ({admins.length})
                            </button>
                            <button
                                type="button"
                                className={`btn btn-xs border-none ${
                                    demoTab === "student" 
                                        ? "bg-green-600 text-white shadow-xs" 
                                        : "btn-ghost text-base-content/70 hover:text-base-content"
                                }`}
                                onClick={() => setDemoTab("student")}
                            >
                                <Users size={12}/> Students ({students.length})
                            </button>
                        </div>
                    </div>

                    <p className="text-[11px] text-base-content/50 mb-2">
                        Click any user below to auto-fill email & password:
                    </p>

                    {/* Scrollable List of Students / Admins */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                        {(demoTab === "admin" ? admins : students).map(u => (
                            <div
                                key={u.id}
                                className={`flex justify-between items-center p-2 rounded-lg bg-base-200 hover:bg-base-100 transition-all cursor-pointer border ${
                                    email === u.email 
                                        ? demoTab === "admin" ? "border-pink-500/50 bg-pink-950/20" : "border-green-500/50 bg-green-950/20" 
                                        : "border-base-content/5"
                                } group`}
                                onClick={() => {
                                    setEmail(u.email)
                                    setPassword(u.password)
                                    setErrors({})
                                    toast.success(`Selected ${u.name}`)
                                }}
                                title="Click to auto-fill credentials"
                            >
                                <div className="min-w-0 pr-2">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-semibold text-base-content truncate group-hover:text-primary">
                                            {u.name}
                                        </p>
                                        {u.id === "student1" && (
                                            <span className="badge badge-xs bg-purple-900/50 text-purple-300 border-purple-500/30">
                                                Team Alpha Leader
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-base-content/60 truncate">
                                        {u.email}
                                    </p>
                                </div>
                                <div className="text-right shrink-0 flex items-center gap-1.5">
                                    <span className="badge badge-xs badge-neutral text-[10px] font-mono">
                                        {u.password}
                                    </span>
                                    <ArrowRight size={12} className="text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-sm text-center mt-4 text-base-content/60">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
