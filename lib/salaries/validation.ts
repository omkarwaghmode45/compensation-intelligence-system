import { z } from "zod";

export const levelSchema = z.enum(["L3", "L4", "L5", "L6", "L7"]);

const moneySchema = z.coerce.number().int().min(0).max(10_000_000);

export const salarySubmissionSchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  level: levelSchema,
  location: z.string().trim().min(1).max(120),
  experienceYears: z.coerce.number().min(0).max(60),
  baseSalary: moneySchema,
  bonus: moneySchema.optional().default(0),
  stock: moneySchema.optional().default(0),
  confidenceScore: z.coerce.number().min(0).max(1).optional().default(0.75)
});

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
export type SalaryQueryInput = z.infer<typeof salaryQuerySchema>;
