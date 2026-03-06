FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "run", "start:api"]
