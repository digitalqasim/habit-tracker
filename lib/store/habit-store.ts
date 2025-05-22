import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { type StateCreator } from 'zustand';
import { differenceInDays, isSameDay, parseISO, format } from 'date-fns';
import { getHabits as apiGetHabits, addHabit as apiAddHabit, updateHabit as apiUpdateHabit, deleteHabit as apiDeleteHabit } from '../api';
import { useAuthStore } from './auth-store';

export type Habit = {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  icon: string;
  color: string;
  created: Date;
  streak: number;
  longestStreak: number;
  completedDates: string[]; // ISO date strings
  lastUpdated?: string; // Track when the habit was last updated
};

export type HabitStats = {
  totalHabits: number;
  completedToday: number;
  currentStreaks: { habitId: string; streak: number }[];
  mostConsistent: string | null; // ID of the habit with the highest streak
};

export type HabitSuggestion = {
  id: string;
  text: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'skills';
};

export type HabitState = {
  habits: Habit[];
  suggestions: HabitSuggestion[];
  quotes: { text: string; author: string }[];
  notifications: { id: string; message: string; read: boolean; date: string }[];
  userPreferences: {
    reminderTime?: string; // Time of day for reminders (HH:MM format)
    theme?: 'light' | 'dark' | 'system';
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 is Sunday, 1 is Monday, etc.
    showCompletedHabits?: boolean;
  };
  // Actions
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'created' | 'streak' | 'completedDates' | 'longestStreak'>) => Promise<void>;
  editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  removeHabit: (id: string) => void;
  completeHabit: (id: string, date: string) => void;
  uncompleteHabit: (id: string, date: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  getRandomQuote: () => { text: string; author: string } | null;
  getSuggestionsByCategory: (category: string) => HabitSuggestion[];
  updateUserPreferences: (preferences: Partial<HabitState['userPreferences']>) => void;
  getHabitStats: () => HabitStats;
  exportUserData: () => string;
  importUserData: (jsonData: string) => boolean;
};

// Initial quotes
const initialQuotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small changes eventually add up to huge results.", author: "Unknown" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "You'll never change your life until you change something you do daily.", author: "John C. Maxwell" },
  { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Your daily habits define your future.", author: "Unknown" }
];

// Initial habit suggestions
const initialSuggestions: HabitSuggestion[] = [
  { id: '1', text: 'Drink 8 glasses of water', category: 'health' },
  { id: '2', text: 'Meditate for 10 minutes', category: 'mindfulness' },
  { id: '3', text: 'Read for 30 minutes', category: 'skills' },
  { id: '4', text: 'Exercise for 30 minutes', category: 'health' },
  { id: '5', text: 'Write in a journal', category: 'mindfulness' },
  { id: '6', text: 'Practice a language for 15 minutes', category: 'skills' },
  { id: '7', text: 'Call a friend or family member', category: 'social' },
  { id: '8', text: 'Plan your day each morning', category: 'productivity' },
  { id: '9', text: 'Take a walk outside', category: 'health' },
  { id: '10', text: 'Practice gratitude', category: 'mindfulness' },
  { id: '11', text: 'Learn something new', category: 'skills' },
  { id: '12', text: 'Clean for 15 minutes', category: 'productivity' },
  { id: '13', text: 'Stretch for 10 minutes', category: 'health' },
  { id: '14', text: 'Cook a healthy meal', category: 'health' },
  { id: '15', text: 'Limit social media to 30 minutes', category: 'productivity' },
  { id: '16', text: 'Drink green tea instead of coffee', category: 'health' },
  { id: '17', text: 'Practice deep breathing for 5 minutes', category: 'mindfulness' },
  { id: '18', text: 'Learn 3 new vocabulary words', category: 'skills' },
  { id: '19', text: 'Send a thank you message', category: 'social' },
  { id: '20', text: 'Set 3 priorities for the day', category: 'productivity' },
];

// Helper function to calculate streak based on completed dates
const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  // Sort dates in ascending order
  const sortedDates = [...completedDates].sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  const today = new Date();
  let currentStreak = 0;
  let previousDate: Date | null = null;
  
  // Check if the most recent date is today or yesterday
  const mostRecentDate = parseISO(sortedDates[sortedDates.length - 1]);
  const isRecentEnough = isSameDay(mostRecentDate, today) || 
                         differenceInDays(today, mostRecentDate) <= 1;
  
  if (!isRecentEnough) return 0;
  
  // Count consecutive days
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const currentDate = parseISO(sortedDates[i]);
    
    if (previousDate === null) {
      currentStreak = 1;
      previousDate = currentDate;
      continue;
    }
    
    const dayDifference = differenceInDays(previousDate, currentDate);
    
    if (dayDifference <= 1) {
      currentStreak += 1;
      previousDate = currentDate;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

// Using any to bypass complex type issues with Zustand middleware combinations
export const useHabitStore = create<HabitState>(
  (persist as any)(
    (immer as any)((set: (fn: (state: HabitState) => void) => void, get: () => HabitState) => ({
      habits: [],
      suggestions: initialSuggestions,
      quotes: initialQuotes,
      notifications: [],
      userPreferences: {
        theme: 'system',
        weekStartsOn: 1, // Monday
        showCompletedHabits: true,
      },

      fetchHabits: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        const habits = await apiGetHabits(user.id);
        set((state: HabitState) => { state.habits = habits; });
      },

      addHabit: async (habitData: Omit<Habit, 'id' | 'created' | 'streak' | 'completedDates' | 'longestStreak'>) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        await apiAddHabit({ ...habitData, user_id: user.id });
        await get().fetchHabits();
      },

      editHabit: async (id: string, updates: Partial<Habit>) => {
        await apiUpdateHabit(id, updates);
        await get().fetchHabits();
      },

      deleteHabit: async (id: string) => {
        await apiDeleteHabit(id);
        await get().fetchHabits();
      },

      removeHabit: (id: string) => { get().deleteHabit(id); },

      completeHabit: (id: string, date: string) => set((state: HabitState) => {
        const habit = state.habits.find((h: Habit) => h.id === id);
        if (habit) {
          // Add the date if not already completed
          if (!habit.completedDates.includes(date)) {
            habit.completedDates.push(date);
            habit.lastUpdated = new Date().toISOString();
            
            // Calculate streak using our helper function
            const newStreak = calculateStreak(habit.completedDates);
            habit.streak = newStreak;
            
            // Update longest streak if needed
            if (newStreak > (habit.longestStreak || 0)) {
              habit.longestStreak = newStreak;
            }
            
            console.log(`Completed habit: ${habit.name} on ${date}. New streak: ${habit.streak}`);
            
            // Add milestone notifications
            if (habit.streak === 7) {
              state.notifications.push({
                id: crypto.randomUUID(),
                message: `🔥 1 week streak for "${habit.name}"! Keep it up!`,
                read: false,
                date: new Date().toISOString()
              });
            } else if (habit.streak === 30) {
              state.notifications.push({
                id: crypto.randomUUID(),
                message: `🎉 Amazing! 30 day streak for "${habit.name}"!`,
                read: false,
                date: new Date().toISOString()
              });
            } else if (habit.streak % 100 === 0) {
              state.notifications.push({
                id: crypto.randomUUID(),
                message: `🏆 Incredible! ${habit.streak} day streak for "${habit.name}"!`,
                read: false,
                date: new Date().toISOString()
              });
            }
          }
        }
      }),

      uncompleteHabit: (id: string, date: string) => set((state: HabitState) => {
        const habit = state.habits.find((h: Habit) => h.id === id);
        if (habit) {
          // Remove the date
          habit.completedDates = habit.completedDates.filter((d: string) => d !== date);
          habit.lastUpdated = new Date().toISOString();
          
          // Recalculate streak
          habit.streak = calculateStreak(habit.completedDates);
          
          console.log(`Uncompleted habit: ${habit.name} on ${date}. New streak: ${habit.streak}`);
        }
      }),

      markNotificationAsRead: (id: string) => set((state: HabitState) => {
        const notification = state.notifications.find((n: { id: string }) => n.id === id);
        if (notification) {
          notification.read = true;
          console.log(`Marked notification as read: ${notification.message}`);
        }
      }),

      clearNotifications: () => set((state: HabitState) => {
        console.log(`Cleared ${state.notifications.filter((n: { read: boolean }) => n.read).length} read notifications`);
        state.notifications = state.notifications.filter((n: { read: boolean }) => !n.read);
      }),

      getRandomQuote: () => {
        const quotes = get().quotes;
        if (quotes.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
      },

      getSuggestionsByCategory: (category: string) => {
        return get().suggestions.filter((s: HabitSuggestion) => s.category === category);
      },
      
      updateUserPreferences: (preferences: Partial<HabitState['userPreferences']>) => set((state: HabitState) => {
        state.userPreferences = {...state.userPreferences, ...preferences};
        console.log("Updated user preferences:", state.userPreferences);
      }),
      
      getHabitStats: () => {
        const state = get();
        const today = format(new Date(), "yyyy-MM-dd");
        
        const stats: HabitStats = {
          totalHabits: state.habits.length,
          completedToday: state.habits.filter((h: Habit) => h.completedDates.includes(today)).length,
          currentStreaks: state.habits.map((h: Habit) => ({ habitId: h.id, streak: h.streak })),
          mostConsistent: null
        };
        
        // Find habit with highest streak
        const sortedByStreak = [...state.habits].sort((a: Habit, b: Habit) => b.streak - a.streak);
        if (sortedByStreak.length > 0 && sortedByStreak[0].streak > 0) {
          stats.mostConsistent = sortedByStreak[0].id;
        }
        
        console.log("Generated habit stats:", stats);
        return stats;
      },
      
      exportUserData: () => {
        const state = get();
        const exportData = {
          habits: state.habits,
          userPreferences: state.userPreferences,
          exportDate: new Date().toISOString()
        };
        return JSON.stringify(exportData);
      },
      
      importUserData: (jsonData: string) => {
        try {
          const data = JSON.parse(jsonData);
          if (!data.habits || !Array.isArray(data.habits)) {
            console.error("Invalid import data: habits array missing");
            return false;
          }
          
          set((state: HabitState) => {
            state.habits = data.habits;
            if (data.userPreferences) {
              state.userPreferences = {...state.userPreferences, ...data.userPreferences};
            }
          });
          
          console.log(`Successfully imported ${data.habits.length} habits`);
          return true;
        } catch (error) {
          console.error("Failed to import user data:", error);
          return false;
        }
      }
    })),
    {
      name: 'habit-storage',
      version: 1, // Added version for migrations if needed
    }
  )
);
