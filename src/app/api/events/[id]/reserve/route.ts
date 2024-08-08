import { connectDB } from "@/libs/mongodb";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import redis from "@/libs/redis";
import { URL } from "url";
import Payment from "@/models/Payment";
import { logMiddleware } from "@/libs/log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await logMiddleware(request, body);
    const { userId } = body;
    const url = new URL(request.url);
    const eventId = url.pathname.split("/")[3];

    if (!eventId || !userId) {
      return NextResponse.json(
        { message: "Missing eventId or userId" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const payment = new Payment({
      userId,
      eventId,
      amount: event.price,
      cardLast4Digits: "",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await payment.save();
    await redis.sadd(`event:${eventId}:reservations`, userId);
    await redis.expire(`event:${eventId}:reservations`, 900);

    return NextResponse.json(
      { message: "User reserved the event successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error reserving event:", error);
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { eventId, title, date, location, description } =
      await request.json();

    await logMiddleware(request, {
      eventId,
      title,
      date,
      location,
      description,
    });

    const eventToUpdate = await Event.findById(eventId);

    if (!eventToUpdate) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (title) {
      eventToUpdate.title = title;
    }

    if (date) {
      eventToUpdate.date = date;
    }

    if (location) {
      eventToUpdate.location = location;
    }

    if (description) {
      eventToUpdate.description = description;
    }

    await eventToUpdate.save();

    return NextResponse.json(
      {
        message: "Event updated successfully",
        updatedEvent: {
          id: eventToUpdate._id,
          title: eventToUpdate.title,
          date: eventToUpdate.date,
          location: eventToUpdate.location,
          description: eventToUpdate.description,
          createdAt: eventToUpdate.createdAt,
          updatedAt: eventToUpdate.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest) {
  try {
  
    await connectDB();

    const { eventId } = await request.json();
    await logMiddleware(request, { eventId });
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    await event.remove();

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.error();
  }
}
