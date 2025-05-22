"use client";

import { Habit, useHabitStore } from "@/lib/store/habit-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Flame, Trophy, Calendar } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function HabitCard({ habit }: { habit: Habit }) {
  const completeHabit = useHabitStore((state) => state.completeHabit);
  const uncompleteHabit = useHabitStore((state) => state.uncompleteHabit);
  const removeHabit = useHabitStore((state) => state.removeHabit);
  const [confetti, setConfetti] = useState(false);
  
  const today = format(new Date(), "yyyy-MM-dd");
  const isCompletedToday = habit.completedDates.includes(today);
  
  const IconComponent = Icons[habit.icon] || Icons.activity;
  
  // Calculate progress percentage (simplified for demo - based on streak)
  let progressGoal = 30; // Default goal
  if (habit.streak > 30) progressGoal = 100;
  if (habit.streak > 100) progressGoal = 365;
  
  const progressPercentage = Math.min(100, (habit.streak / progressGoal) * 100);

  // Get when this habit was last updated
  const lastUpdated = habit.lastUpdated ? 
    formatDistanceToNow(parseISO(habit.lastUpdated), { addSuffix: true }) : 
    'never';

  const handleToggleComplete = () => {
    if (isCompletedToday) {
      uncompleteHabit(habit.id, today);
      toast.info("Habit marked as not completed");
    } else {
      completeHabit(habit.id, today);
      toast.success("Habit completed! Keep it up!");
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    }
  };

  const handleDelete = () => {
    removeHabit(habit.id);
    toast.success("Habit deleted");
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group">
      <CardHeader
        className="flex flex-row items-center justify-between p-4 pb-2 transition-colors duration-300"
        style={{ backgroundColor: habit.color + "15" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: habit.color }}
          >
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium">{habit.name}</h3>
            <div className="flex items-center gap-1.5">
              <Badge 
                variant="outline" 
                className="px-1.5 py-0 text-[10px] h-4 rounded-sm font-normal"
                style={{ borderColor: habit.color + '50' }}
              >
                {habit.frequency}
              </Badge>
              <span className="text-[10px] text-muted-foreground">Updated {lastUpdated}</span>
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-50 hover:opacity-100 hover:text-destructive transition-opacity duration-200"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the habit and all its tracking data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="flex flex-col justify-center rounded-lg p-2 bg-muted/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="h-4 w-4 text-habit-accent" />
              <span className="text-sm font-medium">Current streak</span>
            </div>
            <span className="text-xl font-bold">{habit.streak} <span className="text-xs text-muted-foreground font-normal">days</span></span>
          </div>
          
          <div className="flex flex-col justify-center rounded-lg p-2 bg-muted/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="h-4 w-4 text-habit-secondary" />
              <span className="text-sm font-medium">Best streak</span>
            </div>
            <span className="text-xl font-bold">{habit.longestStreak || 0} <span className="text-xs text-muted-foreground font-normal">days</span></span>
          </div>
        </div>
        
        {habit.description && (
          <p className="mb-3 text-sm text-muted-foreground">{habit.description}</p>
        )}
        
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span>Progress to {progressGoal} days</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2" 
            style={{
              '--progress-background': `${habit.color}30`,
              '--progress-foreground': habit.color
            } as any}
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleToggleComplete}
                variant={isCompletedToday ? "default" : "outline"}
                className={`w-full transition-all duration-300 ${isCompletedToday ? "shadow-md" : ""}`}
                style={isCompletedToday ? 
                  { backgroundColor: habit.color, borderColor: habit.color } : 
                  { borderColor: habit.color, color: habit.color }
                }
              >
                {isCompletedToday ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4" /> Completed Today
                  </>
                ) : (
                  <>
                    <Calendar className="mr-1.5 h-4 w-4" /> Mark Complete
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as {isCompletedToday ? "incomplete" : "complete"} for today</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {confetti && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="animate-confetti-1 absolute left-1/4 top-0 h-8 w-8 rounded-full bg-habit-primary" />
              <div className="animate-confetti-2 absolute left-1/2 top-0 h-6 w-6 rounded-full bg-habit-secondary" />
              <div className="animate-confetti-3 absolute left-3/4 top-0 h-10 w-10 rounded-full bg-habit-accent" />
              <div className="animate-confetti-4 absolute left-1/3 top-0 h-7 w-7 rounded-full bg-habit-primary" />
              <div className="animate-confetti-5 absolute left-2/3 top-0 h-9 w-9 rounded-full bg-habit-secondary" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
