---
title: QTrack AI Environment
emoji: 🏥
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 5.0.0
app_file: app.py
pinned: false
license: mit
tags:
  - healthcare
  - queue-management
  - hospital
  - ai-environment
  - optimization
  - openenv-hackathon
---

# 🏥 QTrack AI Environment

An **AI-powered hospital queue optimization engine** built for the XYZ Hospital QTrack system.

## What this does
Simulates a real hospital with 7 departments and uses rule-based AI to:
- 🚨 Detect overloaded departments (>60% capacity)
- 📊 Flag doctor queue imbalances (≥4 patients per doctor)
- 💡 Optimize idle resources by routing overflow patients

## How to use
1. Use the sliders to set the number of active patients per department
2. Click **Run AI Engine** to get recommendations
3. Or click **Random Scenario** to auto-generate a test state

## AI Rules
| Rule | Trigger | Action |
|------|---------|--------|
| Overload Detection | Dept > 60% capacity | Route to underloaded dept |
| Queue Rebalancing  | Avg ≥ 4 patients/doctor | Transfer to colleague |
| Idle Optimization  | 0 patients, doctors available | Accept overflow |

Built for the **OpenEnv Hackathon** — QTrack by XYZ Hospital Team.
