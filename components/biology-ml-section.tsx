"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dna, Microscope, Activity, Brain, Heart, ArrowRight, Database, Cpu, Network } from "lucide-react"

const integrations = [
  {
    title: "Genomics × Deep Learning",
    description: "Polygenic risk scores enhanced with neural networks for personalized disease prediction",
    biology: "SNP analysis, GWAS data, epigenetic markers",
    ml: "Convolutional neural networks, attention mechanisms",
    outcome: "99.2% accuracy in hereditary disease risk",
    icon: Dna,
    color: "chart-1",
  },
  {
    title: "Proteomics × Time Series",
    description: "Protein biomarker trajectories analyzed with temporal machine learning models",
    biology: "Mass spectrometry, protein interactions, pathways",
    ml: "LSTM networks, transformer models, sequence analysis",
    outcome: "Early detection 8 months before symptoms",
    icon: Microscope,
    color: "chart-2",
  },
  {
    title: "Metabolomics × Ensemble Methods",
    description: "Metabolite profiles processed through gradient boosting for metabolic health",
    biology: "Metabolic pathways, enzyme kinetics, flux analysis",
    ml: "XGBoost, random forests, feature selection",
    outcome: "Personalized nutrition with 94% adherence",
    icon: Activity,
    color: "chart-3",
  },
  {
    title: "Neuroimaging × Computer Vision",
    description: "Brain structure and function analysis using advanced image processing AI",
    biology: "fMRI, DTI, structural MRI, connectivity maps",
    ml: "3D CNNs, vision transformers, segmentation",
    outcome: "Cognitive decline prediction 5 years early",
    icon: Brain,
    color: "chart-4",
  },
]

const dataFlow = [
  {
    stage: "Data Acquisition",
    description: "Multi-omics data collection from various biological sources",
    technologies: ["Wearables", "Lab-on-chip", "Imaging", "Sequencing"],
    icon: Database,
  },
  {
    stage: "Feature Engineering",
    description: "Biological knowledge-guided feature extraction and selection",
    technologies: ["Pathway analysis", "Dimensionality reduction", "Domain expertise", "Feature selection"],
    icon: Cpu,
  },
  {
    stage: "Model Training",
    description: "ML models trained with biological constraints and interpretability",
    technologies: ["Deep learning", "Ensemble methods", "Bayesian inference", "Transfer learning"],
    icon: Network,
  },
  {
    stage: "Clinical Integration",
    description: "Deployment in clinical workflows with safety and compliance",
    technologies: ["FHIR integration", "Clinical decision support", "Regulatory compliance", "Continuous monitoring"],
    icon: Heart,
  },
]

export function BiologyMLSection() {
  return (
    <section id="biology" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-chart-3/10 text-chart-3 border-chart-3/20">
            <Dna className="w-4 h-4 mr-2" />
            Biology × ML Integration
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">The Convergence of Life Sciences and AI</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Where biological understanding meets computational power to unlock unprecedented insights into human health
            and longevity.
          </p>
        </div>

        {/* Integration Examples */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {integrations.map((integration, index) => {
            const Icon = integration.icon
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-${integration.color}/10 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${integration.color}`} />
                    </div>
                    <CardTitle className="text-xl">{integration.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{integration.description}</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-primary">Biology Component</h4>
                      <p className="text-sm text-muted-foreground bg-primary/5 rounded p-3">{integration.biology}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-accent">ML Component</h4>
                      <p className="text-sm text-muted-foreground bg-accent/5 rounded p-3">{integration.ml}</p>
                    </div>
                  </div>

                  <div className="bg-chart-3/10 rounded-lg p-4 text-center">
                    <div className="font-semibold text-chart-3 mb-1">Clinical Outcome</div>
                    <div className="text-sm">{integration.outcome}</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Data Flow Pipeline */}
        <div className="bg-card rounded-2xl p-8 border">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold mb-4">Biology-Informed ML Pipeline</h3>
            <p className="text-muted-foreground text-lg">
              A systematic approach to integrating biological knowledge with machine learning
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {dataFlow.map((stage, index) => {
              const Icon = stage.icon
              return (
                <div key={index} className="relative">
                  <Card className="p-6 text-center h-full hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-3">{stage.stage}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{stage.description}</p>
                    <div className="space-y-1">
                      {stage.technologies.map((tech, idx) => (
                        <div key={idx} className="text-xs bg-muted/50 rounded px-2 py-1">
                          {tech}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {index < dataFlow.length - 1 && (
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
      </div>
    </section>
  )
}
