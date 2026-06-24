# Expected Findings Checklist

## SAST
- SQL injection: backend/src/db.js
- Command injection: backend/src/app.js `/ping`
- SSRF: backend/src/app.js `/fetch`
- Path traversal: backend/src/app.js `/download`
- XSS: backend/src/app.js `/render`, frontend/src/App.jsx
- Weak MD5 hash: backend/src/app.js `/hash`
- JWT cookie missing secure flags: backend/src/app.js `/login`
- Eval/new Function: frontend/src/App.jsx, backend/src/zeroDaySim.js
- Prototype pollution pattern: backend/src/zeroDaySim.js

## SCA
- Old Express, lodash, minimist, node-fetch, tar, React, jQuery, Bootstrap, Django, Flask, PyYAML, urllib3.

## Secrets
- .env
- backend/src/config.js
- frontend/src/App.jsx
- infra/main.tf
- k8s/deployment.yaml
- .github/workflows/deploy.yml

## IaC/Container
- Public S3 bucket
- Open 0.0.0.0/0 security group
- Plaintext cloud credentials in Terraform
- Privileged Kubernetes pod
- hostPath root mount
- hostNetwork true
- Docker root user
- Docker Compose privileged true and host root mount
