"use client";

import { useState, useEffect } from "react";
import { useHabitStore } from "@/lib/store/habit-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { Navbar } from "@/components/navbar";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import { HabitCard } from "@/components/habit-card";
import { QuoteCard } from "@/components/quote-card";
import { SuggestionsSection } from "@/components/suggestions-section";
import { HabitStatsCard } from "@/components/habit-stats";
import { ExportImportData } from "@/components/export-import-data";
import { AuthForm } from "@/components/AuthForm";

export default function Home() {
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const habits = useHabitStore((state) => state.habits);
  const fetchHabits = useHabitStore((state) => state.fetchHabits);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) fetchHabits();
  }, [fetchHabits, user]);

  console.log("Rendering Home page with", habits.length, "habits");

  if (!user) return <AuthForm />;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar onAddHabit={() => setAddHabitOpen(true)} />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Daily motivation */}
          <section className="mb-8">
            <QuoteCard />
          </section>

          {/* Stats and Habits dashboard */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold gradient-text">Your Habits</h2>
              <ExportImportData />
            </div>
            
            {habits.length > 0 ? (
              <div className="grid gap-6">
                {/* Stats card visible only when there are habits */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <HabitStatsCard />
                  </div>
                </div>
                
                {/* Habits grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-gradient-to-r from-muted/30 to-background p-8 text-center shadow-sm">
                <h3 className="mb-2 text-lg font-medium">No habits yet</h3>
                <p className="mb-6 text-sm text-muted-foreground max-w-md">
                  Start by adding a habit to track your progress. Consistent habits are the key to achieving your goals.
                </p>
                <button
                  onClick={() => setAddHabitOpen(true)}
                  className="rounded-full bg-gradient-to-r from-habit-primary to-habit-secondary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:from-habit-primary/90 hover:to-habit-secondary/90 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Add Your First Habit
                </button>
              </div>
            )}
          </section>

          {/* Suggestions */}
          <section className="mb-8">
            <SuggestionsSection onAddCustomHabit={() => setAddHabitOpen(true)} />
          </section>
        </div>
      </main>

      <AddHabitDialog open={addHabitOpen} onOpenChange={setAddHabitOpen} />
    </div>
  );
}
