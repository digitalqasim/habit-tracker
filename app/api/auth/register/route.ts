import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Insert new user
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: hashedPassword }])
    .select('id')
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, id: data.id });
} 