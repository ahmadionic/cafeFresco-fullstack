FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Use npx to build inside container
RUN npx vite build

EXPOSE 3000
CMD ["npm", "run", "preview"]  # or "start" if custom server
