import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: { _count: { select: { questions: true, users: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(companies);
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return Response.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, industry } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: { name, description, industry },
    });

    return Response.json(company, { status: 201 });
  } catch (error) {
    console.error("Failed to create company:", error);
    return Response.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
