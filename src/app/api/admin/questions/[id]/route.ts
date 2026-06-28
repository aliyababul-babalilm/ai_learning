import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { isApproved, text, category, orderIndex } = body;

    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(isApproved !== undefined && { isApproved }),
        ...(text !== undefined && { text }),
        ...(category !== undefined && { category }),
        ...(orderIndex !== undefined && { orderIndex }),
      },
    });

    return Response.json(question);
  } catch (error) {
    console.error("Failed to update question:", error);
    return Response.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.question.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete question:", error);
    return Response.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
