# Stage 1: Build React app
FROM node:20-alpine AS builder

# Set working dir
WORKDIR /app

# Copy package.json and package-lock.json / yarn.lock
COPY package*.json ./
# or if using yarn
# COPY yarn.lock package.json ./

# Install deps
RUN npm install --frozen-lockfile

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy build result to nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (opsional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]