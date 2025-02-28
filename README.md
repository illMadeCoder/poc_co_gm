# Scrying.ai

## Overview
Scrying.ai is an AI-powered assistant that provides real-time suggestions and post-session summaries for tabletop role-playing games (TTRPGs). 
We are in early development with an ambitious roadmap and are looking for contributors to join us, please reach out to our team if you're interested!

## Project Goals
### App Features
- Real-time AI TTRPG suggestions via voice transcription including:
  - Hint at what happens next
  - Rule assistance
  - Random tables for items, monsters, events, etc.
  - Scene description
- Post Game Summaries including:
  - Major events & plot points
  - Plot Advancement
  - Player & Character details
  - 'When we last left our heroes' intro
- SSO Authentication
- Cross Platform:
  - Browser 
  - Discord
  - Mobile
- Client Side Hydration
- ... more to come

### DevOps Goals
Our DevOps strategy focuses on **automation, reliability, and scalable deployments** to support rapid development and continuous delivery.

#### Continuous Integration & Deployment (CI/CD)
- Automated builds, tests, and deployments for fast iteration.
- Pull request validation with ephemeral environments.
- Seamless integration with feature branching strategy.

#### Ephemeral Environments
- Dynamic test environments for each PR.
- Automatic provisioning and teardown to optimize cloud resources.
- Unique subdomains (`pr-123.scrying.ai`) for isolated testing.

#### Scalable & Safe Deployment
- **Blue-Green or Canary Deployments** to minimize downtime.
- Automatic rollback in case of failure.
- Staged promotions from **Validation → Staging → Production**.

#### Infrastructure as Code (IaC)
- Kubernetes-based deployment for portability and scalability.
- Terraform or Pulumi for reproducible cloud infrastructure.
- Configuration management via Helm.

#### Observability & Monitoring
- Centralized logging (e.g., ELK, Loki, or CloudWatch).
- Metrics and tracing (e.g., Prometheus + Grafana, OpenTelemetry).
- Automated alerting for failures and anomalies.



## Instructions to Get Started
Early development real-time TTRPG AI PoC.

```sh
git clone https://github.com/ScryingLab/scrying.ai.git

cd vite-client 
npm run dev

cd api
npm run dev
```
