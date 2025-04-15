# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
 COPY . .

# Expose the backend port
EXPOSE 3002

# Start the backend
CMD ["node", "server.js"]
