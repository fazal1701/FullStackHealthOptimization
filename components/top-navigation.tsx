"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Activity, Brain, Heart, Menu, Stethoscope, TrendingUp, User, Zap, Upload, FileText } from "lucide-react"
import { HealthRecommendations } from "./health-recommendations"

interface UserProfile {
  age: string
  weight: string
  vo2max: string
  restingHR: string
  sleepHours: string
  exerciseFreq: string
}

interface HealthData {
  date: string
  age: number
  weight: number
  vo2max: number
  restingHR: number
  sleepHours: number
  exerciseFreq: number
  bloodPressure: string
  cholesterol: number
  glucose: number
}

const mockHealthData: HealthData[] = [
  {
    date: "2024-01-15",
    age: 35,
    weight: 75,
    vo2max: 42,
    restingHR: 65,
    sleepHours: 7.2,
    exerciseFreq: 4,
    bloodPressure: "120/80",
    cholesterol: 180,
    glucose: 95,
  },
  {
    date: "2024-02-15",
    age: 35,
    weight: 74,
    vo2max: 44,
    restingHR: 63,
    sleepHours: 7.5,
    exerciseFreq: 5,
    bloodPressure: "118/78",
    cholesterol: 175,
    glucose: 92,
  },
  {
    date: "2024-03-15",
    age: 35,
    weight: 73,
    vo2max: 46,
    restingHR: 61,
    sleepHours: 7.8,
    exerciseFreq: 5,
    bloodPressure: "115/75",
    cholesterol: 170,
    glucose: 90,
  },
]

export function TopNavigation() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: "",
    weight: "",
    vo2max: "",
    restingHR: "",
    sleepHours: "",
    exerciseFreq: "",
  })

  const [insights, setInsights] = useState<string[]>([])
  const [csvData, setCsvData] = useState<HealthData[]>([])
  const [predictions, setPredictions] = useState<string[]>([])
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const generateInsights = () => {
    const newInsights: string[] = []
    const age = Number.parseInt(userProfile.age)
    const vo2 = Number.parseInt(userProfile.vo2max)
    const rhr = Number.parseInt(userProfile.restingHR)
    const sleep = Number.parseFloat(userProfile.sleepHours)
    const exercise = Number.parseInt(userProfile.exerciseFreq)

    if (age && age > 40 && vo2 && vo2 < 35) {
      newInsights.push("⚠️ VO₂max below optimal for age group. Consider Zone 2 cardio training.")
    }
    if (rhr && rhr > 70) {
      newInsights.push("💓 Elevated resting HR detected. Focus on cardiovascular fitness.")
    }
    if (sleep && sleep < 7) {
      newInsights.push("😴 Sleep duration suboptimal. Aim for 7-9 hours for longevity.")
    }
    if (age && vo2 && age < 50 && vo2 > 45) {
      newInsights.push("🎯 Excellent cardiovascular fitness! Maintain current training.")
    }
    if (exercise && exercise < 3) {
      newInsights.push("🏃‍♂️ Exercise frequency below recommended. Aim for 4-5 sessions per week.")
    }
    if (vo2 && vo2 > 50) {
      newInsights.push("🌟 Elite VO₂max! You're in the top 10% for cardiovascular fitness.")
    }
    if (sleep && sleep > 8) {
      newInsights.push("😴 Excellent sleep duration! This supports optimal recovery and longevity.")
    }

    // Add default message if no specific insights
    if (newInsights.length === 0) {
      newInsights.push("📊 Your health metrics look good! Check the recommendations tab for optimization tips.")
    }

    setInsights(newInsights)
    setShowRecommendations(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n")
        const headers = lines[0].split(",")

        const data: HealthData[] = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",")
            return {
              date: values[0] || new Date().toISOString().split("T")[0],
              age: Number.parseInt(values[1]) || 0,
              weight: Number.parseFloat(values[2]) || 0,
              vo2max: Number.parseFloat(values[3]) || 0,
              restingHR: Number.parseInt(values[4]) || 0,
              sleepHours: Number.parseFloat(values[5]) || 0,
              exerciseFreq: Number.parseInt(values[6]) || 0,
              bloodPressure: values[7] || "120/80",
              cholesterol: Number.parseInt(values[8]) || 0,
              glucose: Number.parseInt(values[9]) || 0,
            }
          })
          .filter((item) => item.age > 0)

        setCsvData(data)
        generatePredictions(data)
        setShowRecommendations(true)
      }
      reader.readAsText(file)
    }
  }

  const loadMockData = () => {
    setCsvData(mockHealthData)
    setIsUsingMockData(true)
    generatePredictions(mockHealthData)
    setShowRecommendations(true)
  }

  const generatePredictions = (data: HealthData[]) => {
    if (data.length === 0) return

    const latest = data[data.length - 1]
    const newPredictions: string[] = []

    if (data.length > 1) {
      const previous = data[data.length - 2]
      const vo2Trend = latest.vo2max - previous.vo2max
      const weightTrend = latest.weight - previous.weight
      const hrTrend = latest.restingHR - previous.restingHR

      if (vo2Trend > 0) {
        newPredictions.push("📈 VO₂max improving! Predicted 5-year cardiovascular age: " + (latest.age - 3) + " years")
      }
      if (weightTrend < 0 && latest.exerciseFreq >= 4) {
        newPredictions.push("🎯 Weight loss trend with consistent exercise. Metabolic age improving by 2-4 years")
      }
      if (hrTrend < 0) {
        newPredictions.push(
          "💓 Resting HR decreasing. Cardiovascular efficiency improving - reduced heart disease risk by 15%",
        )
      }
    }

    // Enhanced predictions based on current metrics
    if (latest.vo2max > 40 && latest.sleepHours > 7 && latest.exerciseFreq >= 4) {
      newPredictions.push("🌟 Optimal health trajectory! Predicted longevity increase: 8-12 years above average")
    }

    if (latest.cholesterol < 180 && latest.glucose < 100) {
      newPredictions.push("🩺 Excellent metabolic markers. Diabetes risk: 85% below age-matched peers")
    }

    if (latest.sleepHours > 7.5) {
      newPredictions.push("😴 Optimal sleep duration. Cognitive decline risk reduced by 40% over next decade")
    }

    // Biological age calculation
    let biologicalAge = latest.age
    if (latest.vo2max > 45) biologicalAge -= 5
    if (latest.restingHR < 60) biologicalAge -= 3
    if (latest.sleepHours > 7.5) biologicalAge -= 2
    if (latest.exerciseFreq >= 5) biologicalAge -= 3

    newPredictions.push(
      `🧬 Estimated Biological Age: ${biologicalAge} years (${latest.age - biologicalAge} years younger than chronological age)`,
    )

    // Add specific recommendations
    if (latest.vo2max < 35) {
      newPredictions.push("🎯 To improve: Increase VO₂max to 40+ through Zone 2 cardio (3x/week, 45min)")
    }
    if (latest.restingHR > 65) {
      newPredictions.push("🎯 To improve: Lower resting HR to <60 through consistent aerobic training")
    }

    setPredictions(newPredictions)
  }

  const navItems = [
    { id: "hero", label: "Overview", icon: Activity },
    { id: "concepts", label: "Concepts", icon: Brain },
    { id: "predictors", label: "Predictors", icon: TrendingUp },
    { id: "ml-system", label: "ML System", icon: Zap },
    { id: "longevitylab", label: "LongevityLab", icon: Heart },
    { id: "deploy", label: "Deploy", icon: Stethoscope },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-playfair text-xl font-bold">LongevityLab</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => scrollToSection(item.id)}
              className="flex items-center space-x-1 text-sm font-medium hover:text-emerald-600"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        {/* User Profile & Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* User Profile Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Your Health Profile</SheetTitle>
                <SheetDescription>
                  Input your health data or upload CSV to receive personalized Medicine 3.0 insights
                </SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="input" className="mt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="input">Manual</TabsTrigger>
                  <TabsTrigger value="csv">CSV Data</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="predictions">Predictions</TabsTrigger>
                </TabsList>

                <TabsContent value="input" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        placeholder="35"
                        value={userProfile.age}
                        onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        placeholder="70"
                        value={userProfile.weight}
                        onChange={(e) => setUserProfile({ ...userProfile, weight: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vo2max">VO₂max</Label>
                      <Input
                        id="vo2max"
                        placeholder="45"
                        value={userProfile.vo2max}
                        onChange={(e) => setUserProfile({ ...userProfile, vo2max: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restingHR">Resting HR</Label>
                      <Input
                        id="restingHR"
                        placeholder="60"
                        value={userProfile.restingHR}
                        onChange={(e) => setUserProfile({ ...userProfile, restingHR: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sleepHours">Sleep Hours</Label>
                      <Input
                        id="sleepHours"
                        placeholder="7.5"
                        value={userProfile.sleepHours}
                        onChange={(e) => setUserProfile({ ...userProfile, sleepHours: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exerciseFreq">Exercise/Week</Label>
                      <Input
                        id="exerciseFreq"
                        placeholder="4"
                        value={userProfile.exerciseFreq}
                        onChange={(e) => setUserProfile({ ...userProfile, exerciseFreq: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={generateInsights} className="w-full bg-primary hover:bg-primary/90">
                    Generate AI Insights & Recommendations
                  </Button>
                  {showRecommendations &&
                    userProfile.age &&
                    userProfile.vo2max &&
                    userProfile.restingHR &&
                    userProfile.sleepHours &&
                    userProfile.exerciseFreq && (
                      <div className="mt-6 max-h-96 overflow-y-auto">
                        <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <h4 className="font-semibold text-primary mb-2">Your Health Insights:</h4>
                          <div className="space-y-2">
                            {insights.map((insight, index) => (
                              <p key={index} className="text-sm">
                                {insight}
                              </p>
                            ))}
                          </div>
                        </div>
                        <HealthRecommendations
                          data={{
                            age: Number.parseInt(userProfile.age),
                            vo2max: Number.parseInt(userProfile.vo2max),
                            restingHR: Number.parseInt(userProfile.restingHR),
                            sleepHours: Number.parseFloat(userProfile.sleepHours),
                            exerciseFreq: Number.parseInt(userProfile.exerciseFreq),
                            weight: Number.parseInt(userProfile.weight) || 70,
                          }}
                        />
                      </div>
                    )}
                </TabsContent>

                <TabsContent value="csv" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Upload Health Data</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upload a CSV file with columns: date, age, weight, vo2max, restingHR, sleepHours,
                            exerciseFreq, bloodPressure, cholesterol, glucose
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="csvFile">CSV File</Label>
                          <Input
                            id="csvFile"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="cursor-pointer"
                          />
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Or try with sample data:</p>
                          <Button
                            onClick={loadMockData}
                            variant="outline"
                            className="w-full bg-primary/10 hover:bg-primary/20 border-primary/30"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Load Mock Health Data & Generate Predictions
                          </Button>
                        </div>

                        {csvData.length > 0 && (
                          <div className="mt-4">
                            <Badge
                              variant="secondary"
                              className="w-full justify-center py-2 bg-primary/10 text-primary"
                            >
                              {isUsingMockData ? "Mock Data Loaded" : "CSV Data Loaded"} - {csvData.length} records
                            </Badge>
                            <div className="mt-4 max-h-96 overflow-y-auto">
                              <HealthRecommendations
                                data={{
                                  age: csvData[csvData.length - 1].age,
                                  vo2max: csvData[csvData.length - 1].vo2max,
                                  restingHR: csvData[csvData.length - 1].restingHR,
                                  sleepHours: csvData[csvData.length - 1].sleepHours,
                                  exerciseFreq: csvData[csvData.length - 1].exerciseFreq,
                                  weight: csvData[csvData.length - 1].weight,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                  {insights.length > 0 ? (
                    <div className="space-y-3">
                      {insights.map((insight, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <p className="text-sm">{insight}</p>
                          </CardContent>
                        </Card>
                      ))}
                      <Badge variant="secondary" className="w-full justify-center py-2">
                        Powered by Medicine 3.0 AI
                      </Badge>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Input your health data to receive personalized insights</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="predictions" className="space-y-4">
                  {predictions.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-primary">Health Predictions</h3>
                        <p className="text-sm text-muted-foreground">Based on your longitudinal health data</p>
                      </div>
                      {predictions.map((prediction, index) => (
                        <Card key={index} className="border-primary/20">
                          <CardContent className="p-4">
                            <p className="text-sm font-medium">{prediction}</p>
                          </CardContent>
                        </Card>
                      ))}
                      <Badge variant="secondary" className="w-full justify-center py-2 bg-primary/10 text-primary">
                        Medicine 3.0 Predictive Analytics
                      </Badge>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Upload CSV data to generate health predictions</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => scrollToSection(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
