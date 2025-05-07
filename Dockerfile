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

# Serve avec NGINX
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
