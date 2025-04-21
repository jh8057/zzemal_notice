# 단계 1: 빌드
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 단계 2: 프로덕션 환경
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
