import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { modules, companyContext } = body;

    const data: Record<string, unknown> = {};
    if (modules !== undefined) data.modules = modules;
    if (companyContext !== undefined) data.companyContext = companyContext;

    const company = await prisma.company.update({
      where: { id },
      data,
    });

    return Response.json(company);
  } catch (error) {
    console.error("Failed to update company modules:", error);
    return Response.json(
      { error: "Failed to update company modules" },
      { status: 500 }
    );
  }
}
