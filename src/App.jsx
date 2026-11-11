import { BrowserRouter, Route, Routes } from "react-router"
import { Body } from "./components/Body"
import Login from "./components/Login"
import Register from "./components/Register"
import StudentDb from "./components/StudentDb"
import AdminDb from "./components/AdminDb"
import CourseAssignments from "./components/CourseAssignments"
import StudentCourseAssignments from "./components/StudentCourseAssignments"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a2332',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Body/>}>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/student" element={<StudentDb/>}/>
              <Route path="/student/course/:courseId" element={<StudentCourseAssignments/>}/>
              <Route path="/admin" element={<AdminDb/>}/>
              <Route path="/admin/course/:courseId" element={<CourseAssignments/>}/>
            </Route>
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
