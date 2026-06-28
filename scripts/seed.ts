import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { lessons } from "../src/lib/lessons-data";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create Visa Commodities company
  const company = await prisma.company.upsert({
    where: { name: "Visa Commodities" },
    update: {},
    create: {
      name: "Visa Commodities",
      description:
        "Visa Commodities is a commodities trading firm. We are training their traders who specialize in various commodity markets including energy, metals, and agricultural products.",
      industry: "Commodities Trading",
    },
  });
  console.log("Created company:", company.name);

  // 2. Create pre-approved questions for Visa Commodities
  const questions = [
    {
      text: "What commodities do you primarily trade? (e.g., crude oil, natural gas, gold, wheat, etc.)",
      category: "job_context",
      orderIndex: 0,
    },
    {
      text: "What geographies or markets do you focus on?",
      category: "job_context",
      orderIndex: 1,
    },
    {
      text: "What publications, news sources, or data feeds do you read daily for market research?",
      category: "research",
      orderIndex: 2,
    },
    {
      text: "What specific information do you look for in your daily research? (e.g., price movements, supply/demand data, geopolitical events)",
      category: "research",
      orderIndex: 3,
    },
    {
      text: "Describe your typical trading day — what tasks do you perform from market open to close?",
      category: "workflow",
      orderIndex: 4,
    },
    {
      text: "What analysis or research do you personally conduct vs. receive from analysts?",
      category: "research",
      orderIndex: 5,
    },
    {
      text: "What software, platforms, or tools do you currently use in your trading workflow?",
      category: "tools",
      orderIndex: 6,
    },
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: {
        id: `seed-${q.orderIndex}`,
      },
      update: {
        text: q.text,
        category: q.category,
        orderIndex: q.orderIndex,
        isApproved: true,
      },
      create: {
        id: `seed-${q.orderIndex}`,
        companyId: company.id,
        text: q.text,
        category: q.category,
        orderIndex: q.orderIndex,
        isApproved: true,
      },
    });
  }
  console.log("Created", questions.length, "questions");

  // 3. Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@babalilm-ai.com" },
    update: { role: "admin" },
    create: {
      email: "admin@babalilm-ai.com",
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Created admin user:", admin.email);

  // 4. Seed modules and lessons
  const moduleMap = new Map<string, string>();

  // Get unique modules from lesson data
  const moduleEntries = new Map<
    string,
    { title: string; type: string; orderIndex: number }
  >();
  lessons.forEach((l, i) => {
    if (!moduleEntries.has(l.moduleSlug)) {
      moduleEntries.set(l.moduleSlug, {
        title: l.moduleTitle,
        type: l.moduleType,
        orderIndex: l.moduleSlug === "prompt-engineering" ? 0 : 1,
      });
    }
  });

  for (const [slug, meta] of moduleEntries) {
    const mod = await prisma.module.upsert({
      where: { slug },
      update: {
        title: meta.title,
        type: meta.type,
        orderIndex: meta.orderIndex,
      },
      create: {
        slug,
        title: meta.title,
        description:
          slug === "prompt-engineering"
            ? "Master six essential prompt engineering techniques with hands-on practice."
            : "Configure Claude Desktop as your personal AI workspace.",
        type: meta.type,
        orderIndex: meta.orderIndex,
      },
    });
    moduleMap.set(slug, mod.id);
  }
  console.log("Created", moduleEntries.size, "modules");

  // Create lessons
  for (let i = 0; i < lessons.length; i++) {
    const l = lessons[i];
    const moduleId = moduleMap.get(l.moduleSlug)!;

    await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: {
        title: l.title,
        description: l.description,
        content: JSON.parse(JSON.stringify(l.steps)),
        orderIndex: i,
      },
      create: {
        moduleId,
        slug: l.slug,
        title: l.title,
        description: l.description,
        content: JSON.parse(JSON.stringify(l.steps)),
        orderIndex: i,
      },
    });
  }
  console.log("Created", lessons.length, "lessons");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
