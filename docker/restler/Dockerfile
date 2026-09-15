# Multi-arch RESTler image: extracts architecture-independent managed .NET
# binaries and Python engine from upstream Microsoft image, and runs them on a
# native .NET 8 runtime to avoid Rosetta/QEMU SIGSEGV on Apple Silicon.
FROM --platform=linux/amd64 mcr.microsoft.com/restlerfuzzer/restler:v9.2.4 AS upstream

FROM mcr.microsoft.com/dotnet/runtime:8.0-alpine

ARG UID=1000
ARG GID=1000

RUN apk add --no-cache python3 py3-requests py3-pip curl bash jq && \
    python3 -m pip install --no-cache-dir --break-system-packages applicationinsights

RUN deluser --remove-home node 2>/dev/null || true && \
    addgroup -S usergroup -g ${GID} 2>/dev/null || true && \
    adduser -G usergroup -S -u ${UID} -h /home/user user 2>/dev/null || true

COPY --from=upstream /RESTler /RESTler
RUN chmod -R a+rX /RESTler

ENV DOTNET_ROLL_FORWARD=Major \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=true \
    PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

RUN printf '#!/bin/sh\nexec dotnet /RESTler/restler/Restler.dll "$@"\n' > /usr/local/bin/restler && \
    chmod +x /usr/local/bin/restler

USER user
WORKDIR /work
