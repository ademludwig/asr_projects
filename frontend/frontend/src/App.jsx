import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./page/Login";
import Register from "./page/Register";
import VoteInterface from "./page/Vote";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vote" element={<VoteInterface />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}