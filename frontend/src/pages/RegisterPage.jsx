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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Background Kinetic FX */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      
      {/* Animated Floating Food Icons */}
      <div className="absolute top-10 right-[15%] text-5xl opacity-40 animate-bounce delay-100 hidden sm:block">🍣</div>
      <div className="absolute bottom-20 right-[10%] text-6xl opacity-40 animate-pulse delay-200 hidden sm:block">🍜</div>
      <div className="absolute top-40 left-[10%] text-5xl opacity-40 animate-bounce delay-500 hidden sm:block">🍦</div>
      <div className="absolute bottom-10 left-[15%] text-6xl opacity-40 animate-pulse delay-75 hidden sm:block">🍩</div>

      <div className="relative w-full max-w-md group">
        {/* Neon Perimeter Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative bg-black/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 w-full border border-white/10 z-10 transition-all duration-500">
          <div className="text-center mb-10">
            <div className="relative inline-block group-hover:scale-110 transition-transform duration-500">
              <div className="absolute inset-0 bg-teal-400 blur-2xl opacity-20"></div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/40 relative transform -rotate-3 group-hover:rotate-6 transition-all">
                <span className="text-white text-4xl font-black italic tracking-tighter">C</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Join <span className="text-teal-400">Culinaria</span>
            </h1>
            <p className="text-slate-500 mt-2 font-bold text-xs uppercase tracking-widest">
              Start your culinary journey
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-500/20 text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create Password"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-4 text-slate-500 hover:text-teal-400 transition-colors"
              >
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl transition-all duration-500 shadow-xl shadow-teal-900/20 active:scale-[0.98] disabled:opacity-50 mt-4 text-sm uppercase tracking-widest relative overflow-hidden group/btn"
            >
              <span className="relative z-10">{loading ? 'Creating Profile...' : 'Sign Up'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already a member?{' '}
              <button 
                onClick={onBack}
                className="text-teal-400 hover:text-white font-bold underline underline-offset-8 decoration-2 decoration-teal-500/30 hover:decoration-teal-400 transition-all ml-1"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;