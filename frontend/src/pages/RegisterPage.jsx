import { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function RegisterPage({ onBack }) {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords mismatch!");
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (err) {
      console.error("Reg failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Different Animated Food for Register */}
      <div className="absolute top-10 right-10 text-5xl opacity-20 animate-bounce delay-100">🍣</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-pulse delay-200">🍜</div>
      <div className="absolute top-40 left-20 text-5xl opacity-20 animate-bounce delay-500">🍦</div>
      <div className="absolute bottom-10 left-40 text-6xl opacity-20 animate-pulse delay-75">🍩</div>

      <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-white/20 z-10">
        <div className="text-center mb-8">
          <div className="bg-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/50">
            <span className="text-white text-3xl font-black italic">C</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Join Culinaria</h1>
          <p className="text-slate-400 mt-2 font-medium">Start your culinary journey today</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-teal-600/30 active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Already a member?{' '}
            <button 
              onClick={onBack}
              className="text-teal-400 hover:text-teal-300 font-bold underline underline-offset-4"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;