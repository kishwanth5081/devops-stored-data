# Multi-Stage Dockerfile for DevOps Stored Data
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

# Install native dependencies required for better-sqlite3 build
RUN apk add --no-cache python3 make g++ sqlite

# Install backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend assets from stage 1 into backend public
COPY --from=frontend-builder /app/backend/public ./backend/public

# Create data and uploads directories with permissions
RUN mkdir -p /app/backend/data /app/backend/uploads && \
    addgroup -g 1001 -S nodejs && \
    adduser -S devops -u 1001 && \
    chown -R devops:nodejs /app

USER devops

ENV NODE_ENV=production
ENV PORT=5000
ENV DB_PATH=/app/backend/data/devops_stored.sqlite
ENV UPLOADS_DIR=/app/backend/uploads

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "backend/src/server.js"]
