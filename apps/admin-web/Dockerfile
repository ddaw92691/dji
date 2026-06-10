FROM node:20-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
ENV API_UPSTREAM=127.0.0.1:8080
COPY nginx-admin.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
