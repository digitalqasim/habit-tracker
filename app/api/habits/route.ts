import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  let query = supabase.from('habits').select('*');
  if (user_id) query = query.eq('user_id', user_id);
  const { data: habits, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(habits);
}

export async function POST(request: Request) {
  const habit = await request.json();
  if (!habit.user_id) {
    return NextResponse.json({ error: 'user_id required' }, { status: 400 });
  }
  const { error } = await supabase
    .from('habits')
    .insert([habit]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 