FROM node:20-alpine

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD ["node", "backend/app.js"]