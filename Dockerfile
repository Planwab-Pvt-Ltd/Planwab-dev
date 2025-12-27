# ---------- Base image ----------
FROM node:22-alpine

# ---------- Set working directory ----------
WORKDIR /app

# ---------- Copy dependency files ----------
COPY package.json package-lock.json* ./

# ---------- Install dependencies (IMPORTANT FIX) ----------
RUN npm install --legacy-peer-deps

# ---------- Copy all source code ----------
COPY . .

# ---------- Build Next.js app ----------
RUN npm run build

# ---------- Expose Next.js default port ----------
EXPOSE 3000

# ---------- Start production server ----------
CMD ["npm", "start"]
