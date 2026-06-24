# Vuln Fullstack Lab

Intentionally vulnerable full-stack repository for testing security products.

> Do not deploy this project on the internet. It contains deliberate vulnerabilities, fake secrets, insecure IaC, vulnerable dependency manifests, and unsafe code paths.

## Coverage Map

| Area | Files | Example findings |
|---|---|---|
| SAST | `backend/src/app.js`, `backend/src/db.js`, `frontend/src/App.jsx` | SQL injection, command injection, SSRF, path traversal, XSS, weak crypto, insecure deserialization pattern |
| SCA | `backend/package.json`, `frontend/package.json`, `requirements.txt` | Old vulnerable package versions |
| Secrets | `.env`, `backend/src/config.js`, `.github/workflows/deploy.yml` | Fake API keys, fake AWS key, fake tokens |
| IaC | `infra/main.tf`, `k8s/deployment.yaml` | Public S3 bucket, open security group, privileged container, latest image tag |
| Container | `Dockerfile`, `docker-compose.yml` | Root user, secrets as ENV, broad volumes, insecure service exposure |
| Zero-day simulation | `backend/src/zeroDaySim.js` | Product should detect suspicious unsafe pattern even without a CVE |

## Run locally

```bash
docker compose up --build
```

The app is intentionally unsafe and may not run cleanly on modern systems because several dependencies are pinned to old versions for SCA testing.

## Suggested scanner assertions

- SAST should flag at least 10 issues.
- SCA should flag vulnerable dependencies in Node, React, Python, and Docker base image.
- Secret scanning should flag fake secrets in committed files.
- IaC scanning should flag public cloud resources and permissive networking.
- Container scanning should flag root user, vulnerable base image, plaintext secrets, and privileged settings.
