FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx vite build

EXPOSE 3000

# CMD must run in shell form
CMD npx vite preview --host 0.0.0.0 --port 3000
