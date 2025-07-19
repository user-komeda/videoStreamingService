FROM ghcr.io/user-komeda/docker_node:sha-7b65646@sha256:50422fcfb8c922abcde11dac975ed4d570068438cdb916899010287e03de1b80 AS base

FROM base AS builder
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=frontend --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /out/json/ .
RUN corepack enable
RUN corepack install -g yarn@stable
RUN yarn install
COPY --from=builder /out/full/ .
RUN yarn build


FROM base AS runner
WORKDIR /app
RUN corepack enable
RUN corepack install -g yarn@stable
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=installer /app/apps/frontend/build/ /app/build/
COPY --from=installer /app/apps/frontend/package.json /app/
COPY --from=installer /app/node_modules /app/node_modules/
CMD ["npm","start"]