FROM oven/bun:1.2.17-slim AS base
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json bun.lock .env ./
COPY prisma ./prisma
COPY src ./src

# install dependencies
RUN bun install --frozen-lockfile --production --ignore-scripts && \
    bunx prisma generate && \
    rm .env bun.lock package.json && rm -rf prisma

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
