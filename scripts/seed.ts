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
      text: "What is your role at the company?",
      category: "role",
      orderIndex: 0,
    },
    {
      text: "Which commodities do you primarily trade?",
      category: "products",
      orderIndex: 1,
    },
    {
      text: "What geographies or markets do you focus on?",
      category: "geography",
      orderIndex: 2,
    },
    {
      text: "What publications or data sources do you check daily?",
      category: "sources",
      orderIndex: 3,
    },
    {
      text: "What specific information do you look for in your daily research?",
      category: "research_focus",
      orderIndex: 4,
    },
    {
      text: "Walk us through your typical trading day — what tasks do you perform from market open to close?",
      category: "workflow",
      orderIndex: 5,
    },
    {
      text: "What analysis do you personally conduct vs. receive from analysts?",
      category: "analysis",
      orderIndex: 6,
    },
    {
      text: "What tools or platforms do you currently use?",
      category: "tools",
      orderIndex: 7,
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
    { title: string; description: string; order: number }
  >();
  lessons.forEach((l) => {
    if (!moduleEntries.has(l.moduleSlug)) {
      moduleEntries.set(l.moduleSlug, {
        title: l.moduleTitle,
        description: l.moduleDescription,
        order: l.moduleOrder,
      });
    }
  });

  for (const [slug, meta] of moduleEntries) {
    const mod = await prisma.module.upsert({
      where: { slug },
      update: {
        title: meta.title,
        description: meta.description,
        type: slug === "prompt-engineering" ? "interactive" : slug === "claude-skills" ? "skills" : "setup",
        orderIndex: meta.order,
      },
      create: {
        slug,
        title: meta.title,
        description: meta.description,
        type: slug === "prompt-engineering" ? "interactive" : slug === "claude-skills" ? "skills" : "setup",
        orderIndex: meta.order,
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
