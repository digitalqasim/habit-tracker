"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { testSupabaseConnection } from "@/lib/supabase";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  // Test Supabase connection on component mount
  useState(() => {
    testSupabaseConnection().then(isConnected => {
      if (!isConnected) {
        toast.error('Unable to connect to authentication service');
      }
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'reset') {
        // TODO: Implement password reset
        toast.success('If your email exists, a reset link will be sent.');
        return;
      }

      console.log(`Attempting to ${mode} with email:`, email);
      const fn = mode === 'login' ? login : register;
      const res = await fn(email, password);
      
      if (res.error) {
        console.error(`${mode} error:`, res.error);
        toast.error(typeof res.error === 'string' ? res.error : 'Authentication failed');
      } else {
        console.log(`${mode} successful:`, res);
        toast.success(mode === 'login' ? 'Logged in!' : 'Registered!');
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password'}</CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Enter your credentials to access your account'
              : mode === 'register'
              ? 'Create a new account'
              : 'Enter your email to reset your password'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={6}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password'}
            </Button>
            <div className="text-sm text-center space-y-2">
              {mode === 'login' ? (
                <>
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setMode('register')}
                    >
                      Register
                    </button>
                  </p>
                  <p>
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setMode('reset')}
                    >
                      Forgot password?
                    </button>
                  </p>
                </>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setMode('login')}
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
export default AuthForm; 