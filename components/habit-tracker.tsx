'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Flame, 
  Trophy, 
  Star, 
  CheckCircle2, 
  Circle,
  Dumbbell,
  Apple,
  Moon,
  Brain
} from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';

interface HabitCardProps {
  habit: {
    id: string;
    title: string;
    description: string;
    streak: number;
    completed: boolean;
    category: string;
    points: number;
    longevityImpact: string;
  };
  onToggle: (id: string) => void;
}

function HabitCard({ habit, onToggle }: HabitCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movement': return <Dumbbell className="w-4 h-4" />;
      case 'nutrition': return <Apple className="w-4 h-4" />;
      case 'recovery': return <Moon className="w-4 h-4" />;
      case 'mental': return <Brain className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'movement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'nutrition': return 'bg-green-100 text-green-800 border-green-200';
      case 'recovery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mental': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'very_high': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      habit.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={habit.completed}
              onCheckedChange={() => onToggle(habit.id)}
              className="w-5 h-5"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold ${
                habit.completed ? 'text-emerald-800 line-through' : 'text-gray-900'
              }`}>
                {habit.title}
              </h3>
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">{habit.streak}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`${getCategoryColor(habit.category)} border text-xs`}>
                  {getCategoryIcon(habit.category)}
                  <span className="ml-1 capitalize">{habit.category}</span>
                </Badge>
                
                <Badge className={`${getImpactColor(habit.longevityImpact)} border text-xs`}>
                  {habit.longevityImpact.replace('_', ' ')} impact
                </Badge>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">{habit.points}pts</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HabitTracker() {
  const [habits, setHabits] = useState(MOCK_DATA.longevityHabits);
  
  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed }
        : habit
    ));
  };

  const completedHabits = habits.filter(h => h.completed).length;
  const totalPoints = habits.filter(h => h.completed).reduce((sum, h) => sum + h.points, 0);
  const completionPercentage = (completedHabits / habits.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Longevity Habits</h2>
          <p className="text-gray-600">Small wins that compound into extraordinary health</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">{totalPoints}</div>
          <div className="text-sm text-gray-600">points today</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-full">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Today's Progress</h3>
                <p className="text-sm text-gray-600">
                  {completedHabits} of {habits.length} habits completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-600">
                {completionPercentage.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">completion</div>
            </div>
          </div>
          
          <Progress value={completionPercentage} className="h-3" />
          
          {completionPercentage === 100 && (
            <div className="mt-3 p-3 bg-emerald-100 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  Perfect day! You've completed all your longevity habits. 🎉
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Habit Cards */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <HabitCard 
            key={habit.id} 
            habit={habit} 
            onToggle={toggleHabit}
          />
        ))}
      </div>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-sm font-medium text-yellow-800">15-Day Streak</div>
              <div className="text-xs text-yellow-600">Zone 2 Cardio</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl mb-1">💪</div>
              <div className="text-sm font-medium text-blue-800">Strength Master</div>
              <div className="text-xs text-blue-600">30 workouts</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl mb-1">😴</div>
              <div className="text-sm font-medium text-purple-800">Sleep Champion</div>
              <div className="text-xs text-purple-600">7 days optimal</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl mb-1">🥗</div>
              <div className="text-sm font-medium text-green-800">Nutrition Pro</div>
              <div className="text-xs text-green-600">Protein goals</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
