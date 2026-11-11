import { useContext, useState } from "react"
import { AuthContext } from "../utils/AuthContext"
import { useNavigate, Link } from "react-router"
import users from "../utils/users"
import toast from "react-hot-toast"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const { login, registeredUsers } = useContext(AuthContext)
    const navigate = useNavigate()

    const allUsers = [...users, ...registeredUsers]

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
        <div className="flex justify-center items-center min-h-[80vh] p-4">
            <div className="card bg-base-200 border border-base-300 rounded-xl w-full max-w-sm p-6">
                <h2 className="text-2xl font-extrabold text-center mb-1">ClassPilot.</h2>
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

                    <button type="submit" className="btn btn-primary w-full">Sign In</button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-3 bg-base-300 rounded-lg">
                    <p className="text-xs font-semibold text-base-content/60 mb-2">Demo Credentials:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p className="font-medium text-pink-400">Professor</p>
                            <p className="text-base-content/50">sarah@classpilot.com</p>
                            <p className="text-base-content/50">admin123</p>
                        </div>
                        <div>
                            <p className="font-medium text-green-400">Student</p>
                            <p className="text-base-content/50">alice@student.com</p>
                            <p className="text-base-content/50">student123</p>
                        </div>
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
