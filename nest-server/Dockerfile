# docker file
# docker build -t node-server .

FROM node:20-alpine

# Create app directory
WORKDIR /nest-server


# Install app dependencies
COPY package.json ./

RUN npm install

RUN npx prisma migrate dev --name init
RUN npx prisma generate

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm","run", "start" ]
