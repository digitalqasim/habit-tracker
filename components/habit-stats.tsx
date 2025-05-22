"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHabitStore, type HabitStats } from "@/lib/store/habit-store";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, CheckCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function HabitStatsCard() {
  const getHabitStats = useHabitStore((state) => state.getHabitStats);
  const habits = useHabitStore((state) => state.habits);
  const [stats, setStats] = useState<HabitStats | null>(null);

  useEffect(() => {
    const updateStats = () => {
      const currentStats = getHabitStats();
      setStats(currentStats);
      console.log("Updated habit stats:", currentStats);
    };

    updateStats();
    // This will re-fetch stats whenever habits change
    // In a real app, consider adding a debounce
  }, [habits, getHabitStats]);

  if (!stats) return null;

  // Calculate completion rate for today
  const completionRate = stats.totalHabits > 0 
    ? Math.round((stats.completedToday / stats.totalHabits) * 100) 
    : 0;
    
  // Find the habit with the highest streak
  const topStreak = stats.currentStreaks.length > 0
    ? Math.max(...stats.currentStreaks.map(s => s.streak))
    : 0;
    
  // Get the name of the most consistent habit
  const mostConsistentHabit = stats.mostConsistent 
    ? habits.find(h => h.id === stats.mostConsistent)?.name || 'None'
    : 'None';

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-habit-primary/5 via-habit-secondary/5 to-habit-accent/5">
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-habit-primary" />
          <span className="gradient-text font-bold">Your Habit Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-habit-primary/10 to-habit-primary/5">
            <Calendar className="h-8 w-8 text-habit-primary mb-1" />
            <div className="text-center">
              <div className="text-2xl font-bold text-habit-primary">{stats.totalHabits}</div>
              <div className="text-xs text-muted-foreground">Total Habits</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-habit-secondary/10 to-habit-secondary/5">
            <CheckCircle className="h-8 w-8 text-habit-secondary mb-1" />
            <div className="text-center">
              <div className="text-2xl font-bold text-habit-secondary">{stats.completedToday}</div>
              <div className="text-xs text-muted-foreground">Completed Today</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Today's Progress</span>
              <Badge variant="outline" className="font-mono">{completionRate}%</Badge>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between rounded-lg border p-3 bg-gradient-to-r from-habit-accent/10 to-transparent">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-habit-accent" />
              <div>
                <div className="text-sm font-medium">Top Streak</div>
                <div className="text-xs text-muted-foreground">Most consistent habit</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{topStreak} days</div>
              <div className="text-xs truncate max-w-[120px]" title={mostConsistentHabit}>
                {mostConsistentHabit}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}