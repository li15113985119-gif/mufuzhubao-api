#!/bin/sh
set -eu

cd /app/apps/api

if [ -z "${DATABASE_URL:-}" ] && [ -n "${PGHOST:-}" ]; then
  echo "Building DATABASE_URL from CloudBase PostgreSQL variables..."
  DATABASE_URL=$(node -e 'const u=new URL("postgresql://localhost");u.username=encodeURIComponent(process.env.PGUSER||"");u.password=encodeURIComponent(process.env.PGPASSWORD||"");u.hostname=process.env.PGHOST||"localhost";u.port=process.env.PGPORT||"5432";u.pathname="/"+(process.env.PGDATABASE||"postgres");u.searchParams.set("schema","public");u.searchParams.set("sslmode",process.env.PGSSLMODE||"require");process.stdout.write(u.toString())')
  export DATABASE_URL
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required."
  exit 1
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy

if [ "${AUTO_SEED:-false}" = "true" ]; then
  echo "Seeding CloudBase database..."
  npx tsx prisma/seed.ts
fi

echo "Starting API on port ${PORT:-3000}..."
exec node dist/main.js
