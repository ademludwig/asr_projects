import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './page/Login';
import Register from './page/Register';
import VoteInterface from './page/VoteInterface';
import AddCandidate from './page/AddCandidate';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vote" element={<ProtectedRoute><VoteInterface /></ProtectedRoute>} />
          <Route path="/admin/add-candidate" element={<AdminRoute><AddCandidate /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
