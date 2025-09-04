"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Heart, Activity, TrendingUp, Target, BarChart3, LineChart, PieChart } from "lucide-react"

const models = [
  {
    name: "Cardiovascular Risk Predictor",
    description: "Cox proportional hazards model with XGBoost ensemble predicting 6-12 month cardiovascular events",
    accuracy: 94,
    features: ["HRV patterns", "Blood pressure variability", "Lipid profiles", "Exercise capacity"],
    icon: Heart,
    color: "chart-1",
    type: "Survival Analysis",
  },
  {
    name: "VO₂ Max Trajectory Model",
    description: "LSTM-based time series forecasting for aerobic capacity decline and optimization potential",
    accuracy: 89,
    features: ["Training load", "Recovery metrics", "Age factors", "Genetic markers"],
    icon: Activity,
    color: "chart-2",
    type: "Time Series",
  },
  {
    name: "Metabolic Health Forecaster",
    description: "Gradient boosting model predicting insulin resistance and metabolic syndrome risk",
    accuracy: 91,
    features: ["Glucose patterns", "Sleep quality", "Stress markers", "Body composition"],
    icon: TrendingUp,
    color: "chart-3",
    type: "Classification",
  },
  {
    name: "Cognitive Performance Model",
    description: "Multi-modal neural network assessing cognitive decline risk and optimization strategies",
    accuracy: 87,
    features: ["Brain imaging", "Cognitive tests", "Sleep patterns", "Inflammation markers"],
    icon: Brain,
    color: "chart-4",
    type: "Deep Learning",
  },
]

const techniques = [
  {
    name: "SHAP Explainability",
    description: "Feature attribution for transparent model decisions",
    icon: Target,
    usage: "Every prediction includes feature importance",
  },
  {
    name: "Calibrated Probabilities",
    description: "Platt scaling and isotonic regression for reliable uncertainty",
    icon: BarChart3,
    usage: "Confidence intervals on all forecasts",
  },
  {
    name: "Drift Detection",
    description: "Continuous monitoring for model performance degradation",
    icon: LineChart,
    usage: "Real-time alerts for model retraining",
  },
  {
    name: "Fairness Constraints",
    description: "Demographic parity and equalized odds enforcement",
    icon: PieChart,
    usage: "Bias mitigation across populations",
  },
]

export function PredictiveModelsSection() {
  return (
    <section id="models" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-accent/10 text-accent border-accent/20">
            <Brain className="w-4 h-4 mr-2" />
            AI/ML Models
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Predictive Health Models</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            State-of-the-art machine learning models that forecast health outcomes with unprecedented accuracy and
            explainability.
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {models.map((model, index) => {
            const Icon = model.icon
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-${model.color}/10 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${model.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{model.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {model.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{model.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{model.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {model.features.map((feature, idx) => (
                        <div key={idx} className="text-sm bg-muted/50 rounded px-3 py-2">
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Model Performance</span>
                      <span className="font-semibold">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ML Techniques */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold mb-4">Advanced ML Techniques</h3>
            <p className="text-muted-foreground text-lg">
              Ensuring model reliability, interpretability, and fairness in healthcare applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techniques.map((technique, index) => {
              const Icon = technique.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{technique.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{technique.description}</p>
                  <div className="text-xs text-accent font-medium bg-accent/5 rounded-full px-3 py-1">
                    {technique.usage}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
