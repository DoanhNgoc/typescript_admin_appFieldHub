import "./Assets/styles.scss"
import MainLayout from "./layouts/MainLayout"
import 'bootstrap-icons/font/bootstrap-icons.css';
import AuthLayout from "./layouts/AuthLauout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <div className="min-vh-100 w-100 m-0 p-0 bg-body ">
      <Router>
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route path="/MainLayout" element={<MainLayout />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
