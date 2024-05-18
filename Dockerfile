FROM node:20.13.1-alpine
WORKDIR /app
COPY . .
RUN npm i
CMD ["node", "index.js"]
