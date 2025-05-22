"use client";

import { Bell, Moon, Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useHabitStore } from "@/lib/store/habit-store";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export function Navbar({ onAddHabit }: { onAddHabit: () => void }) {
  const { theme, setTheme } = useTheme();
  const notifications = useHabitStore((state) => state.notifications);
  const markNotificationAsRead = useHabitStore(
    (state) => state.markNotificationAsRead
  );
  const clearNotifications = useHabitStore(
    (state) => state.clearNotifications
  );
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-habit-primary text-white">
          <span className="text-xl font-bold">H</span>
        </div>
        <h1 className="text-xl font-bold">HabitTracker</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative rounded-full">
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-habit-primary p-0 text-xs text-white"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2">
              <h3 className="font-medium">Notifications</h3>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="h-auto text-xs"
                >
                  Clear read
                </Button>
              )}
            </div>
            <Separator />
            <div className="max-h-80 overflow-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`flex cursor-pointer flex-col items-start p-3 ${notification.read ? "opacity-60" : ""}`}
                  >
                    <div className="text-sm">{notification.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(notification.date).toLocaleString()}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onAddHabit} className="rounded-full bg-habit-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>
    </div>
  );
}
