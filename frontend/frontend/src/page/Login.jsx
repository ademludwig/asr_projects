// page/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vote, Lock, Mail } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email || !formData.password) {
      setErrors({ form: 'Email and password are required' });
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.message || 'Login failed' });
        return;
      }

      // Decode JWT to get is_admin and userId
      const payload = JSON.parse(atob(data.token.split('.')[1]));

      const loggedUser = {
        email: payload.email,
        userId: payload.userId,
        is_admin: payload.is_admin,
        token: data.token
      };

      setUser(loggedUser);
      localStorage.setItem('token', data.token);

      // Redirect admin to /admin/add-candidates, others to /vote
      if (loggedUser.is_admin === 1) {
        navigate('/admin/add-candidate');
      } else {
        navigate('/vote');
      }

    } catch (err) {
      setErrors({ form: 'Server error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-8 flex flex-col space-y-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-full">
              <Vote className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Sign in to cast your vote</p>
          </div>
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg"
            >
              Sign In
            </button>
          </div>
          <div className="text-center pt-2">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
