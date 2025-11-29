import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- fixed import
import { Vote, User, Lock, Mail, CheckCircle, LogOut, Award, TrendingUp } from 'lucide-react';

function VoteInterface() {
  const navigate = useNavigate();
  const { user, setUser, votedFor, setVotedFor } = useAuth(); // useAuth comes from context now

  const candidates = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      party: 'Progressive Party',
      slogan: 'Progress for Everyone',
      color: 'from-blue-500 to-blue-600',
      icon: '👩‍💼'
    },
    { 
      id: 2, 
      name: 'Michael Chen', 
      party: 'Unity Alliance',
      slogan: 'Together We Rise',
      color: 'from-green-500 to-green-600',
      icon: '👨‍💼'
    },
    { 
      id: 3, 
      name: 'Emma Rodriguez', 
      party: 'Future Forward',
      slogan: 'Innovation & Change',
      color: 'from-purple-500 to-purple-600',
      icon: '👩‍🔬'
    },
    { 
      id: 4, 
      name: 'James Wilson', 
      party: 'Democratic Reform',
      slogan: 'Justice & Equality',
      color: 'from-orange-500 to-orange-600',
      icon: '👨‍⚖️'
    }
  ];

  const handleVote = (candidateId) => {
    setVotedFor(candidateId);
  };

  const handleLogout = () => {
    setUser(null);
    setVotedFor(null);
    navigate('/');
  };

  if (!votedFor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        {/* Header */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
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
                  <p className="font-semibold text-gray-800">{user?.name || user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Choose Your Candidate</h2>
                <p className="text-indigo-100">Select the candidate who represents your vision for the future</p>
              </div>
              <Award className="w-16 h-16 text-indigo-200 hidden md:block" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-500"
                onClick={() => handleVote(candidate.id)}
              >
                <div className={`bg-gradient-to-r ${candidate.color} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl">{candidate.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{candidate.name}</h3>
                      <p className="text-sm opacity-90">{candidate.party}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-600 italic">"{candidate.slogan}"</p>
                  </div>
                  
                  <button className={`w-full bg-gradient-to-r ${candidate.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transform hover:scale-105 transition duration-200 shadow-md`}>
                    Vote for {candidate.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
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
        
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <p className="text-gray-600 mb-4">You voted for:</p>
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-5xl">{votedCandidate.icon}</span>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-800">{votedCandidate.name}</h3>
              <p className="text-gray-600">{votedCandidate.party}</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">Thank you for participating in the democratic process!</p>
        
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}

export default VoteInterface;
