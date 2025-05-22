"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabitStore } from "@/lib/store/habit-store";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { motion } from "framer-motion";

type AddHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddHabitDialog({ open, onOpenChange }: AddHabitDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [icon, setIcon] = useState("activity");
  const [color, setColor] = useState("#6366F1"); // Default indigo
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addHabit = useHabitStore((state) => state.addHabit);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      addHabit({
        name,
        description,
        frequency,
        icon,
        color,
      });

      toast.success("Habit added successfully!");
      resetForm();
      setIsSubmitting(false);
      onOpenChange(false);
    }, 400);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setFrequency("daily");
    setIcon("activity");
    setColor("#6366F1");
  };

  const colorOptions = [
    { value: "#6366F1", label: "Indigo" },
    { value: "#10B981", label: "Emerald" },
    { value: "#F59E0B", label: "Amber" },
    { value: "#EF4444", label: "Red" },
    { value: "#8B5CF6", label: "Purple" },
    { value: "#EC4899", label: "Pink" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#14B8A6", label: "Teal" },
    { value: "#84CC16", label: "Lime" },
  ];

  const iconOptions = [
    "activity",
    "award",
    "book",
    "coffee",
    "droplet",
    "dumbbell",
    "flame",
    "heart",
    "music",
    "pencil",
    "zap",
    "brain",
    "code",
    "smile",
    "sun",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">Add New Habit</DialogTitle>
          <DialogDescription>
            Create a new habit to track. Be specific about what you want to
            achieve.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read for 30 minutes"
              className="focus-visible:ring-habit-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this habit important to you?"
              className="focus-visible:ring-habit-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(value) =>
                setFrequency(value as "daily" | "weekly" | "monthly")
              }
            >
              <SelectTrigger className="focus-visible:ring-habit-primary">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1">
                {iconOptions.map((iconName) => {
                  const IconComponent = Icons[iconName];
                  return (
                    <motion.div 
                      key={iconName}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant={icon === iconName ? "default" : "outline"}
                        size="icon"
                        className={`h-8 w-8 ${icon === iconName ? "shadow-md" : ""}`}
                        onClick={() => setIcon(iconName)}
                        style={icon === iconName ? { backgroundColor: color } : {}}
                      >
                        <IconComponent className={`h-4 w-4 ${icon === iconName ? "text-white" : ""}`} />
                      </Button>
                    </motion.div>
                  );
                })}                
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1">
                {colorOptions.map((colorOption) => (
                  <motion.div 
                    key={colorOption.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={`h-8 w-8 ${color === colorOption.value ? "ring-2 ring-offset-2 shadow-md" : ""}`}
                      style={{ 
                        backgroundColor: colorOption.value,
                        borderColor: colorOption.value
                      }}
                      onClick={() => setColor(colorOption.value)}
                    >
                      <span className="sr-only">{colorOption.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-habit-primary to-habit-secondary hover:from-habit-primary/90 hover:to-habit-secondary/90 transition-all duration-300 shadow-md"
          >
            {isSubmitting ? "Adding..." : "Add Habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}