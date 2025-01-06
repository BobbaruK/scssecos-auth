FROM node:20-alpine3.17

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Omit --production flag for TypeScript devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

COPY prisma ./prisma
COPY public ./public
COPY src ./src
COPY eslint.config.mjs .
COPY .prettierrc .
COPY components.json .
COPY next.config.ts .
COPY postcss.config.mjs .
COPY tailwind.config.ts .
COPY tsconfig.json .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG TEST_VAR
ENV TEST_VAR=${TEST_VAR}
ARG SECRET_VAR
ENV SECRET_VAR=${SECRET_VAR}
ARG DB_USER
ARG DB_USER=${DB_USER}
ARG DB_PASSWORD
ARG DB_PASSWORD=${DB_PASSWORD}
ARG DB_HOST
ARG DB_HOST=${DB_HOST}
ARG DB_PORT
ARG DB_PORT=${DB_PORT}
ARG DB_NAME
ARG DB_NAME=${DB_NAME}
ARG DATABASE_URL
ARG DATABASE_URL=${DATABASE_URL}
ARG NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD
ARG NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD=${NEXT_PUBLIC_DEFAULT_REGISTER_PASSWORD}
ARG AUTH_SECRET
ARG AUTH_SECRET=${AUTH_SECRET}
ARG AUTH_TRUST_HOST
ARG AUTH_TRUST_HOST=${AUTH_TRUST_HOST}
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ARG GITHUB_CLIENT_SECRET
ARG GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ARG RESEND_API_KEY
ARG RESEND_API_KEY=${RESEND_API_KEY}
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ARG NEXTAUTH_URL
ARG NEXTAUTH_URL=${NEXTAUTH_URL}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

# Build Next.js based on the preferred package manager

RUN npx prisma generate

RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else npm run build; \
  fi


# Start Next.js based on the preferred package manager
CMD \
  if [ -f yarn.lock ]; then yarn start; \
  elif [ -f package-lock.json ]; then npm run start; \
  elif [ -f pnpm-lock.yaml ]; then pnpm start; \
  else npm run start; \
  fi
