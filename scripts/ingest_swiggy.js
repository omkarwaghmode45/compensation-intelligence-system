const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  const payload = {
    company: 'Swiggy',
    role: 'Software Engineer',
    level: 'L4',
    location: 'Bengaluru, India',
    experience_years: 4,
    base_salary: 3500000,
    bonus: 400000,
    stock: 800000,
    confidence: 85
  };

  try {
    // normalize: lowercase + trim
    const normalizedCompany = payload.company.trim().toLowerCase();
    const bonus = payload.bonus ?? 0;
    const stock = payload.stock ?? 0;
    const total_compensation = payload.base_salary + bonus + stock;

    console.log('Normalized company:', normalizedCompany);
    console.log('Computed total_compensation:', total_compensation);

    const created = await prisma.salary.create({
      data: {
        company: normalizedCompany,
        role: payload.role,
        level: payload.level,
        location: payload.location,
        experience_years: Math.round(payload.experience_years),
        base_salary: payload.base_salary,
        bonus,
        stock,
        total_compensation,
        confidence_score: Math.min(1, Math.max(0, (payload.confidence ?? 75) > 1 ? (payload.confidence ?? 75) / 100 : payload.confidence ?? 0.75))
      }
    });

    console.log('Created salary id:', created.id);

    const found = await prisma.salary.findUnique({ where: { id: created.id } });
    console.log('Found record:', found);

    const companies = await prisma.salary.groupBy({
      by: ['company'],
      _count: { _all: true },
      _avg: { total_compensation: true },
      orderBy: { _avg: { total_compensation: 'desc' } }
    });

    console.log('Companies (grouped):', companies.map(c => ({ company: c.company, submissions: c._count._all, avg: Math.round(c._avg.total_compensation ?? 0) })));

    const comparable = await prisma.salary.findMany({ take: 10, orderBy: { total_compensation: 'desc' } });
    console.log('Top salaries (ids & company):', comparable.slice(0, 10).map(s => ({ id: s.id, company: s.company, level: s.level, total: s.total_compensation })));

  } catch (err) {
    console.error('Error during script:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
