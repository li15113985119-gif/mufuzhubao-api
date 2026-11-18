# 沐-辅助包 API

NestJS + Prisma + PostgreSQL API for the WeChat mini program.

## Render

The repository includes `render.yaml` and a Dockerfile. Configure secret environment variables in Render Dashboard:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_INITIAL_PASSWORD`
- `PUBLIC_BASE_URL`

Health check: `/api/v1/health`
