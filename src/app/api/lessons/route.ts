import { lessons, getModules } from "@/lib/lessons-data";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const moduleSlug = request.nextUrl.searchParams.get("module");

  const modules = getModules();

  if (moduleSlug) {
    const filtered = lessons.filter((l) => l.moduleSlug === moduleSlug);
    return Response.json({ modules, lessons: filtered });
  }

  return Response.json({ modules, lessons });
}
