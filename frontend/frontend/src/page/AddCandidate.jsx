import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AddCandidate() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', last_name: '', speciality: '', speech: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/admin/candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) setMessage('Candidate added successfully!');
      else setMessage(data.message);
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Candidate</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full border p-3 rounded" placeholder="First Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
        <input className="w-full border p-3 rounded" placeholder="Last Name" onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
        <input className="w-full border p-3 rounded" placeholder="Speciality" onChange={e => setFormData({ ...formData, speciality: e.target.value })} />
        <textarea className="w-full border p-3 rounded" placeholder="Speech" onChange={e => setFormData({ ...formData, speech: e.target.value })}></textarea>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg">Add Candidate</button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

export default AddCandidate;
