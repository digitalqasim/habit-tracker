"use client";

import { useHabitStore } from "@/lib/store/habit-store";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

export function QuoteCard() {
  const getRandomQuote = useHabitStore((state) => state.getRandomQuote);
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    // Get a random quote when component mounts
    setQuote(getRandomQuote());
  }, [getRandomQuote]);

  if (!quote) return null;

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-habit-primary/10 to-habit-secondary/10">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <QuoteIcon className="h-8 w-8 shrink-0 text-habit-primary" />
          <div>
            <p className="text-lg font-medium italic">"{quote.text}"</p>
            <p className="mt-2 text-sm text-muted-foreground">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
