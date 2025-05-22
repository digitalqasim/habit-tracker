import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.resolve(process.cwd(), 'lib/data.json');

async function readData() {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { users: [], habits: [] };
  }
}

async function writeData(data: any) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function getUserByEmail(email: string) {
  const data = await readData();
  return data.users.find((u: any) => u.email === email) || null;
}

export async function addUser(user: { email: string; password: string }) {
  const data = await readData();
  data.users.push(user);
  await writeData(data);
}

export async function getHabits() {
  const data = await readData();
  return data.habits;
}

export async function addHabit(habit: any) {
  const data = await readData();
  data.habits.push(habit);
  await writeData(data);
} 