import { BrowserRouter, Route,Routes } from "react-router"
import { Body } from "./components/Body"
import Login from "./components/Login"
import StudentDb from "./components/StudentDb"
import AdminDb from "./components/AdminDb"
function App() {


  return (
    <div>
        <BrowserRouter>
        <Routes>
            <Route path="/" element = {<Body></Body>}>
              
              <Route path="/login" element = {<Login></Login>}></Route>
              <Route path="/student" element = {<StudentDb></StudentDb>}></Route>
              <Route path="/admin" element= {<AdminDb></AdminDb>}></Route>
            </Route>
        </Routes>
        </BrowserRouter>
    </div>
      
   
  )
}

export default App
