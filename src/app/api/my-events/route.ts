import { connectDB } from "@/libs/mongodb";
import Event from "@/models/Event";
import Reservation from "@/models/Reservation";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import redis from "@/libs/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import User from "@/models/User";
import { logMiddleware } from "@/libs/log";
export async function GET(req: NextRequest) {
  try {
    await logMiddleware(req);
    const session = await getServerSession(authOptions);

    await connectDB();
    const user = await User.findById(session?.user.id);

    const reservations = await Reservation.find({ userId: user._id });
    const events = await Event.find({
      _id: { $in: reservations.map((reservation) => reservation.eventId) },
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.error();
  }
}
export async function POST(req: Request) {
  return NextResponse.json(
    { message: "POST method is not supported" },
    { status: 405 }
  );
}
