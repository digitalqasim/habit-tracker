"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (mode === 'reset') {
      // TODO: Call password reset API
      setLoading(false);
      toast.success('If your email exists, a reset link will be sent.');
      return;
    }
    const fn = mode === 'login' ? login : register;
    const res = await fn(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      toast.error(res.error);
    } else {
      toast.success(mode === 'login' ? 'Logged in!' : 'Registered!');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-6 bg-card rounded shadow">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">
          {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password'}
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {mode !== 'reset' && (
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-habit-primary to-habit-secondary text-white py-2 rounded mb-2 font-semibold shadow-md hover:from-habit-primary/90 hover:to-habit-secondary/90 transition-all duration-300 disabled:opacity-60"
          disabled={loading}
        >
          {loading
            ? mode === 'login'
              ? 'Logging in...'
              : mode === 'register'
              ? 'Registering...'
              : 'Sending...'
            : mode === 'login'
            ? 'Login'
            : mode === 'register'
            ? 'Register'
            : 'Send Reset Link'}
        </button>
        {mode === 'login' && (
          <button
            type="button"
            className="w-full text-sm text-habit-primary underline mb-2"
            onClick={() => setMode('reset')}
            disabled={loading}
          >
            Forgot password?
          </button>
        )}
        <button
          type="button"
          className="w-full text-sm text-habit-primary underline"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          disabled={loading}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </form>
    </div>
  );
}
export default AuthForm; 