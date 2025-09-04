"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  GitBranch,
  Target,
  BarChart3,
  Zap,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Droplets,
} from "lucide-react"

export function MLSystemSection() {
  return (
    <section id="ml-system" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-accent/10 text-accent border-accent/20">
            <Brain className="w-4 h-4 mr-2" />
            ML System Architecture
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Clarity Over Hype</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our machine learning system prioritizes explainability, calibration, and clinical utility over algorithmic
            complexity. Every prediction comes with uncertainty bounds and evidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {/* Segmentation */}
          <Card className="p-8 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Segmentation</h3>
                <p className="text-muted-foreground">K-Means clustering on normalized data</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Short-sleep/High stress</span>
                  <Badge variant="outline">Cluster A</Badge>
                </div>
                <Progress value={35} className="h-2" />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">High activity/Poor lipids</span>
                  <Badge variant="outline">Cluster B</Badge>
                </div>
                <Progress value={28} className="h-2" />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Optimal metabolic health</span>
                  <Badge variant="outline">Cluster C</Badge>
                </div>
                <Progress value={37} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Outcomes Prediction */}
          <Card className="p-8 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Outcomes</h3>
                <p className="text-muted-foreground">Multi-modal prediction models</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">Decision Trees / GBMs</span>
                <Badge className="bg-green-500/10 text-green-600">Tabular risks</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">LSTM/TFT</span>
                <Badge className="bg-blue-500/10 text-blue-600">Time series</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">CoxPH/DeepSurv</span>
                <Badge className="bg-purple-500/10 text-purple-600">Time-to-event</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Calibration & Explainability */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-chart-1" />
            </div>
            <h3 className="text-xl font-bold mb-2">Calibration</h3>
            <p className="text-muted-foreground mb-4">Isotonic/Platt scaling with reliability curves</p>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-mono">ECE &lt; 0.05</span>
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GitBranch className="w-8 h-8 text-chart-2" />
            </div>
            <h3 className="text-xl font-bold mb-2">Explainability</h3>
            <p className="text-muted-foreground mb-4">SHAP global + per-prediction analysis</p>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-mono">AUROC &gt; 0.8</span>
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-chart-3" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personalization</h3>
            <p className="text-muted-foreground mb-4">LinUCB/TS bandit optimization</p>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-mono">Silhouette &gt; 0.7</span>
            </div>
          </Card>
        </div>

        {/* What-if Analysis */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Counterfactual Analysis</h3>
            <p className="text-muted-foreground">
              Interactive sliders let users explore "what-if" scenarios with real-time risk recalculation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-background rounded-lg mb-3">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-mono text-lg">+30 min Zone 2</div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-green-600 font-medium">-12% CVD risk</span>
              </div>
            </div>

            <div className="text-center">
              <div className="p-4 bg-background rounded-lg mb-3">
                <AlertTriangle className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="font-mono text-lg">-1 drink/night</div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-green-600 font-medium">-8% liver risk</span>
              </div>
            </div>

            <div className="text-center">
              <div className="p-4 bg-background rounded-lg mb-3">
                <Droplets className="w-8 h-8 text-chart-3 mx-auto mb-2" />
                <div className="font-mono text-lg">LDL -30 mg/dL</div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-green-600 font-medium">-15% CVD risk</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button className="px-6 py-3">
              Try Interactive Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
