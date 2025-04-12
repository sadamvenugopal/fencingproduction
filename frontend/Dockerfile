# Stage 1: Build the Angular app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project and build the Angular app
COPY . .

# Build the Angular project (replace `your-project-name` with the actual Angular project name from angular.json)
RUN npm run build -- --configuration=production

# Stage 2: Serve the app using Nginx
FROM nginx:1.25-alpine

# Copy built Angular app from the builder stage
COPY --from=builder /app/dist/fencing/browser /usr/share/nginx/html

# Copy custom Nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
