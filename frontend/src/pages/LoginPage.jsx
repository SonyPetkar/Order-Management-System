import { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

function LoginPage({ onForgotPassword, onRegister }) {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // login updates the AuthContext, and AppContent will auto-switch the page
      await login(formData.email, formData.password);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Animated Background Food Icons */}
      <div className="absolute top-10 left-10 text-5xl opacity-20 animate-bounce delay-75">🍕</div>
      <div className="absolute bottom-20 left-20 text-6xl opacity-20 animate-pulse delay-300">🍔</div>
      <div className="absolute top-40 right-20 text-5xl opacity-20 animate-bounce delay-150">🌮</div>
      <div className="absolute bottom-10 right-40 text-6xl opacity-20 animate-pulse delay-500">🥗</div>

      <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md border border-white/20 z-10 transition-all hover:shadow-blue-500/20">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
            <span className="text-white text-3xl font-black italic">C</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2 font-medium">Log in to continue your feast</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 border border-rose-500/20">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 font-bold mb-2 ml-1 text-xs uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-2 ml-1 text-xs uppercase tracking-widest">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Entering Kitchen...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-slate-400 text-sm font-medium">
            New here?{' '}
            <button 
              onClick={onRegister}
              className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4"
            >
              Create Account
            </button>
          </p>
          <button onClick={onForgotPassword} className="text-slate-500 text-xs hover:text-slate-300 transition-colors">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;