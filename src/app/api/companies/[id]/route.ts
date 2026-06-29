import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { orderIndex: "asc" } },
        users: {
          include: {
            responses: true,
            progress: {
              include: { lesson: { include: { module: true } } },
              orderBy: { updatedAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!company) {
      return Response.json({ error: "Company not found" }, { status: 404 });
    }

    return Response.json(company);
  } catch (error) {
    console.error("Failed to fetch company:", error);
    return Response.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, description, industry } = body;

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(industry !== undefined && { industry }),
      },
    });

    return Response.json(company);
  } catch (error) {
    console.error("Failed to update company:", error);
    return Response.json(
      { error: "Failed to update company" },
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
    await prisma.company.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete company:", error);
    return Response.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
