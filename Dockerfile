FROM node:20.13.1-alpine
WORKDIR /app
COPY . .
RUN npm i

EXPOSE 8080

CMD ["node", "index.js"]
