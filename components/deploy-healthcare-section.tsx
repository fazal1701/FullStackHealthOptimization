"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Lock,
  Eye,
  GitBranch,
  Server,
  Database,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    title: "HIPAA/GDPR Compliance",
    description: "Built-in privacy controls, encryption, and audit trails for healthcare data",
    icon: Shield,
    benefits: ["End-to-end encryption", "Access controls", "Audit logging", "Data minimization"],
    color: "primary",
  },
  {
    title: "Model Registry & Versioning",
    description: "MLflow-based model management with signed artifacts and rollback capabilities",
    icon: GitBranch,
    benefits: ["Version control", "A/B testing", "Canary deployments", "Instant rollback"],
    color: "accent",
  },
  {
    title: "Policy-as-Code",
    description: "Automated compliance checks and governance through Open Policy Agent",
    icon: Lock,
    benefits: ["Automated compliance", "Policy enforcement", "Risk assessment", "Regulatory reporting"],
    color: "chart-3",
  },
  {
    title: "Observability & Monitoring",
    description: "Real-time model performance tracking with drift detection and alerting",
    icon: Eye,
    benefits: ["Performance monitoring", "Drift detection", "SLA tracking", "Automated alerts"],
    color: "chart-4",
  },
]

const pipeline = [
  {
    stage: "Development",
    description: "Model training with compliance checks",
    icon: Database,
    status: "active",
    time: "2-4 weeks",
  },
  {
    stage: "Validation",
    description: "Automated testing and bias detection",
    icon: CheckCircle,
    status: "completed",
    time: "1-2 days",
  },
  {
    stage: "Staging",
    description: "Shadow traffic and canary deployment",
    icon: AlertTriangle,
    status: "pending",
    time: "1-3 days",
  },
  {
    stage: "Production",
    description: "Full deployment with monitoring",
    icon: Server,
    status: "ready",
    time: "< 30 min",
  },
]

const metrics = [
  { label: "Deployment Time", value: "< 30 min", description: "From approved PR to production" },
  { label: "Model Accuracy", value: "99.2%", description: "Average across all deployed models" },
  { label: "Uptime SLA", value: "99.9%", description: "Platform availability guarantee" },
  { label: "Compliance Score", value: "100%", description: "HIPAA/GDPR audit results" },
]

export function DeployHealthcareSection() {
  return (
    <section id="deploy" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-chart-4/10 text-chart-4 border-chart-4/20">
            <Shield className="w-4 h-4 mr-2" />
            Deploy Healthcare MLOps
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Compliant ML Deployment Platform</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade MLOps platform designed specifically for healthcare, ensuring compliance, reliability, and
            auditability at scale.
          </p>
        </div>

        {/* Platform Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-t-chart-4">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-${feature.color}/10 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Deployment Pipeline */}
        <div className="bg-card rounded-2xl p-8 border mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold mb-4">Automated Deployment Pipeline</h3>
            <p className="text-muted-foreground text-lg">
              From model training to production deployment with built-in safety checks
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {pipeline.map((stage, index) => {
              const Icon = stage.icon
              const statusColors = {
                active: "primary",
                completed: "chart-2",
                pending: "chart-3",
                ready: "accent",
              }
              const statusColor = statusColors[stage.status as keyof typeof statusColors]

              return (
                <div key={index} className="relative">
                  <Card
                    className={`p-6 text-center border-2 ${
                      stage.status === "active" ? "border-primary shadow-lg" : "border-border"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 bg-${statusColor}/10 rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-8 h-8 text-${statusColor}`} />
                    </div>
                    <h4 className="font-semibold mb-2">{stage.stage}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {stage.time}
                    </Badge>
                  </Card>

                  {index < pipeline.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
              <div className="font-semibold mb-1">{metric.label}</div>
              <div className="text-sm text-muted-foreground">{metric.description}</div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="px-8 py-4">
            <Shield className="w-5 h-5 mr-2" />
            Explore MLOps Platform
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
