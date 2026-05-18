import { NextResponse } from "next/server";
import { listSalaries } from "@/lib/salaries/service";
import { salaryQuerySchema } from "@/lib/salaries/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = salaryQuerySchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters", details: parsed.error.flatten() }, { status: 400 });
  }

  const salaries = await listSalaries(parsed.data);
  return NextResponse.json({ data: salaries });
}
