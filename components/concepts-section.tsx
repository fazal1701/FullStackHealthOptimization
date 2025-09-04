"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Brain, Heart, Shield, Target, TrendingUp } from "lucide-react"

const concepts = [
  {
    title: "From Reactive to Predictive",
    description:
      "Traditional medicine treats disease after symptoms appear. LongevityLab predicts and prevents health issues 6-12 months before they manifest.",
    icon: TrendingUp,
    color: "primary",
    image: "/placeholder.svg?height=200&width=300&text=Predictive+Analytics+Dashboard",
    metrics: [
      { label: "Early Detection", value: 85, unit: "%" },
      { label: "Prevention Success", value: 92, unit: "%" },
    ],
  },
  {
    title: "Longevity-Focused Care",
    description:
      "Shifting from lifespan to healthspan optimization. Focus on maintaining peak physical and cognitive function throughout life.",
    icon: Heart,
    color: "accent",
    image: "/placeholder.svg?height=200&width=300&text=Longevity+Health+Monitoring",
    metrics: [
      { label: "Healthspan Extension", value: 15, unit: "years" },
      { label: "Quality of Life", value: 94, unit: "%" },
    ],
  },
  {
    title: "Precision Medicine",
    description:
      "Personalized interventions based on individual genetics, biomarkers, lifestyle, and real-time physiological data.",
    icon: Target,
    color: "chart-3",
    image: "/placeholder.svg?height=200&width=300&text=DNA+Genetic+Analysis",
    metrics: [
      { label: "Treatment Efficacy", value: 78, unit: "%" },
      { label: "Adverse Events", value: 12, unit: "%" },
    ],
  },
  {
    title: "Continuous Monitoring",
    description:
      "24/7 health tracking through wearables, lab-on-chip devices, and environmental sensors for real-time health optimization.",
    icon: Activity,
    color: "chart-5",
    image: "/placeholder.svg?height=200&width=300&text=Wearable+Health+Devices",
    metrics: [
      { label: "Data Points/Day", value: 86400, unit: "" },
      { label: "Accuracy", value: 97, unit: "%" },
    ],
  },
]

const principles = [
  {
    title: "Zone 2 Cardio Training",
    description: "Aerobic base building for mitochondrial health and metabolic efficiency",
    icon: Activity,
    benefit: "Improves insulin sensitivity and fat oxidation",
    image: "/placeholder.svg?height=120&width=120&text=Cardio+Training",
  },
  {
    title: "VO₂ Max Optimization",
    description: "The strongest predictor of longevity and cardiovascular health",
    icon: Heart,
    benefit: "Reduces all-cause mortality by up to 50%",
    image: "/placeholder.svg?height=120&width=120&text=VO2+Max+Test",
  },
  {
    title: "Sleep Architecture",
    description: "Circadian rhythm optimization and sleep quality enhancement",
    icon: Brain,
    benefit: "Critical for memory consolidation and cellular repair",
    image: "/placeholder.svg?height=120&width=120&text=Sleep+Monitoring",
  },
  {
    title: "Strength & Stability",
    description: "Resistance training and movement quality for healthy aging",
    icon: Shield,
    benefit: "Prevents sarcopenia and maintains bone density",
    image: "/placeholder.svg?height=120&width=120&text=Strength+Training",
  },
]

export function ConceptsSection() {
  return (
    <section id="concepts" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <img
          src="/placeholder.svg?height=800&width=1200&text=Medical+Background+Pattern"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <Brain className="w-4 h-4 mr-2" />
            Core Concepts
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">The Longevity Science Revolution</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A paradigm shift from treating disease to optimizing healthspan, powered by predictive analytics and
            precision medicine interventions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {concepts.map((concept, index) => {
            const Icon = concept.icon
            return (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={concept.image || "/placeholder.svg"}
                    alt={concept.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg">{concept.title}</h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">{concept.description}</p>
                  <div className="space-y-4">
                    {concept.metrics.map((metric, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{metric.label}</span>
                          <span className="text-primary font-semibold">
                            {metric.value.toLocaleString()}
                            {metric.unit}
                          </span>
                        </div>
                        <Progress value={metric.value > 100 ? 100 : metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold mb-4">Evidence-Based Health Protocols</h3>
            <p className="text-muted-foreground text-lg">
              Grounded in the research of Peter Attia, Andrew Huberman, and leading longevity scientists
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-4">
                    <img
                      src={principle.image || "/placeholder.svg"}
                      alt={principle.title}
                      className="w-20 h-20 rounded-xl mx-auto object-cover group-hover:scale-105 transition-transform shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{principle.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{principle.description}</p>
                  <div className="text-xs text-primary font-medium bg-primary/5 rounded-full px-3 py-1">
                    {principle.benefit}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
