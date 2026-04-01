# ----------- BUILD -----------
FROM node:22-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# ✅ Install native libs needed for sharp + AVIF support on Alpine
RUN apk add --no-cache libc6-compat vips-dev fftw-dev gcc g++ make python3

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# ✅ Rebuild sharp natively against the Alpine vips libs after install
RUN npm rebuild sharp

COPY . .
RUN npm run build


# ----------- RUN -----------
FROM node:22-alpine
WORKDIR /app

# ✅ Runtime also needs vips libs — sharp loads them dynamically at runtime
RUN apk add --no-cache vips-dev fftw-dev

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["sh", "-c", "node server.js"]

