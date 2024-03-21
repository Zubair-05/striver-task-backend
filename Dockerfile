# Base image for Node.js application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g typescript
# RUN npm install typescript
# Copy remaining application files
COPY . .

# Build the application (adjust for your build process)
RUN tsc -b

# Expose port 3000 (adjust if needed)
EXPOSE 3000

# Start the Node.js application
CMD ["node", "dist/index.js"]
