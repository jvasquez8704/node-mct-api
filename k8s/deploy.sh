#!/usr/bin/env bash
set -e

# Default values for env variables, to be used if running this script locally.
#
# SERVICE_ACCOUNT_KEY=katchplus-59e37fc365b0.json
# CI_ENVIRONMENT_URL=https://dev.katchplus.com
# CI_ENVIRONMENT_SLUG=testing
# CI_REGISTRY_IMAGE=registry.gitlab.com/katch_media/katchplus_web
# CI_COMMIT_SHORT_SHA=7d78d7ca
# CI_PROJECT_PATH_SLUG=katch_media/katchplus_web
# CI_PIPELINE_ID=266136175
# CI_BUILD_ID=1076715919
# CI_REGISTRY=registry.gitlab.com
# REGISTRY_USER=gitlab+deploy-token-381764
# REGISTRY_PASSWORD="SUPER_SECURE_PASSWORD"
# GITLAB_USER_EMAIL=testing@katch-media.com
# REPLICAS=1

CI_ENVIRONMENT_HOSTNAME="${CI_ENVIRONMENT_URL}"
CI_ENVIRONMENT_HOSTNAME="${CI_ENVIRONMENT_HOSTNAME/http:\/\//}"
CI_ENVIRONMENT_HOSTNAME="${CI_ENVIRONMENT_HOSTNAME/https:\/\//}"

gcloud auth activate-service-account --key-file=$SERVICE_ACCOUNT_KEY
gcloud config set project katchplus
gcloud config set container/cluster katchplus-cluster
gcloud config set compute/zone us-west1-a
gcloud container clusters get-credentials katchplus-cluster --zone us-west1-a

cat <<EOF | kubectl apply -f -
kind: Namespace
apiVersion: v1
metadata:
  name: $CI_ENVIRONMENT_SLUG
  annotations:
    linkerd.io/inject: enabled
EOF

name="mct-documents-api-$CI_ENVIRONMENT_SLUG"

kubectl create secret -n $CI_ENVIRONMENT_SLUG \
  docker-registry $name-registry-creds \
  --docker-server="$CI_REGISTRY" \
  --docker-username="$REGISTRY_USER" \
  --docker-password="$REGISTRY_PASSWORD" \
  --docker-email="$GITLAB_USER_EMAIL" \
  -o yaml --dry-run | kubectl replace -n $CI_ENVIRONMENT_SLUG --force -f -



replicas="${REPLICAS:-1}"

echo "Deploying $CI_ENVIRONMENT_SLUG (replicas: $replicas) with $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA..."
cat <<EOF | kubectl apply -n $CI_ENVIRONMENT_SLUG --force -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: $name
  namespace: $CI_ENVIRONMENT_SLUG
  annotations:
    app.gitlab.com/env: $CI_ENVIRONMENT_SLUG
    app.gitlab.com/app: $CI_PROJECT_PATH_SLUG
  labels:
    app: $name
    track: "$CI_ENVIRONMENT_SLUG"
    pipeline_id: "$CI_PIPELINE_ID"
    build_id: "$CI_BUILD_ID"
    tier: web
spec:
  replicas: $replicas
  selector:
    matchLabels:
      app: $name
  template:
    metadata:
      annotations:
        app.gitlab.com/env: $CI_ENVIRONMENT_SLUG
        app.gitlab.com/app: $CI_PROJECT_PATH_SLUG
      labels:
        name: $name
        app: $name
        track: "$CI_ENVIRONMENT_SLUG"
        tier: web
    spec:
      imagePullSecrets:
      - name: $name-registry-creds
      containers:
      - name: mct-documents-api
        image: $CI_REGISTRY_IMAGE:$TAG
        imagePullPolicy: Always
        env:
        - name: CI_PIPELINE_ID
          value: "$CI_PIPELINE_ID"
        - name: CI_BUILD_ID
          value: "$CI_BUILD_ID"
        - name: ENV
          value: "$ENV"
        ports:
        - name: web
          containerPort: 443
---
apiVersion: v1
kind: Service
metadata:
  name: $name-service
  namespace: $CI_ENVIRONMENT_SLUG
  annotations:
    app.gitlab.com/env: $CI_ENVIRONMENT_SLUG
    app.gitlab.com/app: $CI_PROJECT_PATH_SLUG
    cloud.google.com/app-protocols: '{"mct-sec-port":"HTTPS"}'
  labels:
    app: $CI_ENVIRONMENT_SLUG
    pipeline_id: "$CI_PIPELINE_ID"
    build_id: "$CI_BUILD_ID"
spec:
  type: NodePort
  ports:
    - name: mct-sec-port
      port: 443
      targetPort: 443
      protocol: TCP
  selector:
    app: $name
    tier: web
EOF

echo "Waiting for deployment..."
kubectl rollout status -n "$CI_ENVIRONMENT_SLUG" -w "deployment/$name"

echo "Application is accessible at: ${CI_ENVIRONMENT_URL}"
echo ""
