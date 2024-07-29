FROM node:20-alpine AS base

RUN apk update && apk add --no-cache bind-tools procps libc6-compat

# ---

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile 

# ---

FROM base AS builder

ARG APP

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN corepack enable && pnpm build ${APP} \
    && pnpm build cookies \
    && pnpm build jwt \
    && pnpm build oauth \
    && pnpm build postgres \
    && pnpm build redis \
    && pnpm build cookies 

# ---

FROM base as runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

EXPOSE 3000