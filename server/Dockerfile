# Production Node backend using Node 22 Alpine
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4500

# Install dependencies (only production dependencies)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4500

# Run as non-root user for security
USER node

CMD ["node", "src/index.js"]
