import { NextResponse } from "next/server";
import { createSalarySubmission } from "@/lib/salaries/service";
import { salaryIngestSchema } from "@/lib/salaries/validation";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = salaryIngestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid salary submission",
        details: parsed.error.flatten()
      },
      { status: 422 }
    );
  }

  try {
    const salary = await createSalarySubmission(parsed.data);

    return NextResponse.json(
      {
        data: {
          id: salary.id,
          company_display: salary.company,
          company_normalized: salary.normalizedCompany,
          role: salary.role,
          level: salary.level,
          location: salary.location,
          experience_years: salary.experienceYears,
          base_salary: salary.baseSalary,
          bonus: salary.bonus,
          stock: salary.stock,
          total_compensation: salary.totalCompensation,
          confidence_score: salary.confidenceScore,
          created_at: salary.createdAt
        }
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Unable to save salary submission" }, { status: 500 });
  }
}
