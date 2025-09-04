"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ArrowRight, Sparkles, Shield, Server } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img src="/medical-pattern.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyan-400/10 to-transparent rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="order-2 lg:order-1 relative">
            <div className="relative">
              <img
                src="/ai-medical-tech.png"
                alt="Advanced medical technology showcasing AI-powered health monitoring"
                className="rounded-2xl shadow-2xl border border-border/20"
              />
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">AI Analysis Active</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
              <img src="/placeholder-7vd0g.png" alt="DNA analysis" className="w-12 h-12 rounded-lg" />
            </div>
            <div className="absolute top-1/2 -right-8 bg-card border border-border rounded-lg p-3 shadow-lg">
              <img src="/heart-rate-monitor-icon.png" alt="Heart monitoring" className="w-12 h-12 rounded-lg" />
            </div>
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
              <Sparkles className="w-4 h-4 mr-2" />
              LongevityLab AI + Deploy Healthcare
            </Badge>

            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-white via-emerald-300 to-blue-300 bg-clip-text text-transparent leading-tight">
              Beyond Tracking Steps
            </h1>

            <p className="text-xl md:text-2xl text-emerald-200 mb-6 leading-relaxed font-semibold">
              Here's your future health, and here's how to change it.
            </p>

            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              <span className="text-emerald-300 font-semibold">LongevityLab AI</span> forecasts longevity risks 6-12 months
              ahead using wearables + clinical data.
              <span className="text-blue-300 font-semibold"> Deploy Healthcare</span> ensures AI models are HIPAA/GDPR
              compliant with healthcare-grade infrastructure.
            </p>

            <div className="bg-slate-800/50 border border-emerald-500/30 rounded-lg p-4 mb-8">
              <p className="text-sm text-slate-300">
                <Shield className="w-4 h-4 inline mr-2 text-emerald-400" />
                <strong className="text-emerald-300">AI in healthcare must be safe.</strong> Built for clinician
                collaboration with compliance-first deployment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white"
                onClick={() => {
                  document.getElementById("profile")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg bg-transparent hover:bg-slate-800/50 border-slate-600 text-slate-300 hover:text-white"
              >
                <Server className="w-5 h-5 mr-2" />
                Deploy Healthcare
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-20">
          <Card className="p-6 bg-slate-800/60 backdrop-blur-sm border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 group">
            <div className="relative mb-4">
              <img
                src="/placeholder-x48qk.png"
                alt="Biomarker analysis"
                className="w-16 h-16 rounded-lg mx-auto group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center text-emerald-300">Predictive Engine</h3>
            <p className="text-slate-300 text-sm text-center">
              Zone 2 cardio, VO₂max protocols, sleep optimization with 6-12 month forecasting
            </p>
          </Card>

          <Card className="p-6 bg-slate-800/60 backdrop-blur-sm border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group">
            <div className="relative mb-4">
              <img
                src="/ai-brain-medical-analysis.png"
                alt="AI analysis"
                className="w-16 h-16 rounded-lg mx-auto group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center text-blue-300">Healthcare MLOps</h3>
            <p className="text-slate-300 text-sm text-center">
              HIPAA-compliant CI/CD pipelines, auto rollback, audit logs for medical AI
            </p>
          </Card>

          <Card className="p-6 bg-slate-800/60 backdrop-blur-sm border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group">
            <div className="relative mb-4">
              <img
                src="/placeholder-eg6ku.png"
                alt="Clinician collaboration"
                className="w-16 h-16 rounded-lg mx-auto group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center text-cyan-300">Domain Expertise</h3>
            <p className="text-slate-300 text-sm text-center">
              Biology + AI depth with Huberman/Attia protocols and regulatory compliance
            </p>
          </Card>

          <Card className="p-6 bg-slate-800/60 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group">
            <div className="relative mb-4">
              <img
                src="/placeholder-52zfe.png"
                alt="Medical data security"
                className="w-16 h-16 rounded-lg mx-auto group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center text-purple-300">Future-Ready Stack</h3>
            <p className="text-slate-300 text-sm text-center">
              Django/FastAPI, TensorFlow, Kubernetes, MLflow - practical + futuristic
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
