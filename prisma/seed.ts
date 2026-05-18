import { PrismaClient, type Level, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type SalarySeedRecord = {
  company: string;
  role: string;
  level: Level;
  location: string;
  experienceYears: number;
  baseSalary: number;
  bonus: number;
  stock: number;
  confidenceScore: number;
};

const salaryRecords: SalarySeedRecord[] = [
  {
    company: "google",
    role: "Software Engineer",
    level: "L3",
    location: "Bengaluru, India",
    experienceYears: 2,
    baseSalary: 2800000,
    bonus: 350000,
    stock: 900000,
    confidenceScore: 0.86
  },
  {
    company: "google",
    role: "Software Engineer",
    level: "L4",
    location: "Hyderabad, India",
    experienceYears: 5,
    baseSalary: 4400000,
    bonus: 650000,
    stock: 1800000,
    confidenceScore: 0.9
  },
  {
    company: "google",
    role: "Senior Software Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experienceYears: 8,
    baseSalary: 7000000,
    bonus: 1200000,
    stock: 3500000,
    confidenceScore: 0.88
  },
  {
    company: "amazon",
    role: "Software Development Engineer I",
    level: "L3",
    location: "Bengaluru, India",
    experienceYears: 1.5,
    baseSalary: 2100000,
    bonus: 300000,
    stock: 600000,
    confidenceScore: 0.82
  },
  {
    company: "amazon",
    role: "Software Development Engineer II",
    level: "L4",
    location: "Hyderabad, India",
    experienceYears: 4,
    baseSalary: 3400000,
    bonus: 550000,
    stock: 1200000,
    confidenceScore: 0.85
  },
  {
    company: "amazon",
    role: "Senior Software Development Engineer",
    level: "L5",
    location: "Chennai, India",
    experienceYears: 7,
    baseSalary: 5600000,
    bonus: 900000,
    stock: 2400000,
    confidenceScore: 0.84
  },
  {
    company: "microsoft",
    role: "Software Engineer",
    level: "L3",
    location: "Noida, India",
    experienceYears: 2,
    baseSalary: 2400000,
    bonus: 300000,
    stock: 700000,
    confidenceScore: 0.83
  },
  {
    company: "microsoft",
    role: "Software Engineer II",
    level: "L4",
    location: "Hyderabad, India",
    experienceYears: 5,
    baseSalary: 3900000,
    bonus: 600000,
    stock: 1400000,
    confidenceScore: 0.89
  },
  {
    company: "microsoft",
    role: "Senior Software Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experienceYears: 8,
    baseSalary: 6200000,
    bonus: 1000000,
    stock: 3000000,
    confidenceScore: 0.87
  },
  {
    company: "uber",
    role: "Software Engineer I",
    level: "L3",
    location: "Bengaluru, India",
    experienceYears: 2,
    baseSalary: 3000000,
    bonus: 400000,
    stock: 1200000,
    confidenceScore: 0.8
  },
  {
    company: "uber",
    role: "Software Engineer II",
    level: "L4",
    location: "Hyderabad, India",
    experienceYears: 5,
    baseSalary: 4800000,
    bonus: 700000,
    stock: 2200000,
    confidenceScore: 0.84
  },
  {
    company: "uber",
    role: "Senior Software Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experienceYears: 8,
    baseSalary: 7800000,
    bonus: 1300000,
    stock: 4200000,
    confidenceScore: 0.82
  },
  {
    company: "flipkart",
    role: "Software Development Engineer I",
    level: "L3",
    location: "Bengaluru, India",
    experienceYears: 2,
    baseSalary: 2300000,
    bonus: 250000,
    stock: 500000,
    confidenceScore: 0.79
  },
  {
    company: "flipkart",
    role: "Software Development Engineer II",
    level: "L4",
    location: "Bengaluru, India",
    experienceYears: 5,
    baseSalary: 3800000,
    bonus: 500000,
    stock: 1100000,
    confidenceScore: 0.82
  },
  {
    company: "flipkart",
    role: "Senior Software Development Engineer",
    level: "L5",
    location: "Bengaluru, India",
    experienceYears: 8,
    baseSalary: 5800000,
    bonus: 850000,
    stock: 2200000,
    confidenceScore: 0.8
  }
];

const salarySubmissions: Prisma.SalarySubmissionCreateManyInput[] = salaryRecords.map((record) => ({
  ...record,
  normalizedCompany: record.company.toLowerCase(),
  totalCompensation: record.baseSalary + record.bonus + record.stock
}));

async function main() {
  await prisma.salarySubmission.deleteMany();

  const result = await prisma.salarySubmission.createMany({
    data: salarySubmissions
  });

  console.log(`Seeded ${result.count} salary submissions.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed salary submissions.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
