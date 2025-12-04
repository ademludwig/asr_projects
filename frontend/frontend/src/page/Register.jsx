import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setErrors({ form: 'All fields are required' });
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.message || 'Registration failed' });
        return;
      }

      setUser({ email: formData.email, token: data.token || null, role: data.role || 'user', first_name: formData.first_name, last_name: formData.last_name });
      navigate('/');
    } catch (err) {
      setErrors({ form: 'Server error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-full">
              <User className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
          <p className="text-center text-gray-500 mb-8">Join us to participate in voting</p>
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
          <div className="space-y-4">
            <input type="text" placeholder="First Name" className="w-full border p-3 rounded" onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
            <input type="text" placeholder="Last Name" className="w-full border p-3 rounded" onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
            <input type="email" placeholder="Email" className="w-full border p-3 rounded" onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <input type="password" placeholder="Password" className="w-full border p-3 rounded" onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <button onClick={handleRegister} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition duration-200 shadow-lg">
              Create Account
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => navigate('/')} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
