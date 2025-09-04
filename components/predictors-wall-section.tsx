"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Activity,
  Droplets,
  Zap,
  Moon,
  Scale,
  Flame,
  BabyIcon as Kidney,
  LeafIcon as Liver,
  TestTube,
  Thermometer,
} from "lucide-react"

const predictors = [
  {
    name: "ApoB/LDL-C",
    icon: Heart,
    value: "85 mg/dL",
    status: "optimal",
    description: "Cardiovascular risk predictor",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "VO₂max",
    icon: Activity,
    value: "45 mL/kg/min",
    status: "good",
    description: "Cardiorespiratory fitness",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "HRV (RMSSD)",
    icon: Zap,
    value: "42 ms",
    status: "moderate",
    description: "Autonomic nervous system",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    name: "A1c",
    icon: Droplets,
    value: "5.2%",
    status: "optimal",
    description: "Glucose regulation",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "Sleep Regularity",
    icon: Moon,
    value: "87%",
    status: "good",
    description: "Circadian rhythm stability",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Waist-to-Height",
    icon: Scale,
    value: "0.48",
    status: "optimal",
    description: "Metabolic health indicator",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "hs-CRP",
    icon: Flame,
    value: "0.8 mg/L",
    status: "moderate",
    description: "Systemic inflammation",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    name: "eGFR",
    icon: Kidney,
    value: ">90",
    status: "optimal",
    description: "Kidney function",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "ALT/AST",
    icon: Liver,
    value: "22/25 U/L",
    status: "optimal",
    description: "Liver function",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "24hr ABPM",
    icon: Thermometer,
    value: "118/76",
    status: "optimal",
    description: "Ambulatory blood pressure",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
]

export function PredictorsWallSection() {
  return (
    <section id="predictors" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <TestTube className="w-4 h-4 mr-2" />
            Major Health Predictors
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">The Predictors Wall</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Track the biomarkers, vitals, and lifestyle factors that matter most for longevity. Each predictor is
            evidence-linked and contributes to your personalized risk models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {predictors.map((predictor, index) => {
            const Icon = predictor.icon
            return (
              <Card
                key={predictor.name}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 ${predictor.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${predictor.color}`} />
                </div>

                <h3 className="font-semibold text-lg mb-2">{predictor.name}</h3>
                <div className="text-2xl font-bold mb-2 font-mono">{predictor.value}</div>

                <Badge
                  variant={
                    predictor.status === "optimal" ? "default" : predictor.status === "good" ? "secondary" : "outline"
                  }
                  className="mb-3 text-xs"
                >
                  {predictor.status}
                </Badge>

                <p className="text-sm text-muted-foreground">{predictor.description}</p>

                <div className="mt-4">
                  <Progress
                    value={predictor.status === "optimal" ? 90 : predictor.status === "good" ? 70 : 50}
                    className="h-2"
                  />
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground max-w-4xl mx-auto">
            <strong>Data Partnerships:</strong> Lab networks (Quest/Labcorp APIs), wearables
            (Apple/Google/Fitbit/Whoop), home BP monitors, EHR/FHIR bundles for comprehensive health tracking.
          </p>
        </div>
      </div>
    </section>
  )
}
