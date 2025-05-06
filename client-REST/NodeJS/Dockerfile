# syntax=docker/dockerfile:1

ARG NODE_VERSION=23.1.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Install openssl package
RUN apk add --no-cache openssl

# Install devDependencies to support build.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the source files.
COPY . .

# Run the build script.
RUN npm run build

# Generate self-signed certificates.
RUN npm run gen-crt

################################################################################
# Create a new stage to run the application with minimal runtime dependencies.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Create necessary directories and set permissions.
RUN mkdir -p /usr/src/app/asic && chown -R node:node /usr/src/app/asic


# Copy package.json for runtime npm usage.
COPY package.json .

# Copy the production dependencies and built files.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/certs ./certs

# Ensure correct ownership of certs
RUN chown -R node:node ./certs

# Run the application as a non-root user.
USER node

# Expose the port.
EXPOSE 3001

# Start the application.
CMD npm start