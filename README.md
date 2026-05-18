# Compensation Intelligence System

A production-minded MVP foundation for a Levels.fyi-inspired compensation intelligence platform.

## Stack

- Next.js App Router
- TailwindCSS
- PostgreSQL
- Prisma
- Zod validation

## Features scaffolded

- Salary ingestion API: `POST /api/salaries`
- Salary listing API: `GET /api/salaries`
- Company normalization
- Input validation
- Automatic total compensation calculation
- Missing bonus and stock default to `0`
- Filtering and sorting
- Company insights page
- Salary comparison page

## Local setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies with `npm install`.
3. Generate Prisma client with `npm run db:generate`.
4. Run the first migration with `npm run db:migrate`.
5. Start the app with `npm run dev`.

## Seed demo data

The seed script inserts 15 realistic Indian tech compensation records across Google, Amazon, Microsoft, Uber, and Flipkart for L3, L4, and L5 levels.

```bash
npm run db:seed
```

The seed resets existing salary submissions before inserting demo records, so run it only against a local or disposable development database.

## Example ingestion request

```bash
curl -X POST http://localhost:3000/api/salaries \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google Inc.",
    "role": "Software Engineer",
    "level": "L4",
    "location": "Bengaluru, India",
    "experienceYears": 4,
    "baseSalary": 5500000,
    "bonus": 800000,
    "stock": 1600000,
    "confidenceScore": 0.86
  }'
```
