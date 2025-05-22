import { useAuthStore } from "@/lib/store/auth-store";

export function Navbar({ onAddHabit }: { onAddHabit: () => void }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="...">
      {/* ... existing nav content ... */}
      {user && (
        <button onClick={logout} className="ml-4 px-4 py-2 rounded bg-red-500 text-white">Logout</button>
      )}
    </nav>
  );
} 