FROM ghcr.io/user-komeda/docker_node:sha-7b65646@sha256:50422fcfb8c922abcde11dac975ed4d570068438cdb916899010287e03de1b80 AS base
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
RUN groupadd appgroup && useradd -m -r -g appgroup appuser
COPY --from=installer /app/apps/frontend/build/ /app/build/
COPY --from=installer /app/apps/frontend/package.json /app/
COPY --from=installer /app/node_modules /app/node_modules/
USER appuser
EXPOSE 3000
CMD ["node", "./node_modules/infisicalLauncher/dist/index.cjs", "--path=/videoStreaming/front/", "--", "npm", "start"]
