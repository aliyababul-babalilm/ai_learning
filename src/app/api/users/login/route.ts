import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      return Response.json({ error: "No learner found for this email" }, { status: 404 });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyId: user.companyId,
        companyName: user.company?.name || null,
      },
    });
  } catch (error) {
    console.error("Failed to log in learner:", error);
    return Response.json({ error: "Failed to log in" }, { status: 500 });
  }
}
