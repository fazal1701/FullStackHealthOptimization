"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface HealthData {
  age: number
  vo2max: number
  restingHR: number
  sleepHours: number
  exerciseFreq: number
  weight: number
}

interface HealthRecommendationsProps {
  data?: HealthData // Made data prop optional
}

export function HealthRecommendations({ data }: HealthRecommendationsProps) {
  if (!data) {
    return (
      <Card className="border-muted">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Enter your health data above to see personalized recommendations and predictions.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate health scores and recommendations
  const calculateHealthScore = (data: HealthData) => {
    const score = 100

    // VO2 Max assessment (age-adjusted)
    const expectedVO2 = data.age < 30 ? 45 : data.age < 40 ? 40 : data.age < 50 ? 35 : 30
    const vo2Score = Math.min(100, (data.vo2max / expectedVO2) * 100)

    // Resting HR assessment
    const hrScore = data.restingHR < 60 ? 100 : data.restingHR < 70 ? 80 : data.restingHR < 80 ? 60 : 40

    // Sleep assessment
    const sleepScore =
      data.sleepHours >= 7 && data.sleepHours <= 9 ? 100 : data.sleepHours >= 6 && data.sleepHours <= 10 ? 80 : 60

    // Exercise frequency
    const exerciseScore = data.exerciseFreq >= 5 ? 100 : data.exerciseFreq >= 3 ? 80 : data.exerciseFreq >= 1 ? 60 : 20

    return {
      overall: Math.round((vo2Score + hrScore + sleepScore + exerciseScore) / 4),
      vo2: Math.round(vo2Score),
      heartRate: Math.round(hrScore),
      sleep: Math.round(sleepScore),
      exercise: Math.round(exerciseScore),
    }
  }

  const scores = calculateHealthScore(data)

  const getRecommendations = () => {
    const recommendations = []

    if (scores.vo2 < 80) {
      recommendations.push({
        type: "critical",
        title: "Improve Cardiovascular Fitness",
        description: `Your VO₂ max of ${data.vo2max} ml/kg/min is below optimal. Target: ${data.age < 30 ? "45+" : data.age < 40 ? "40+" : data.age < 50 ? "35+" : "30+"} ml/kg/min`,
        action: "Add 2-3 Zone 2 cardio sessions (180-age heart rate) for 45-60 minutes weekly",
        impact: "Could increase lifespan by 2-4 years",
      })
    }

    if (scores.heartRate < 80) {
      recommendations.push({
        type: "warning",
        title: "Optimize Resting Heart Rate",
        description: `Resting HR of ${data.restingHR} bpm is elevated. Target: <60 bpm`,
        action: "Increase aerobic base training and consider stress management techniques",
        impact: "Each 10 bpm reduction correlates with 16% lower mortality risk",
      })
    }

    if (scores.sleep < 80) {
      recommendations.push({
        type: "warning",
        title: "Optimize Sleep Duration",
        description: `${data.sleepHours} hours is suboptimal. Target: 7-9 hours nightly`,
        action: "Establish consistent sleep schedule, optimize sleep environment (cool, dark, quiet)",
        impact: "Proper sleep reduces disease risk by 20-30%",
      })
    }

    if (scores.exercise < 80) {
      recommendations.push({
        type: "critical",
        title: "Increase Exercise Frequency",
        description: `${data.exerciseFreq} sessions/week is insufficient. Target: 4-6 sessions`,
        action: "Add resistance training 2x/week + cardio 3-4x/week (Zone 2 + VO₂ max work)",
        impact: "Regular exercise reduces all-cause mortality by 30-35%",
      })
    }

    return recommendations
  }

  const recommendations = getRecommendations()

  const predictedOutcomes = {
    biologicalAge: Math.max(data.age - 10, data.age - Math.round(scores.overall / 10)),
    lifeExpectancy: 78 + Math.round((scores.overall - 50) / 10),
    diseaseRisk: Math.max(5, 40 - Math.round(scores.overall / 3)),
  }

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Health Score: {scores.overall}/100
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{scores.vo2}</div>
              <div className="text-sm text-muted-foreground">VO₂ Max</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{scores.heartRate}</div>
              <div className="text-sm text-muted-foreground">Heart Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-3">{scores.sleep}</div>
              <div className="text-sm text-muted-foreground">Sleep</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-4">{scores.exercise}</div>
              <div className="text-sm text-muted-foreground">Exercise</div>
            </div>
          </div>
          <Progress value={scores.overall} className="h-3" />
        </CardContent>
      </Card>

      {/* Predicted Outcomes */}
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Predicted Health Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-3xl font-bold text-primary">{predictedOutcomes.biologicalAge}</div>
              <div className="text-sm text-muted-foreground">Biological Age</div>
              <div className="text-xs text-primary mt-1">
                {predictedOutcomes.biologicalAge < data.age
                  ? `${data.age - predictedOutcomes.biologicalAge} years younger`
                  : "At chronological age"}
              </div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg">
              <div className="text-3xl font-bold text-accent">{predictedOutcomes.lifeExpectancy}</div>
              <div className="text-sm text-muted-foreground">Life Expectancy</div>
              <div className="text-xs text-accent mt-1">
                {predictedOutcomes.lifeExpectancy > 78
                  ? `+${predictedOutcomes.lifeExpectancy - 78} years`
                  : "Below average"}
              </div>
            </div>
            <div className="text-center p-4 bg-chart-5/5 rounded-lg">
              <div className="text-3xl font-bold text-chart-5">{predictedOutcomes.diseaseRisk}%</div>
              <div className="text-sm text-muted-foreground">Disease Risk</div>
              <div className="text-xs text-chart-5 mt-1">
                {predictedOutcomes.diseaseRisk < 20
                  ? "Low risk"
                  : predictedOutcomes.diseaseRisk < 30
                    ? "Moderate risk"
                    : "High risk"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
        {recommendations.map((rec, index) => (
          <Card
            key={index}
            className={`border-l-4 ${
              rec.type === "critical"
                ? "border-l-chart-5"
                : rec.type === "warning"
                  ? "border-l-chart-4"
                  : "border-l-primary"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {rec.type === "critical" ? (
                    <AlertTriangle className="h-5 w-5 text-chart-5" />
                  ) : rec.type === "warning" ? (
                    <TrendingDown className="h-5 w-5 text-chart-4" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                  {rec.title}
                </CardTitle>
                <Badge
                  variant={rec.type === "critical" ? "destructive" : rec.type === "warning" ? "secondary" : "default"}
                >
                  {rec.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">{rec.description}</p>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-medium text-sm">Action Plan:</p>
                <p className="text-sm">{rec.action}</p>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="font-medium text-sm text-primary">Expected Impact:</p>
                <p className="text-sm text-primary">{rec.impact}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
