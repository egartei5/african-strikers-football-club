FROM node:20-slim

WORKDIR /app

# Install build tools for native modules (better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Expose port
ENV PORT=3001
ENV NODE_ENV=production
EXPOSE 3001

# Start server
CMD ["npm", "start"]
