ARG NODE_VERSION
FROM node:${NODE_VERSION}

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

# Install system dependencies
RUN apk update && apk add postgresql-client tzdata 

ARG TZ
ENV TZ=${TZ}

# Create a new simple user 
ARG UID
ARG GID
RUN deluser --remove-home node && addgroup -S usergroup -g ${GID} && adduser -G usergroup -S user -u ${UID}
USER user

COPY --chown=user:usergroup libs/ /usr/src/libs

WORKDIR /usr/src/app
COPY --chown=user:usergroup --chmod=640 ./package*.json ./

RUN npm i --loglevel=error --ignore-scripts --no-fund

# CMD [ "node", "--run", "start" ]
CMD [ "node", "--run", "dev" ]