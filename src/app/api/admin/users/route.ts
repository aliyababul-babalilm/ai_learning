import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        company: true,
        responses: true,
        progress: {
          include: { lesson: { include: { module: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return Response.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
