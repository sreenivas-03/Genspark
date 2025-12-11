# Multi-stage Dockerfile isn't necessary here — single stage installs deps and builds client
## Multi-stage build

# Builder: install build deps and build client
FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		build-essential \
		python3 \
		make \
		g++ \
		libsqlite3-dev \
	&& rm -rf /var/lib/apt/lists/*
COPY . .
RUN npm ci --no-audit --no-fund
RUN npm run build:client

# Runtime: copy only necessary artifacts and install production deps
FROM node:20-bullseye-slim AS runner
WORKDIR /app

# copy package files and install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --only=production --no-audit --no-fund

# copy server, built client and other necessary files
COPY --from=builder /app/server ./server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/src ./src

ENV NODE_ENV=production
EXPOSE 5000
CMD ["npx","tsx","server/index.ts"]
