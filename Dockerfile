# Use a Node.js base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the entire app to the container
COPY . .

# Expose port 3001
EXPOSE 3001

# Start the application in development mode with hot-reloading
CMD ["npm", "run", "dev"]
