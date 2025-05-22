import { useHabitStore } from "@/lib/store/habit-store";
import { useState } from "react";
import { toast } from "sonner";

export function HabitCard({ habit }: { habit: any }) {
  const editHabit = useHabitStore((s) => s.editHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [desc, setDesc] = useState(habit.description);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteHabit(habit.id);
      toast.success("Habit deleted");
    } catch (e) {
      toast.error("Failed to delete habit");
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await editHabit(habit.id, { name, description: desc });
      toast.success("Habit updated");
      setEditing(false);
    } catch (e) {
      toast.error("Failed to update habit");
    }
    setLoading(false);
  };

  if (editing) {
    return (
      <div className="p-4 border rounded bg-white shadow">
        <input value={name} onChange={e => setName(e.target.value)} className="mb-2 w-full border p-1 rounded" />
        <input value={desc} onChange={e => setDesc(e.target.value)} className="mb-2 w-full border p-1 rounded" />
        <button onClick={handleEdit} disabled={loading} className="mr-2 px-3 py-1 bg-habit-primary text-white rounded disabled:opacity-60">{loading ? 'Saving...' : 'Save'}</button>
        <button onClick={() => setEditing(false)} disabled={loading} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-white shadow flex flex-col gap-2">
      <div className="font-bold text-lg">{habit.name}</div>
      <div className="text-sm text-gray-600">{habit.description}</div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setEditing(true)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
        <button onClick={handleDelete} disabled={loading} className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-60">{loading ? 'Deleting...' : 'Delete'}</button>
      </div>
    </div>
  );
} 