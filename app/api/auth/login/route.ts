import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  // Find user in Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password')
    .eq('email', email)
    .single();
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  // Compare password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  // For demo: just return success (no JWT/session implemented yet)
  return NextResponse.json({ success: true, id: user.id, email });
} 