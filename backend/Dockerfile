# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy service account key file
COPY ./path/to/credentials.json /app/credentials.json
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json

# Set file permissions
RUN chmod 644 /app/credentials.json

# Copy the rest of your code
COPY . .

# Expose the backend port
EXPOSE 3002

# Start the backend
CMD ["node", "server.js"]
