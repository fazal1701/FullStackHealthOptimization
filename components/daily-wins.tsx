'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Target, TrendingUp, Award } from 'lucide-react';
import { MOCK_DATA } from '@/lib/mock-data';

interface DailyWin {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  category: 'movement' | 'nutrition' | 'recovery' | 'biomarker';
  impact: 'high' | 'medium' | 'low';
}

const DAILY_WINS: DailyWin[] = [
  {
    id: 'win-1',
    title: 'Zone 2 Cardio Session',
    description: '30 minutes at conversational pace',
    completed: true,
    points: 25,
    category: 'movement',
    impact: 'high'
  },
  {
    id: 'win-2',
    title: 'Protein Target Hit',
    description: '1.6g/kg body weight achieved',
    completed: false,
    points: 20,
    category: 'nutrition',
    impact: 'high'
  },
  {
    id: 'win-3',
    title: 'Sleep Consistency',
    description: 'Bedtime within 30min of target',
    completed: true,
    points: 30,
    category: 'recovery',
    impact: 'high'
  }
];

function WinCard({ win }: { win: DailyWin }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'movement': return 'bg-blue-100 text-blue-700';
      case 'nutrition': return 'bg-green-100 text-green-700';
      case 'recovery': return 'bg-purple-100 text-purple-700';
      case 'biomarker': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-3 w-3" />;
      case 'medium': return <Target className="h-3 w-3" />;
      case 'low': return <Circle className="h-3 w-3" />;
      default: return <Circle className="h-3 w-3" />;
    }
  };

  return (
    <Card className={`transition-all duration-200 ${win.completed ? 'bg-emerald-50 border-emerald-200' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-1">
              {win.completed ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${win.completed ? 'text-emerald-900' : 'text-gray-900'}`}>
                {win.title}
              </h3>
              <p className={`text-sm ${win.completed ? 'text-emerald-700' : 'text-gray-600'}`}>
                {win.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`text-xs ${getCategoryColor(win.category)}`}>
                  {win.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {getImpactIcon(win.impact)}
                  <span>{win.impact} impact</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${win.completed ? 'text-emerald-600' : 'text-gray-500'}`}>
              +{win.points} pts
            </div>
            {!win.completed && (
              <Button size="sm" variant="outline" className="mt-2">
                Mark Done
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyWins() {
  const completedWins = DAILY_WINS.filter(win => win.completed).length;
  const totalPoints = DAILY_WINS.filter(win => win.completed).reduce((sum, win) => sum + win.points, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              Today's Wins
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Small actions, big longevity impact
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{completedWins}/3</div>
            <div className="text-xs text-gray-500">{totalPoints} points</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {DAILY_WINS.map((win) => (
          <WinCard key={win.id} win={win} />
        ))}
        
        {completedWins === 3 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-emerald-900">Perfect Day!</span>
            </div>
            <p className="text-sm text-emerald-700 mt-1">
              You've completed all your longevity wins for today. Keep building those healthy habits!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
