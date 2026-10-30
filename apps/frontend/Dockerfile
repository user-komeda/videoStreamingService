FROM ghcr.io/user-komeda/docker_node:sha-79897d5@sha256:e61f8ea86e1ca9c598bcec2163cdf0adeb0418b26deb08b637ef4d42bafe79a0 AS base
WORKDIR /app


FROM base AS builder
COPY . .
RUN corepack enable && yarn dlx turbo prune --scope=frontend --docker


FROM base AS installer
RUN microdnf install -y git openssh-clients && \
    microdnf clean all && \
    mkdir -p -m 0700 ~/.ssh && \
    ssh-keyscan -H github.com >> ~/.ssh/known_hosts
RUN corepack enable
COPY --from=builder /app/out/json/ .
RUN --mount=type=ssh yarn install --immutable
COPY --from=builder /app/out/full/ .
RUN --mount=type=secret,id=infisical_client_id,env=LOCAL_INFISICAL_CLIENT_ID,required=false \
    --mount=type=secret,id=infisical_client_secret,env=LOCAL_INFISICAL_CLIENT_SECRET,required=false \
    --mount=type=secret,id=infisical_project_id,env=LOCAL_INFISICAL_PROJECT_ID,required=false \
    yarn build


# apps/frontend/Dockerfile (runner ステージ)
FROM base AS runner
RUN corepack enable
COPY --from=installer /app/apps/frontend/build/ /app/build/
COPY --from=installer /app/apps/frontend/package.json /app/
COPY --from=installer /app/node_modules /app/node_modules/
USER 1001:1001
EXPOSE 3000
CMD ["node", "./node_modules/infisicalLauncher/dist/index.cjs", "--path=/videoStreaming/front/", "--", "npm", "start"]
