FROM node:20-alpine

WORKDIR /nest-server

COPY package.json ./
RUN npm install

COPY . .

# 초기화 스크립트 및 Prisma 작업
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]
