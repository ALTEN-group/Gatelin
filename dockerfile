ARG NODE_VERSION=24.11.0-alpine3.22

FROM node:${NODE_VERSION} AS deps
WORKDIR /usr/src/app
ARG UID=1000
# ARG NPMRC_PATH=/root/.npmrc
# RUN --mount=type=secret,id=npmrc,target=${NPMRC_PATH},required=true,uid=${UID} \
#   npm install --include=dev --ignore-scripts --no-fund --no-audit --loglevel=error

COPY package*.json ./
RUN npm install --include=dev --ignore-scripts --no-fund --no-audit --loglevel=error

FROM node:${NODE_VERSION} AS runtime

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

ARG TZ=UTC
ENV TZ=${TZ}

ARG UID=1000
ARG GID=1000
RUN addgroup -S appgroup -g ${GID} \
  && adduser -S -G appgroup -u ${UID} appuser

WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=appuser:appgroup package*.json ./
COPY --chown=appuser:appgroup ./src ./src

USER appuser
EXPOSE 3000

CMD ["node", "--run", "dev"]