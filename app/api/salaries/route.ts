import { NextResponse } from "next/server";
import { createSalarySubmission, listSalaries } from "@/lib/salaries/service";
import { salaryQuerySchema, salarySubmissionSchema } from "@/lib/salaries/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = salaryQuerySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters", details: parsed.error.flatten() }, { status: 400 });
  }

  const salaries = await listSalaries(parsed.data);
  return NextResponse.json({ data: salaries });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = salarySubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid salary submission", details: parsed.error.flatten() }, { status: 400 });
  }

  const salary = await createSalarySubmission(parsed.data);
  return NextResponse.json({ data: salary }, { status: 201 });
}
