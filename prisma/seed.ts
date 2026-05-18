import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type SalarySeedRecord = {
  company: string;
  role: string;
  level: "L3" | "L4" | "L5";
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  confidence_score: number;
};

const salaryRecords: SalarySeedRecord[] = [
  {
    company: "google",
    role: "Software Engineer",
    level: "L3",
    location: "Bengaluru, India",
    experience_years: 2,
    base_salary: 2800000,
    bonus: 350000,
    stock: 900000,
    confidence_score: 0.86
  },
  {
    company: "google",
    role: "Software Engineer",
    level: "L4",
    location: "Hyderabad, India",
    experience_years: 5,
    base_salary: 4400000,
    bonus: 650000,
    stock: 1800000,
    confidence_score: 0.9
  },
  {
    company: "google",
    role: "Senior Software Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experience_years: 8,
    base_salary: 7000000,
    bonus: 1200000,
    stock: 3500000,
    confidence_score: 0.88
  },
  {
    company: "amazon",
    role: "Software Development Engineer I",
    level: "L3",
    location: "Bengaluru, India",
    experience_years: 2,
    base_salary: 2100000,
    bonus: 300000,
    stock: 600000,
    confidence_score: 0.82
  },
  {
    company: "amazon",
    role: "Software Development Engineer II",
    level: "L4",
    location: "Hyderabad, India",
    experience_years: 4,
    base_salary: 3400000,
    bonus: 550000,
    stock: 1200000,
    confidence_score: 0.85
  },
  {
    company: "amazon",
    role: "Senior Software Development Engineer",
    level: "L5",
    location: "Chennai, India",
    experience_years: 7,
    base_salary: 5600000,
    bonus: 900000,
    stock: 2400000,
    confidence_score: 0.84
  },
  {
    company: "microsoft",
    role: "Software Engineer",
    level: "L3",
    location: "Noida, India",
    experience_years: 2,
    base_salary: 2400000,
    bonus: 300000,
    stock: 700000,
    confidence_score: 0.83
  },
  {
    company: "microsoft",
    role: "Software Engineer II",
    level: "L4",
    location: "Hyderabad, India",
    experience_years: 5,
    base_salary: 3900000,
    bonus: 600000,
    stock: 1400000,
    confidence_score: 0.89
  },
  {
    company: "microsoft",
    role: "Senior Software Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experience_years: 8,
    base_salary: 6200000,
    bonus: 1000000,
    stock: 3000000,
    confidence_score: 0.87
  },
  {
    company: "uber",
    role: "Software Engineer I",
    level: "L3",
    location: "Bengaluru, India",
    experience_years: 2,
    base_salary: 3000000,
    bonus: 400000,
    stock: 1200000,
    confidence_score: 0.8
  },
  {
    company: "uber",
    role: "Software Engineer II",
    level: "L4",
    location: "Hyderabad, India",
    experience_years: 5,
    base_salary: 4800000,
    bonus: 700000,
    stock: 2200000,
    confidence_score: 0.84
  },
  {
    company: "uber",
    role: "Senior Software Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experience_years: 8,
    base_salary: 7800000,
    bonus: 1300000,
    stock: 4200000,
    confidence_score: 0.82
  },
  {
    company: "flipkart",
    role: "Software Development Engineer I",
    level: "L3",
    location: "Bengaluru, India",
    experience_years: 2,
    base_salary: 2300000,
    bonus: 250000,
    stock: 500000,
    confidence_score: 0.79
  },
  {
    company: "flipkart",
    role: "Software Development Engineer II",
    level: "L4",
    location: "Bengaluru, India",
    experience_years: 5,
    base_salary: 3800000,
    bonus: 500000,
    stock: 1100000,
    confidence_score: 0.82
  },
  {
    company: "flipkart",
    role: "Senior Software Development Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experience_years: 8,
    base_salary: 5800000,
    bonus: 850000,
    stock: 2200000,
    confidence_score: 0.8
  }
];

const salaries: Prisma.SalaryCreateManyInput[] = salaryRecords.map((record) => ({
  ...record,
  company: record.company.trim().toLowerCase(),
  total_compensation: record.base_salary + record.bonus + record.stock
}));

async function main() {
  await prisma.salary.deleteMany();

  const result = await prisma.salary.createMany({
    data: salaries
  });

  console.log(`Seeded ${result.count} salaries.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed salaries.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
