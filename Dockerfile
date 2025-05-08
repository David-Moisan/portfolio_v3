FROM node:slim AS builder

WORKDIR /app

# Copie des fichiers nécessaires au build
COPY package*.json ./
COPY vite.config.js ./
COPY tsconfig*.json ./
COPY gsap-config.ts ./

# Copier tout ce qui est nécessaire à Vite
COPY src ./src
COPY static/ ./static
COPY types/ ./types

RUN npm install 
RUN npm run build