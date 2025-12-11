# Multi-stage Dockerfile isn't necessary here — single stage installs deps and builds client
FROM node:20-bullseye-slim

# set working directory
WORKDIR /app

# copy package files first for caching
COPY package.json package-lock.json* ./

# install build tools required for native modules
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		build-essential \
		python3 \
		make \
		g++ \
		libsqlite3-dev \
	&& rm -rf /var/lib/apt/lists/*

# copy rest of repo
COPY . .

# install dependencies (including dev deps needed for build)
RUN npm ci --no-audit --no-fund

# build client
RUN npm run build:client

# copy built client into server static folder
RUN mkdir -p server/public && cp -R dist/public/* server/public/

ENV NODE_ENV=production
EXPOSE 5000

# start server using tsx (installed locally)
CMD ["npx","tsx","server/index.ts"]
