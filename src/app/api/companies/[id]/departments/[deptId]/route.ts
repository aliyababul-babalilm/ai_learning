import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; deptId: string }> }
) {
  const { deptId } = await params;
  try {
    const body = await request.json();
    const { name, questions, assessmentSections } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (assessmentSections !== undefined) data.assessmentSections = assessmentSections;

    const department = await prisma.departmentTemplate.update({
      where: { id: deptId },
      data,
    });

    // If questions array provided, replace all questions
    if (questions !== undefined) {
      await prisma.departmentQuestion.deleteMany({
        where: { templateId: deptId },
      });
      if (questions.length > 0) {
        await prisma.departmentQuestion.createMany({
          data: questions.map(
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
              templateId: deptId,
              text: q.text,
              questionType: q.questionType || "text",
              options: q.options || null,
              category: q.category,
              isRequired: q.isRequired ?? true,
              orderIndex: q.orderIndex ?? i,
            })
          ),
        });
      }
    }

    const updated = await prisma.departmentTemplate.findUnique({
      where: { id: deptId },
      include: { questions: { orderBy: { orderIndex: "asc" } } },
    });

    return Response.json(updated ?? department);
  } catch (error) {
    console.error("Failed to update department:", error);
    return Response.json(
      { error: "Failed to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; deptId: string }> }
) {
  const { deptId } = await params;
  try {
    await prisma.departmentTemplate.delete({ where: { id: deptId } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete department:", error);
    return Response.json(
      { error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
