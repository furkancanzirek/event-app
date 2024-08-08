// middleware/logMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import Log from "../models/Log";
import { connectDB } from "@/libs/mongodb";

export async function logMiddleware(req: NextRequest, body?: any) {
  await connectDB();

  const start = Date.now();

  const userId = req.headers.get("x-user-id") || null;
  const ipAddress = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  const logEntry = new Log({
    userId: userId,
    method: req.method,
    url: req.url,
    queryParameters: JSON.stringify(
      Object.fromEntries(req.nextUrl.searchParams)
    ),
    headers: JSON.stringify(Object.fromEntries(req.headers)),
    body: body ? JSON.stringify(body) : "",
    ipAddress: ipAddress,
    userAgent: userAgent,
    createdAt: new Date(),
  });

  let res = NextResponse.next();
  res.headers.set("X-Response-Time", `${Date.now() - start}ms`);

  res = NextResponse.json({ message: "Your response data" });

  logEntry.responseStatus = res.status;
  logEntry.responseBody = JSON.stringify(res.body);
  logEntry.responseTime = `${Date.now() - start}ms`;

  await logEntry.save();

  return res;
}
