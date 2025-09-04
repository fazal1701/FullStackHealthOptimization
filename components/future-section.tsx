"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Brain, Dna, Heart, Zap, Telescope, Atom, Cpu, Globe, ArrowRight, Star } from "lucide-react"

const innovations = [
  {
    title: "Quantum-Enhanced Drug Discovery",
    description: "Quantum computing algorithms for molecular simulation and personalized therapeutics",
    timeline: "2025-2027",
    impact: "Revolutionary",
    icon: Atom,
    color: "chart-1",
  },
  {
    title: "Digital Twins for Health",
    description: "Complete physiological models for personalized treatment simulation",
    timeline: "2026-2028",
    impact: "Transformative",
    icon: Cpu,
    color: "chart-2",
  },
  {
    title: "Longevity Escape Velocity",
    description: "Achieving the point where life expectancy increases faster than aging",
    timeline: "2030-2035",
    impact: "Paradigm Shift",
    icon: Telescope,
    color: "chart-3",
  },
  {
    title: "Neural Interface Medicine",
    description: "Direct brain-computer interfaces for neurological condition treatment",
    timeline: "2028-2032",
    impact: "Revolutionary",
    icon: Brain,
    color: "chart-4",
  },
]

const principles = [
  {
    title: "Democratized Healthcare",
    description: "AI-powered diagnostics accessible to everyone, regardless of location or economic status",
    icon: Globe,
  },
  {
    title: "Preventive-First Medicine",
    description: "Complete shift from treatment to prevention through predictive analytics",
    icon: Heart,
  },
  {
    title: "Personalized at Scale",
    description: "Individual-level precision medicine delivered to billions simultaneously",
    icon: Dna,
  },
  {
    title: "Continuous Optimization",
    description: "Real-time health optimization through ubiquitous sensing and AI",
    icon: Zap,
  },
]

export function FutureSection() {
  return (
    <section id="future" className="py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-chart-3/10 text-chart-3 border-chart-3/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Future Vision
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">The Next Frontier of Medicine</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exploring the convergence of emerging technologies that will define the next generation of healthcare and
            human optimization.
          </p>
        </div>

        {/* Future Innovations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {innovations.map((innovation, index) => {
            const Icon = innovation.icon
            const impactColors = {
              Revolutionary: "chart-1",
              Transformative: "chart-2",
              "Paradigm Shift": "chart-3",
            }
            const impactColor = impactColors[innovation.impact as keyof typeof impactColors]

            return (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-${innovation.color}/10 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 text-${innovation.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">{innovation.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {innovation.timeline}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`bg-${impactColor}/10 text-${impactColor} border-${impactColor}/20`}>
                      {innovation.impact}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{innovation.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Core Principles */}
        <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-2xl p-8 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold mb-4">Guiding Principles for Medicine 4.0</h3>
            <p className="text-muted-foreground text-lg">
              The foundational values that will shape the future of healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-3">{principle.title}</h4>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-3xl font-serif font-bold mb-4">Join the Longevity Science Revolution</h3>
            <p className="text-muted-foreground text-lg">
              Be part of the transformation that will extend human healthspan and revolutionize how we approach precision
              medicine and longevity optimization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-4 text-lg pulse-glow">
              <Star className="w-5 h-5 mr-2" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
              <Brain className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
