# Base image
FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root workspace files
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./

# Copy the app package.json
COPY apps/contract-listener/package.json ./apps/contract-listener/

# Install dependencies
RUN pnpm install

# Development stage
FROM base as development

# Copy app source for development
COPY apps/contract-listener ./apps/contract-listener

# Install ts-node-dev globally
RUN npm install -g ts-node-dev

WORKDIR /app/apps/contract-listener

# Expose port
EXPOSE 3000

# Start the app in development mode
CMD ["ts-node-dev", "--respawn", "--transpile-only", "src/main.ts"]

# Production stage
FROM base AS production

# Set node environment
ENV NODE_ENV=production

# Copy source for production build
COPY apps/contract-listener ./apps/contract-listener

# Build the app
RUN cd apps/contract-listener && pnpm run build

# Start the app
CMD ["node", "apps/contract-listener/dist/main.ts"] 