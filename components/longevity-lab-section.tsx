"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Heart, Brain, TrendingUp, Shield, Zap, Target, ArrowRight } from "lucide-react"

const features = [
  {
    title: "Predictive Risk Engine",
    description: "6-12 month health forecasts with confidence intervals and feature attributions",
    icon: TrendingUp,
    metrics: ["94% accuracy", "SHAP explainability", "Calibrated probabilities"],
    color: "chart-1",
  },
  {
    title: "Personalized Prescriptions",
    description: "Evidence-based protocols from Attia & Huberman research, tailored to individual needs",
    icon: Target,
    metrics: ["Zone 2 optimization", "VO₂ max protocols", "Sleep architecture"],
    color: "chart-2",
  },
  {
    title: "Real-time Monitoring",
    description: "Continuous health tracking through wearables and lab integrations",
    icon: Activity,
    metrics: ["24/7 data collection", "Multi-modal sensors", "Automated alerts"],
    color: "chart-3",
  },
  {
    title: "Clinical Integration",
    description: "FHIR-compliant platform for seamless healthcare provider collaboration",
    icon: Shield,
    metrics: ["HIPAA compliant", "EHR integration", "Provider dashboard"],
    color: "chart-4",
  },
]

const protocols = [
  {
    name: "Zone 2 Cardio",
    description: "Aerobic base building for mitochondrial health",
    target: "150-180 min/week",
    benefit: "Improved insulin sensitivity",
    progress: 78,
  },
  {
    name: "VO₂ Max Training",
    description: "High-intensity intervals for cardiovascular fitness",
    target: "2-3 sessions/week",
    benefit: "Reduced mortality risk",
    progress: 85,
  },
  {
    name: "Sleep Optimization",
    description: "Circadian rhythm and sleep quality enhancement",
    target: "7-9 hours nightly",
    benefit: "Enhanced recovery",
    progress: 92,
  },
  {
    name: "Strength Training",
    description: "Resistance training for muscle mass and bone density",
    target: "3-4 sessions/week",
    benefit: "Sarcopenia prevention",
    progress: 67,
  },
]

export function LongevityLabSection() {
  return (
    <section id="longevitylab" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
            <Activity className="w-4 h-4 mr-2" />
            LongevityLab AI Platform
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Your Personal Longevity Intelligence System</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive precision medicine platform that transforms wearable data and clinical insights into actionable longevity
            optimization strategies.
          </p>
        </div>

        {/* Platform Overview */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-3xl font-serif font-bold mb-6">Predictive Longevity Dashboard</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              LongevityLab AI ingests data from wearables, lab results, and lifestyle factors to create personalized longevity
              forecasts and evidence-based intervention plans. Built on the latest research from longevity science and
              optimized for real-world clinical application.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Cardiovascular Risk Prediction</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced models predict heart disease risk 6-12 months in advance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                  <Brain className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Cognitive Health Optimization</h4>
                  <p className="text-sm text-muted-foreground">
                    Sleep, exercise, and nutrition protocols for brain health
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-chart-3/10 rounded-full flex items-center justify-center mt-1">
                  <Zap className="w-4 h-4 text-chart-3" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Metabolic Health Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Continuous glucose monitoring and insulin sensitivity optimization
                  </p>
                </div>
              </div>
            </div>

            <Button className="mt-8" size="lg">
              <Activity className="w-5 h-5 mr-2" />
              Explore Platform
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${feature.color}/10 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {feature.metrics.map((metric, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Health Protocols */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold mb-4">Evidence-Based Health Protocols</h3>
            <p className="text-muted-foreground text-lg">
              Personalized interventions based on cutting-edge longevity research
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {protocols.map((protocol, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold mb-1">{protocol.name}</h4>
                    <p className="text-sm text-muted-foreground">{protocol.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {protocol.target}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Adherence Progress</span>
                    <span className="font-semibold text-primary">{protocol.progress}%</span>
                  </div>
                  <Progress value={protocol.progress} className="h-2" />
                  <div className="text-xs text-accent font-medium bg-accent/5 rounded px-2 py-1">
                    {protocol.benefit}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
