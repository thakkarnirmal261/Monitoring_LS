# frontend/Dockerfile  — runs on frontendLSEC2
# IMPORTANT: build from the REPO ROOT so the context includes both
# frontend/ and deploy/ :
#   docker build -f frontend/Dockerfile -t monitoring-frontend .
FROM node:20 AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
# Browser uses relative /metrics paths; nginx proxies them. No VITE_API_URL needed.
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx-frontend.conf /etc/nginx/conf.d/default.conf
