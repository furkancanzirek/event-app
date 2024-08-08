import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import Log from "@/models/Log";

// GET handler
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    if (!session?.user) {
      return NextResponse.json({ message: "No user found" }, { status: 200 });
    }
    const logs = await Log.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { logs },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ message: "POST method is not supported" }, { status: 405 });
}
