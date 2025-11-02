FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript server
RUN npm run build:server

# Remove devDependencies after build
RUN npm prune --production

# Expose port (Railway will set PORT env var)
EXPOSE 3001

# Start compiled server
CMD ["npm", "start"]
