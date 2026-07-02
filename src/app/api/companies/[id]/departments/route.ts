import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const departments = await prisma.departmentTemplate.findMany({
      where: { companyId: id },
      include: {
        questions: { orderBy: { orderIndex: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    });
    return Response.json(departments);
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return Response.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, questions } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const department = await prisma.departmentTemplate.create({
      data: {
        companyId: id,
        name,
        questions: questions?.length
          ? {
              create: questions.map(
                (
                  q: {
                    text: string;
                    questionType?: string;
                    options?: string[];
                    category: string;
                    isRequired?: boolean;
                    orderIndex?: number;
                  },
                  i: number
                ) => ({
                  text: q.text,
                  questionType: q.questionType || "text",
                  options: q.options || null,
                  category: q.category,
                  isRequired: q.isRequired ?? true,
                  orderIndex: q.orderIndex ?? i,
                })
              ),
            }
          : undefined,
      },
      include: { questions: { orderBy: { orderIndex: "asc" } } },
    });

    return Response.json(department, { status: 201 });
  } catch (error) {
    console.error("Failed to create department:", error);
    return Response.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
