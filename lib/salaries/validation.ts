import { z } from "zod";

export const levelSchema = z.enum(["L3", "L4", "L5", "L6", "L7"]);

const moneySchema = z.coerce.number().int().min(0).max(10_000_000);

export const salarySubmissionSchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  level: levelSchema,
  location: z.string().trim().min(1).max(120).optional(),
  experienceYears: z.coerce.number().min(0).max(60).optional(),
  baseSalary: moneySchema,
  bonus: moneySchema.optional().default(0),
  stock: moneySchema.optional().default(0),
  confidenceScore: z.coerce.number().min(0).max(1).optional().default(0.75)
});

export const salaryIngestSchema = z
  .object({
    company: z.string().trim().min(1).max(120),
    role: z.string().trim().min(1).max(120),
    level: levelSchema,
    location: z.string().trim().min(1).max(120).optional(),
    experience_years: z.coerce.number().min(0).max(60).optional(),
    base_salary: moneySchema,
    bonus: moneySchema.optional().default(0),
    stock: moneySchema.optional().default(0),
    // Accept either `confidence_score` (0-1) or `confidence` (0-100) from external ingestors
   confidence_score: z.coerce.number().min(0).max(1).optional(),

confidence: z.coerce.number().min(0).max(100).optional(),

  })
  .transform((input) => ({
    company: input.company.trim().toLowerCase(),
    role: input.role,
    level: input.level,
    location: input.location,
    experienceYears: input.experience_years ? Math.round(input.experience_years) : undefined,
    baseSalary: input.base_salary,
    bonus: input.bonus,
    stock: input.stock,
    // normalize confidence: prefer `confidence_score` (0-1), fall back to `confidence` (0-100)
    confidenceScore: (() => {
      const score = input.confidence_score ?? input.confidence;
      if (score === undefined || score === null) return 0.75;
      // if value looks like a percent (0-100), convert to 0-1
      return score > 1 ? Math.min(1, score / 100) : Math.max(0, Math.min(1, score));
    })()
  }));

export const salaryQuerySchema = z.object({
  company: z.string().trim().optional(),
  role: z.string().trim().optional(),
  level: levelSchema.optional(),
  location: z.string().trim().optional(),
  minExperience: z.coerce.number().min(0).optional(),
  maxExperience: z.coerce.number().min(0).optional(),
  sort: z
    .enum([
      "totalCompensation:desc",
      "totalCompensation:asc",
      "baseSalary:desc",
      "baseSalary:asc",
      "experienceYears:desc",
      "experienceYears:asc",
      "createdAt:desc"
    ])
    .optional()
});

export type SalarySubmissionInput = z.infer<typeof salarySubmissionSchema>;
export type SalaryIngestInput = z.infer<typeof salaryIngestSchema>;
export type SalaryQueryInput = z.infer<typeof salaryQuerySchema>;
