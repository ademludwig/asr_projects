import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Vote, LogOut, CheckCircle, Award, TrendingUp } from 'lucide-react';

function VoteInterface() {
  const navigate = useNavigate();
  const { user, votedFor, setVotedFor, setUser } = useAuth();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      const res = await fetch('http://localhost:3000/candidates', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setCandidates(data);
    }
    fetchCandidates();
  }, [user]);

  const handleVote = async (candidateId) => {
    const res = await fetch('http://localhost:3000/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ vote_id: candidateId })
    });
    if (res.ok) setVotedFor(candidateId);
  };

  const handleLogout = () => {
    setUser(null);
    setVotedFor(null);
    navigate('/');
  };

  if (!votedFor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">2025 Election</h1>
                <p className="text-sm text-gray-500">Cast your vote today</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200">
                <LogOut className="w-4 h-4" /> <span>Logout</span>
              </button>
              {user.role === 'admin' && (
                <button onClick={() => navigate('/admin/add-candidate')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200">
                  ➕ Add Candidate
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-xl shadow-lg cursor-pointer" onClick={() => handleVote(candidate.id)}>
                <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white`}>
                  <h3 className="text-2xl font-bold">{candidate.name} {candidate.last_name}</h3>
                  <p>{candidate.speciality}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 italic">{candidate.speech}</p>
                  <button className="w-full bg-indigo-600 text-white py-2 mt-2 rounded-lg">Vote</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const votedCandidate = candidates.find(c => c.id === votedFor);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Vote Successfully Cast!</h2>
        <p className="text-gray-600 mb-8">You voted for: {votedCandidate.name} {votedCandidate.last_name}</p>
        <button onClick={handleLogout} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg">
          Return to Login
        </button>
      </div>
    </div>
  );
}

export default VoteInterface;
