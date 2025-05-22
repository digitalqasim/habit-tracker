"use client";

import { useState } from "react";
import { useHabitStore } from "@/lib/store/habit-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Heart, Zap, Droplet, Music, BookOpen, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type CategoryInfo = {
  icon: React.ReactNode;
  label: string;
  color: string;
  hoverColor: string;
};

export function SuggestionsSection({ onAddCustomHabit }: { onAddCustomHabit: () => void }) {
  const suggestions = useHabitStore((state) => state.suggestions);
  const addHabit = useHabitStore((state) => state.addHabit);
  const [activeCategory, setActiveCategory] = useState("health");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddSuggestion = (text: string) => {
    // Generate a habit from the suggestion
    const icons: Record<string, string> = {
      health: "heart",
      productivity: "zap",
      mindfulness: "droplet",
      social: "music",
      skills: "book",
    };

    const colors: Record<string, string> = {
      health: "#EF4444",      // Red
      productivity: "#6366F1", // Indigo
      mindfulness: "#10B981", // Emerald
      social: "#8B5CF6",      // Purple
      skills: "#F59E0B",      // Amber
    };

    addHabit({
      name: text,
      description: "",
      frequency: "daily",
      icon: icons[activeCategory as keyof typeof icons] || "activity",
      color: colors[activeCategory as keyof typeof colors] || "#6366F1",
    });

    toast.success("Habit added from suggestion!");
  };

  const categoryInfo: Record<string, CategoryInfo> = {
    health: { 
      icon: <Heart className="h-4 w-4" />, 
      label: "Health",
      color: "#EF4444",
      hoverColor: "hover:bg-red-100 dark:hover:bg-red-950/30"
    },
    productivity: { 
      icon: <Zap className="h-4 w-4" />, 
      label: "Work",
      color: "#6366F1",
      hoverColor: "hover:bg-indigo-100 dark:hover:bg-indigo-950/30"
    },
    mindfulness: { 
      icon: <Droplet className="h-4 w-4" />, 
      label: "Mind",
      color: "#10B981",
      hoverColor: "hover:bg-emerald-100 dark:hover:bg-emerald-950/30"
    },
    social: { 
      icon: <Music className="h-4 w-4" />, 
      label: "Social",
      color: "#8B5CF6",
      hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-950/30"
    },
    skills: { 
      icon: <BookOpen className="h-4 w-4" />, 
      label: "Skills",
      color: "#F59E0B",
      hoverColor: "hover:bg-amber-100 dark:hover:bg-amber-950/30"
    },
  };

  const categoryCounts: Record<string, number> = {
    health: suggestions.filter((s) => s.category === "health").length,
    productivity: suggestions.filter((s) => s.category === "productivity").length,
    mindfulness: suggestions.filter((s) => s.category === "mindfulness").length,
    social: suggestions.filter((s) => s.category === "social").length,
    skills: suggestions.filter((s) => s.category === "skills").length,
  };

  // Filter suggestions based on search query
  const filteredSuggestions = suggestions
    .filter((s) => s.category === activeCategory)
    .filter((s) => searchQuery === "" || s.text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3 bg-gradient-to-r from-habit-primary/5 to-habit-secondary/5">
        <CardTitle className="text-xl flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-habit-primary to-habit-secondary font-bold">
            Habit Suggestions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search suggestions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        
        <Tabs defaultValue="health" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6 grid w-full grid-cols-5 gap-2 rounded-lg p-1 bg-muted/40">
            {Object.entries(categoryInfo).map(([key, info]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className={`relative rounded-lg flex flex-col items-center py-3 gap-1.5 ${activeCategory === key ? 'shadow-md' : ''}`}
                style={{ 
                  backgroundColor: activeCategory === key ? `${info.color}15` : '', 
                  borderColor: activeCategory === key ? info.color : 'transparent',
                  borderWidth: activeCategory === key ? '1px' : '0'
                }}
              >
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors" 
                  style={{ 
                    backgroundColor: activeCategory === key ? info.color : 'transparent',
                    color: activeCategory === key ? 'white' : info.color
                  }}
                >
                  {info.icon}
                </div>
                <span className="text-xs font-medium">{info.label}</span>
                <Badge 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                  style={{ backgroundColor: info.color }}
                >
                  {categoryCounts[key as keyof typeof categoryCounts]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(categoryInfo).map((category) => (
            <TabsContent key={category} value={category} className="pt-2">
              {filteredSuggestions.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-1 md:grid-cols-2">
                  {filteredSuggestions.map((suggestion, index) => (
                    <motion.li 
                      key={suggestion.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${categoryInfo[category].hoverColor} transition-all duration-200 hover:shadow-sm`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="flex h-6 w-6 items-center justify-center rounded-full" 
                          style={{ backgroundColor: categoryInfo[category].color }}
                        >
                          {categoryInfo[category].icon}
                        </div>
                        <span className="text-sm font-medium">{suggestion.text}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddSuggestion(suggestion.text)}
                        className="transition-all duration-200"
                        style={{ 
                          borderColor: categoryInfo[category].color,
                          color: categoryInfo[category].color,
                        }}
                      >
                        <PlusCircle className="mr-1 h-4 w-4" />
                        Add
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-muted-foreground mb-2">No suggestions found for your search</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 flex justify-center">
          <Button 
            onClick={onAddCustomHabit} 
            variant="default" 
            className="w-full bg-gradient-to-r from-habit-primary to-habit-secondary hover:from-habit-primary/90 hover:to-habit-secondary/90 transition-all duration-300 shadow-md"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Custom Habit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
