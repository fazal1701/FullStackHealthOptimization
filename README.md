# Health Optimization Platform

This project is now frontend-only (Next.js, TypeScript, Tailwind CSS) and uses mock data everywhere. No backend, Python, FastAPI, or ML pipeline is required.

## 🌟 Features

### Patient Dashboard
- **Longevity Risk Assessment**: Visual representation of cardiovascular, metabolic, and neurocognitive risk scores with percentile benchmarks
- **Wearable Integration**: Support for Apple Health, Fitbit, Oura, WHOOP, Garmin, and Google Fit
- **Habit Tracking**: Gamified daily longevity habit tracking with streaks and achievements
- **Personalized Protocols**: AI-driven longevity recommendations and precision medicine interventions
- **Progress Visualization**: Interactive charts showing healthspan optimization trends over time

### Clinician Dashboard
- **Cohort Analytics**: Population longevity analytics with precision risk stratification
- **Patient Drill-Down**: Detailed biomarker timelines with longevity intervention overlays
- **AI Decision Support**: SHAP-based explainable AI with longevity protocol recommendations
- **Evidence-Based Guidelines**: Clinical recommendations based on longevity science standards
- **Wearable Monitoring**: Real-time view of patient device connectivity and longevity metrics

### Technical Features
- **Role-Based Authentication**: Separate patient and doctor access levels
- **RESTful API**: Comprehensive API endpoints for all data operations
- **Real-Time Data**: Mock integration with wearable device APIs
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FullStackHealthOptimization
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Accounts

The application includes demo accounts for testing:

**Patient Account:**
- Email: `sarah.johnson@email.com`
- Password: `patient123`

**Doctor Account:**
- Email: `dr.chen@healthcenter.com`
- Password: `doctor123`

## 🏗️ Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization library
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **Mock Data Layer**: Comprehensive mock data for development
- **Type-Safe APIs**: Full TypeScript coverage

### Key Components

```
components/
├── patient-dashboard.tsx     # Main patient interface
├── doctor-dashboard.tsx      # Main doctor interface
├── risk-ring.tsx            # Risk visualization component
├── wearable-card.tsx        # Wearable device metrics
├── habit-card.tsx           # Habit tracking interface
├── cohort-heatmap.tsx       # Patient risk heatmap
├── patient-drill-down.tsx   # Detailed patient view
├── decision-support-panel.tsx # AI recommendations
├── vendor-chip.tsx          # Device connection status
├── auth-context.tsx         # Authentication provider
└── login-form.tsx           # Login interface
```

## 📊 Data Models

### Core Types
- **User**: Base user interface (Patient/Doctor)
- **RiskScore**: Health risk assessment data
- **WearableMetric**: Device-collected health data
- **Biomarker**: Laboratory test results
- **Habit**: User behavior tracking
- **DecisionSupport**: AI-generated recommendations

### API Endpoints

```
GET  /api/patient/[id]                    # Patient profile and dashboard data
GET  /api/patient/[id]/wearables          # Wearable device data and trends
POST /api/patient/[id]/link-vendor        # Connect wearable devices
GET  /api/patient/[id]/biomarkers         # Biomarker timeline and analysis
GET  /api/doctor/panel                    # Doctor dashboard and patient cohort
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for production deployment:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Wearable API Keys (for production)
FITBIT_CLIENT_ID=your-fitbit-client-id
APPLE_HEALTH_KEY=your-apple-health-key
OURA_CLIENT_ID=your-oura-client-id
WHOOP_CLIENT_ID=your-whoop-client-id
GARMIN_CLIENT_ID=your-garmin-client-id
```

### Wearable Device Integration

The application includes mock integrations for:
- **Apple Health**: HealthKit data access
- **Fitbit**: Activity, sleep, and heart rate data
- **Oura Ring**: Sleep quality and recovery metrics
- **WHOOP**: Strain, recovery, and sleep data
- **Garmin**: Fitness and activity tracking
- **Google Fit**: Comprehensive health data

## 🧪 Development

### Mock Data
The application uses comprehensive mock data located in `lib/mock-data.ts`:
- Patient profiles and health records
- Wearable device metrics and trends
- Biomarker timelines with medication overlays
- SHAP-based AI decision support data

### Adding New Features

1. **New Dashboard Component**:
   - Create component in `components/`
   - Add to appropriate dashboard
   - Update types in `lib/types.ts`

2. **New API Endpoint**:
   - Create route in `app/api/`
   - Add mock data if needed
   - Update API documentation

3. **New Wearable Integration**:
   - Add vendor to `MOCK_VENDORS`
   - Update `VendorChip` component
   - Add OAuth flow in API

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Docker
```bash
# Build the container
docker build -t health-optimization-app .

# Run the container
docker run -p 3000:3000 health-optimization-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Recharts** for beautiful data visualizations
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for rapid UI development
- **Next.js** team for the excellent framewor
- **NextAuth.js** for authenticationk