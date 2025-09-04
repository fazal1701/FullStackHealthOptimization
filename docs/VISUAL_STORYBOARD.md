# Visual Storyboard: Dual-Interface Health Platform

## Overview
This document provides detailed visual specifications for each page of the health optimization platform, including button functionality, image placement, and clinical rationale. The platform serves both patients (simplified, engaging) and doctors (detailed, clinical).

## Patient Interface Pages

### 1. Patient Home Dashboard

**Layout**: Three risk rings (top), daily wins (right), trend tiles (bottom left)

**Risk Rings** (Center Top)
- 🫀 Cardiovascular (Red/Yellow/Green based on ApoB, Lp(a), hs-CRP)
- 🧬 Metabolic (HbA1c, HOMA-IR, liver enzymes)
- 🧠 Neurocognitive (HRV, sleep quality, cognitive scores)

**Buttons That Must Work**:
- `View Details` → expands ring to show contributing factors
- `Why This Matters?` → bottom sheet with 2-3 biology bullets
- `Improve This` → links to relevant program or biomarker page

**Daily Wins Panel** (Right Side)
- 3 cards: "Walk 8,000 steps", "Sleep 7+ hours", "Log Zone 2 session"
- **Buttons**: `Mark Complete` → confetti animation, streak counter
- **Images**: 🚶 steps, 🛏️ sleep, 🚴 exercise icons

**Trend Tiles** (Bottom)
- HRV, Time in Range (CGM), VO2 Max, Sleep Efficiency
- **Buttons**: `View 7-day trend` → sparkline expansion
- **Images**: 📈 trend arrows, device sync timestamps

**Why It Matters**: Keeps patients in daily engagement loop without overwhelming clinical detail

---

### 2. Patient Programs Page

**Sections**: Zone 2/VO2 Max, Strength, Metabolic Health, Sleep, Stability

**Zone 2 Program Card**
- **Buttons**: `Start Session` → timer interface, `Log Workout` → RPE/duration entry
- **Progress**: Weekly target (150 min), current streak
- **Images**: 🚴 cycling path graphic, heart rate zones visualization

**Strength Program Card**
- **Buttons**: `Log Set` → weight/reps entry, `View Progress` → strength curve
- **Metrics**: 1RM estimates, grip strength tracking
- **Images**: 🏋️ barbell, 💪 muscle progression

**Metabolic Health Program**
- **Buttons**: `Log Meal` → fiber/protein tracking, `Check Glucose` → CGM integration
- **Targets**: Fiber 25-30g, protein 1.6g/kg
- **Images**: 🍎 plate with fiber emphasis, 🩸 glucose droplet

**Why It Matters**: Converts clinical goals into actionable weekly routines with measurable progress

---

### 3. Patient Biomarkers Library

**Card Layout**: Grid of biomarker cards with traffic-light status

**ApoB Card**
- **Current**: 120 mg/dL (Orange - 2.1 SD above optimal)
- **Buttons**: `See Percentile` → raw ↔ age/sex percentile toggle
- **Buttons**: `What Improves This?` → chips: "Fiber 25-30g", "Zone 2", "Discuss statin"
- **Images**: Artery cross-section with lipoprotein particles

**HbA1c Card**
- **Current**: 5.8% (Yellow - 1.3 SD above optimal)
- **Buttons**: `When to Retest?` → 3-month interval guidance
- **Buttons**: `Add Note` → context for timeline
- **Images**: RBC glycation timeline diagram

**VO2 Max Card**
- **Current**: 42 mL/kg/min (Green - 0.8 SD above average)
- **Buttons**: `Track Training` → links to Zone 2 program
- **Images**: Lungs/heart/muscle oxygen pathway

**Why It Matters**: Educates without overwhelming—patients see what it is, why it matters, what to do

---

### 4. Patient Devices & Data

**Vendor Integration Panel**
- **Chips**: Apple Health, Fitbit, Oura, WHOOP, Garmin (with connection status)
- **Buttons**: `Connect Device` → OAuth flow → "Linked" + last sync timestamp
- **Buttons**: `Manage Permissions` → toggle steps, HR, sleep, HRV, glucose

**Data Management**
- **CSV Import**: `Upload CSV` → Preview/Map columns → Dry-run report → Import
- **Export**: `Download My Data` → queues JSON/CSV download
- **Lab Upload**: `Scan Lab PDF` → OCR → tag to biomarkers

**Why It Matters**: Brings all health data under one roof while maintaining portability

---

### 5. Patient Account & Consent

**Privacy Controls**
- **Buttons**: `Edit Consent` → granular sharing with clinician
- **Scopes**: Biomarkers, Wearables, Programs, Images
- **Buttons**: `Download Data`, `Delete Account` (two-step confirmation)

**Images**: 🔒 lock/shield icons, clean consent checklist

**Why It Matters**: HIPAA-aligned trust signals, user data ownership

---

## Doctor Interface Pages

### 6. Doctor Cohort Panel

**Patient Heatmap** (Main View)
- Grid: Patients (rows) × Risk Categories (columns)
- **Color Coding**: Green/Yellow/Orange/Red by SD bands
- **Filters**: Age range, sex, risk level, device status
- **Buttons**: `Filter Cohort` → dropdown menus, `Export Report`

**Risk Alerts Panel**
- "15 patients trending toward diabetes intervention threshold"
- **Buttons**: `View Details` → drill-down to specific patients
- **Images**: 🚨 alert icons, trend arrows

**Why It Matters**: Enables triage of 300+ patients at a glance, prevents hospitalizations

---

### 7. Doctor Patient Drill-Down

**Timeline View** (Main Panel)
- Biomarker trends: ApoB, HbA1c, BP, VO2 Max with medication overlays
- **Buttons**: `Add Intervention` → medication/lifestyle recommendation
- **Wearable Roll-ups**: Weekly HRV, sleep, activity summaries

**SHAP Explainability Drawer** (Right Panel)
- **Waterfall Plot**: Top risk drivers with contribution scores
- **Buttons**: `What-if Analysis` → sliders for ApoB, VO2 Max changes
- **Model Info**: AUC±CI, calibration plot, model version
- **Images**: SHAP waterfall thumbnail, calibration curve

**Why It Matters**: Provides evidence-based intervention guidance with explainable AI

---

### 8. Doctor Studies & Updates

**Study Cards** (Filterable Grid)
- **Filters**: Exercise, Nutrition, Sleep, Medications, Mental Health
- **Card Content**: Study design, sample size, effect size (95% CI), NNT/NNH
- **Buttons**: `View Study` → detailed card with limitations
- **Buttons**: `Pin to Plan` → attach to patient protocol

**Images**: 📊 forest plot thumbnails, 🧠 brain (neuro), ❤️ artery (CVD)

**Why It Matters**: Bite-sized evidence updates without reading full papers

---

### 9. Doctor Medications & Supplements

**Drug Class Sections**: Lipids, Glycemia, BP, Hormones, Supplements

**Statin Card Example**
- **Mechanism**: Simple diagram showing HMG-CoA reductase inhibition
- **Expected Changes**: LDL-C ↓30-50%, ApoB ↓25-40% in 6-8 weeks
- **Monitoring**: CK, ALT at 6 weeks, then annually
- **Buttons**: `Patient-Friendly Mode` → plain English summary
- **Images**: 💉 syringe icon, cholesterol synthesis pathway

**Why It Matters**: Standardized decision support across clinic with patient education

---

## Image Asset Requirements

### Patient-Friendly Icons
- 🛏️ Sleep (bed + moon)
- 🍎 Diet (plate with fiber emphasis)
- 🍷 Alcohol (wine glass, educational tone)
- 💉 Medication (syringe for timeline markers)
- ⚖️ Hormone Balance (TRT symbol)
- 💊 Supplements (capsule bottle)
- ⏱️ Fasting (clock overlay on plate)
- 🚴 Zone 2 (cycling path)
- 🫁 VO2 Max (lungs + track)
- 🏃 HIIT/Zone 5 (sprint icon)
- 🧘 Stability (balance pose)
- 🏋️ Strength (barbell)
- 💪 Muscle Mass (flexed arm)

### Disease Category Icons
- ❤️ Cardiovascular (artery cross-section)
- 🧬 Cancer (DNA helix + mutation)
- 🧠 Neurodegeneration (brain + neurons)
- 🥤 Metabolic Disease (fatty liver + glucose)

### Clinical Visualization
- 📊 Forest plots for studies
- 📈 SHAP waterfall plots
- 🎯 Risk target visualizations
- 📱 Device sync indicators

## Button Functionality Matrix

### Patient Buttons (All Must Work)
- **Home**: Mark win, Why this win?, View trends
- **Programs**: Start session, Log workout, Pause/Resume, Finish
- **Biomarkers**: See percentile, What improves?, When retest?, Add note
- **Devices**: Connect device, Manage permissions, Upload CSV, Export data
- **Account**: Edit consent, Download data, Delete account

### Doctor Buttons (Clinical Focus)
- **Cohort**: Filter patients, Export report, View alerts
- **Patient**: Add intervention, What-if analysis, Pin study
- **Studies**: Filter by topic, View study, Pin to plan
- **Medications**: Toggle patient mode, View mechanism

This storyboard ensures every interface element serves a clear clinical or engagement purpose while maintaining the dual-audience approach.
