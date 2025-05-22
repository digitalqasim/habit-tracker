export async function register(email: string, password: string) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getHabits(userId?: string) {
  const url = userId ? `/api/habits?user_id=${userId}` : '/api/habits';
  const res = await fetch(url);
  return res.json();
}

export async function addHabit(habit: any) {
  const res = await fetch('/api/habits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit)
  });
  return res.json();
}

export async function updateHabit(id: string, updates: any) {
  const res = await fetch(`/api/habits/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function deleteHabit(id: string) {
  const res = await fetch(`/api/habits/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

// You can add removeHabit, updateHabit, etc. as needed 