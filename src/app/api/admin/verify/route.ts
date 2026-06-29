import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.DEVELOPER_PASS;
    
    if (correctPassword && password === correctPassword) {
      return Response.json({ success: true });
    }
    return Response.json({ success: false, error: "Incorrect password" }, { status: 401 });
  } catch (error) {
    return Response.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
