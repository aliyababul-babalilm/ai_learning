import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const questions = await prisma.question.findMany({
      where: { companyId: id },
      orderBy: { orderIndex: "asc" },
    });
    return Response.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return Response.json(
      { error: "Failed to fetch questions" },
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
    const { text, category, orderIndex = 0, isApproved = false } = body;

    if (!text || !category) {
      return Response.json(
        { error: "Text and category are required" },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        companyId: id,
        text,
        category,
        orderIndex,
        isApproved,
      },
    });

    return Response.json(question, { status: 201 });
  } catch (error) {
    console.error("Failed to create question:", error);
    return Response.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
