"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Brain,
  Heart,
  Dna,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  User,
  BarChart3,
  Target,
  Zap,
} from "lucide-react"

const navigationItems = [
  { id: "hero", label: "LongevityLab", icon: Sparkles, badge: "Overview" },
  { id: "predictors", label: "Health Predictors", icon: BarChart3, badge: "Biomarkers" },
  { id: "ml-system", label: "ML System", icon: Brain, badge: "AI Engine" },
  { id: "concepts", label: "Core Concepts", icon: TrendingUp, badge: "Theory" },
  { id: "models", label: "Predictive Models", icon: Dna, badge: "AI/ML" },
  { id: "biology", label: "Biology × ML", icon: Activity, badge: "Integration" },
  { id: "longevitylab", label: "LongevityLab AI", icon: Target, badge: "Platform" },
  { id: "deploy", label: "Deploy Healthcare", icon: Shield, badge: "MLOps" },
]

interface UserData {
  age: string
  weight: string
  height: string
  vo2max: string
  restingHR: string
  sleepHours: string
  exerciseFreq: string
}

export function NavigationSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [userData, setUserData] = useState<UserData>({
    age: "",
    weight: "",
    height: "",
    vo2max: "",
    restingHR: "",
    sleepHours: "",
    exerciseFreq: "",
  })
  const [insights, setInsights] = useState<string[]>([])

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const generateInsights = () => {
    const newInsights: string[] = []

    if (userData.age && Number.parseInt(userData.age) > 40) {
      newInsights.push("Focus on VO₂max maintenance - critical for longevity after 40")
    }

    if (userData.vo2max && Number.parseInt(userData.vo2max) < 35) {
      newInsights.push("VO₂max below optimal - prioritize Zone 2 cardio training")
    }

    if (userData.restingHR && Number.parseInt(userData.restingHR) > 70) {
      newInsights.push("Elevated resting HR - consider stress management and cardio")
    }

    if (userData.sleepHours && Number.parseInt(userData.sleepHours) < 7) {
      newInsights.push("Sleep optimization needed - aim for 7-9 hours for recovery")
    }

    if (userData.exerciseFreq && Number.parseInt(userData.exerciseFreq) < 3) {
      newInsights.push("Increase exercise frequency - minimum 3x/week for health benefits")
    }

    setInsights(newInsights)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center pulse-glow">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-sidebar-foreground">Medicine 3.0</h1>
              <p className="text-sm text-muted-foreground">Predictive Health Platform</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <Tabs defaultValue="navigation" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
              <TabsTrigger value="navigation">Navigate</TabsTrigger>
              <TabsTrigger value="profile">Your Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="navigation" className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 h-12 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.label}</div>
                    </div>
                    <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                      {item.badge}
                    </Badge>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Button>
                )
              })}
            </TabsContent>

            <TabsContent value="profile" className="p-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Health Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="age" className="text-xs">
                        Age
                      </Label>
                      <Input
                        id="age"
                        placeholder="35"
                        value={userData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-xs">
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        placeholder="70"
                        value={userData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="height" className="text-xs">
                        Height (cm)
                      </Label>
                      <Input
                        id="height"
                        placeholder="175"
                        value={userData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vo2max" className="text-xs">
                        VO₂max
                      </Label>
                      <Input
                        id="vo2max"
                        placeholder="45"
                        value={userData.vo2max}
                        onChange={(e) => handleInputChange("vo2max", e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="restingHR" className="text-xs">
                        Resting HR
                      </Label>
                      <Input
                        id="restingHR"
                        placeholder="65"
                        value={userData.restingHR}
                        onChange={(e) => handleInputChange("restingHR", e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sleepHours" className="text-xs">
                        Sleep (hrs)
                      </Label>
                      <Input
                        id="sleepHours"
                        placeholder="8"
                        value={userData.sleepHours}
                        onChange={(e) => handleInputChange("sleepHours", e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exerciseFreq" className="text-xs">
                      Exercise/week
                    </Label>
                    <Input
                      id="exerciseFreq"
                      placeholder="4"
                      value={userData.exerciseFreq}
                      onChange={(e) => handleInputChange("exerciseFreq", e.target.value)}
                      className="h-8"
                    />
                  </div>

                  <Button onClick={generateInsights} className="w-full h-8 text-xs" size="sm">
                    <Zap className="w-3 h-3 mr-1" />
                    Generate Insights
                  </Button>
                </CardContent>
              </Card>

              {insights.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {insights.map((insight, index) => (
                        <div key={index} className="p-2 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          <div className="text-xs text-muted-foreground text-center">
            <p>Personalized Medicine 3.0</p>
            <p className="font-medium text-primary">Predict → Prevent → Partner</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
