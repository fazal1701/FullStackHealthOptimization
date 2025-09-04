"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HealthRecommendations } from "./health-recommendations"
import { User, Heart, Activity, Moon, Dumbbell, TrendingUp, CheckCircle, Upload, Brain } from "lucide-react"

interface HealthData {
  age: number
  weight: number
  vo2max: number
  restingHR: number
  sleepHours: number
  exerciseFreq: number
}

export function ProfileSection() {
  const [healthData, setHealthData] = useState<HealthData>({
    age: 0,
    weight: 0,
    vo2max: 0,
    restingHR: 0,
    sleepHours: 0,
    exerciseFreq: 0,
  })

  const [showResults, setShowResults] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([])

  const handleInputChange = (field: keyof HealthData, value: string) => {
    setHealthData((prev) => ({
      ...prev,
      [field]: Number.parseFloat(value) || 0,
    }))
  }

  const generateInsights = () => {
    setShowResults(true)
  }

  const loadMockData = () => {
    const mockData = [
      { date: "2024-01-01", vo2max: 45, restingHR: 65, sleepHours: 7.5, weight: 75 },
      { date: "2024-02-01", vo2max: 47, restingHR: 63, sleepHours: 8.0, weight: 74 },
      { date: "2024-03-01", vo2max: 49, restingHR: 61, sleepHours: 8.2, weight: 73 },
    ]
    setCsvData(mockData)
    setHealthData({
      age: 35,
      weight: 73,
      vo2max: 49,
      restingHR: 61,
      sleepHours: 8.2,
      exerciseFreq: 5,
    })
    setShowResults(true)
  }

  const calculateHealthScore = () => {
    const { age, vo2max, restingHR, sleepHours, exerciseFreq } = healthData

    // Age-adjusted VO2max scoring
    const expectedVO2 = age < 30 ? 50 : age < 40 ? 45 : age < 50 ? 40 : 35
    const vo2Score = Math.min(100, (vo2max / expectedVO2) * 100)

    // Resting HR scoring (lower is better)
    const hrScore = Math.max(0, 100 - (restingHR - 50) * 2)

    // Sleep scoring
    const sleepScore = sleepHours >= 7 && sleepHours <= 9 ? 100 : Math.max(0, 100 - Math.abs(sleepHours - 8) * 20)

    // Exercise frequency scoring
    const exerciseScore = Math.min(100, (exerciseFreq / 5) * 100)

    return Math.round((vo2Score + hrScore + sleepScore + exerciseScore) / 4)
  }

  const getPredictions = () => {
    const score = calculateHealthScore()
    const biologicalAge = Math.max(18, healthData.age - (score - 70) * 0.2)
    const lifeExpectancy = 78 + (score - 70) * 0.15

    return {
      biologicalAge: Math.round(biologicalAge),
      lifeExpectancy: Math.round(lifeExpectancy),
      cardiovascularRisk: score > 80 ? "Low" : score > 60 ? "Moderate" : "High",
      metabolicHealth: score > 75 ? "Excellent" : score > 60 ? "Good" : "Needs Improvement",
    }
  }

  return (
    <section id="profile" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 px-4 py-2 bg-emerald-100 text-emerald-800 border-emerald-200">
            <User className="w-4 h-4 mr-2" />
            Your Health Profile
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-slate-900">
            Start Your Longevity Journey
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Input your health data to receive personalized longevity predictions and evidence-based recommendations powered by
            LongevityLab AI and deployed through our healthcare-grade infrastructure.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="p-8 bg-white shadow-xl border-0">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 text-emerald-600 mr-3" />
              <h3 className="text-2xl font-semibold text-slate-900">Health Data Input</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="text-slate-700 font-medium">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="35"
                    value={healthData.age || ""}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-slate-700 font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={healthData.weight || ""}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vo2max" className="text-slate-700 font-medium flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    VO₂ Max
                  </Label>
                  <Input
                    id="vo2max"
                    type="number"
                    placeholder="45"
                    value={healthData.vo2max || ""}
                    onChange={(e) => handleInputChange("vo2max", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="restingHR" className="text-slate-700 font-medium flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    Resting HR
                  </Label>
                  <Input
                    id="restingHR"
                    type="number"
                    placeholder="60"
                    value={healthData.restingHR || ""}
                    onChange={(e) => handleInputChange("restingHR", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sleepHours" className="text-slate-700 font-medium flex items-center">
                    <Moon className="w-4 h-4 mr-1" />
                    Sleep Hours
                  </Label>
                  <Input
                    id="sleepHours"
                    type="number"
                    step="0.1"
                    placeholder="8.0"
                    value={healthData.sleepHours || ""}
                    onChange={(e) => handleInputChange("sleepHours", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseFreq" className="text-slate-700 font-medium flex items-center">
                    <Dumbbell className="w-4 h-4 mr-1" />
                    Exercise/Week
                  </Label>
                  <Input
                    id="exerciseFreq"
                    type="number"
                    placeholder="4"
                    value={healthData.exerciseFreq || ""}
                    onChange={(e) => handleInputChange("exerciseFreq", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={generateInsights}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate AI Insights
                </Button>
                <Button
                  variant="outline"
                  onClick={loadMockData}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Load Demo Data
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-8 bg-white shadow-xl border-0">
            {showResults ? (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-slate-900">Your Health Predictions</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-700">Overall Health Score</span>
                      <Badge className="bg-emerald-100 text-emerald-800">{calculateHealthScore()}/100</Badge>
                    </div>
                    <Progress value={calculateHealthScore()} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Biological Age</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{getPredictions().biologicalAge}</p>
                      <p className="text-xs text-slate-500">vs chronological {healthData.age}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Life Expectancy</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{getPredictions().lifeExpectancy}</p>
                      <p className="text-xs text-slate-500">years projected</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Cardiovascular Risk</span>
                      <Badge variant={getPredictions().cardiovascularRisk === "Low" ? "default" : "destructive"}>
                        {getPredictions().cardiovascularRisk}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">Metabolic Health</span>
                      <Badge variant={getPredictions().metabolicHealth === "Excellent" ? "default" : "secondary"}>
                        {getPredictions().metabolicHealth}
                      </Badge>
                    </div>
                  </div>

                  {csvData.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Longitudinal Analysis</h4>
                      <p className="text-sm text-blue-700">
                        Based on {csvData.length} months of data, your VO₂max improved by{" "}
                        {Math.round(
                          ((csvData[csvData.length - 1]?.vo2max - csvData[0]?.vo2max) / csvData[0]?.vo2max) * 100,
                        )}
                        %
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Ready for Analysis</h3>
                <p className="text-slate-500">
                  Enter your health data or load demo data to see personalized predictions and recommendations.
                </p>
              </div>
            )}
          </Card>
        </div>

        {showResults && (
          <div className="mt-12">
            <HealthRecommendations healthData={healthData} />
          </div>
        )}
      </div>
    </section>
  )
}
