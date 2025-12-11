# Multi-stage Dockerfile isn't necessary here — single stage installs deps and builds client
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy package files first for caching
COPY package.json package-lock.json* ./

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
