import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // Xóa cookie
  response.cookies.set("jwt-access-token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
