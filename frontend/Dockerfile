FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build frontend
RUN npx vite build

EXPOSE 3000
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]  # preview mode for container
