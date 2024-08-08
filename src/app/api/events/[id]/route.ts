import { connectDB } from "@/libs/mongodb";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import redis from "@/libs/redis";
import Reservation from "@/models/Reservation";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import Payment from "@/models/Payment";
import { logMiddleware } from "@/libs/log";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await logMiddleware(request);
    const session = await getServerSession(authOptions);

    await connectDB();
    const eventId = params.id;

    const userId = session?.user?.id;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID or User ID is missing." },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId).sort({ date: -1 });

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }
    const reservedCount = await redis.scard(`event:${eventId}:reservations`);
    if (!userId || userId === "undefined") {
      return NextResponse.json({ event, reservedCount });
    }

    const redisValue = await redis.sismember(
      `event:${eventId}:reservations`,
      userId
    );

    const ttl = await redis.ttl(`event:${eventId}:reservations`);

    const isReserved = redisValue === 1;

    const isPurchased = await Reservation.findOne({ eventId, userId });

    const payment = await Payment.findOne({ eventId, userId });
    
    if (isReserved) {
      return NextResponse.json({
        event,
        isReserved,
        ttl,
        reservedCount,
        isPurchased,
        paymentId: payment?._id,
      });
    } else {
      return NextResponse.json({
        event,
        isReserved,
        reservedCount,
        isPurchased,
        paymentId: payment?._id,
      });
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    await logMiddleware(request);
    await connectDB();

    const { title, date, location, description, availableSeats, capacity } =
      await request.json();

    if (!title || !date || !location) {
      return NextResponse.json(
        { message: "Title, date, and location are required" },
        { status: 400 }
      );
    }

    const event = new Event({
      title,
      date,
      location,
      description,
      capacity,
      availableSeats,
    });

    const savedEvent = await event.save();

    return NextResponse.json(
      {
        id: savedEvent._id,
        title: savedEvent.title,
        date: savedEvent.date,
        location: savedEvent.location,
        description: savedEvent.description,
        createdAt: savedEvent.createdAt,
        updatedAt: savedEvent.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { eventId, title, date, location, description } =
      await request.json();

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
    await logMiddleware(request);
    await connectDB();

    const { eventId } = await request.json();

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
