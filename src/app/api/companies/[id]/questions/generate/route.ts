import { prisma } from "@/lib/db";
import { generateQuestions } from "@/lib/ai";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const company = await prisma.company.findUnique({ where: { id } });

    if (!company) {
      return Response.json({ error: "Company not found" }, { status: 404 });
    }

    const generated = await generateQuestions(
      company.name,
      company.description || "",
      company.industry || ""
    );

    const maxOrder = await prisma.question.aggregate({
      where: { companyId: id },
      _max: { orderIndex: true },
    });

    const startIndex = (maxOrder._max.orderIndex ?? -1) + 1;

    const questions = await Promise.all(
      generated.map((q, i) =>
        prisma.question.create({
          data: {
            companyId: id,
            text: q.text,
            category: q.category,
            orderIndex: startIndex + i,
            isApproved: false,
          },
        })
      )
    );

    return Response.json(questions, { status: 201 });
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return Response.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
