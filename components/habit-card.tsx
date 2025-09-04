'use client';

import { Habit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Flame } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise':
        return '🏃‍♀️';
      case 'nutrition':
        return '🥗';
      case 'sleep':
        return '😴';
      case 'stress':
        return '🧘‍♀️';
      case 'medication':
        return '💊';
      default:
        return '⭐';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{getCategoryIcon(habit.category)}</div>
        <div>
          <div className="font-medium text-sm">{habit.name}</div>
          <div className="text-xs text-gray-600">{habit.description}</div>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="h-3 w-3 text-orange-500" />
            <span className="text-xs font-medium text-orange-600">
              {habit.streak} day streak
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={habit.completedToday ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
        >
          {habit.completedToday ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}