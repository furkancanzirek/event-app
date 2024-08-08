import { connectDB } from "@/libs/mongodb";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Payment from "@/models/Payment";
import Reservation from "@/models/Reservation";
import User from "@/models/User";
import { checkCardValid } from "@/libs/validator";
import redis from "@/libs/redis";
import { logMiddleware } from "@/libs/log";

async function processPayment(paymentDetails: any): Promise<boolean> {
  return checkCardValid(
    paymentDetails.cardNumber,
    paymentDetails.fullName,
    paymentDetails.expiry,
    paymentDetails.cvv
  );
}

async function createReservation(
  userId: mongoose.Types.ObjectId,
  eventId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession
) {
  const reservation = new Reservation({ userId, eventId });
  await reservation.save({ session });
  return reservation;
}

async function updateUser(
  userId: mongoose.Types.ObjectId,
  reservationId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession
) {
  await User.findByIdAndUpdate(
    userId,
    { $push: { reservations: reservationId } },
    { session }
  );
}

async function updateEvent(event: any, session: mongoose.ClientSession) {
  event.seatsOccupied += 1;
  await event.save({ session });
}

async function updatePayment(
  paymentId: mongoose.Types.ObjectId,
  paymentDetails: any,
  paymentResult: boolean,
  session: mongoose.ClientSession
) {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.cardLast4Digits = paymentDetails.cardNumber.slice(-4);
  payment.paymentStatus = paymentResult ? "success" : "failed";
  payment.paymentDate = new Date();

  await payment.save({ session });
  return payment;
}

export async function POST(
  request: NextRequest,
  queries: { params: { id: string } }
) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: paymentId } = queries.params;

    let payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }
    let event = await Event.findById(payment.eventId);

    if (!event) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    const eventId = event.id;

    const { paymentDetails } = await request.json();

    await logMiddleware(request, {
      paymentId,
      paymentDetails,
    });

    if (!paymentDetails) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "User ID and payment details are required" },
        { status: 400 }
      );
    }

    const paymentResult = await processPayment(paymentDetails);
    if (!paymentResult) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "Please check your credit card infos." },
        { status: 400 }
      );
    }
    const userId = payment.userId.toString();
    const existingReservation = await Reservation.findOne({ userId, eventId });
    if (existingReservation) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { message: "User already has a reservation for this event" },
        { status: 400 }
      );
    }

    const reservation = await createReservation(userId, eventId, session);
    await updateUser(userId, reservation._id, session);
    await updateEvent(event, session);

    const objectPaymentId = new mongoose.Types.ObjectId(paymentId);
    const updatedPayment = await updatePayment(
      objectPaymentId,
      paymentDetails,
      paymentResult,
      session
    );

    await redis.srem(`event:${eventId}:reservations`, userId);
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      {
        message: "Payment processed and reservation made successfully",
        reservation: {
          id: reservation._id,
          userId: reservation.userId,
          eventId: reservation.eventId,
          createdAt: reservation.createdAt,
          updatedAt: reservation.updatedAt,
        },
        payment: {
          id: updatedPayment._id,
          amount: updatedPayment.amount,
          cardLast4Digits: updatedPayment.cardLast4Digits,
          paymentStatus: updatedPayment.paymentStatus,
          paymentDate: updatedPayment.paymentDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    await session.abortTransaction();
    session.endSession();
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  queries: { params: { id: string } }
) {
  try {
    await logMiddleware(request);
    const { id: paymentId } = queries.params;

    await connectDB();
    let payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }
    let event = await Event.findById(payment.eventId);

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    event = event.toObject();

    return NextResponse.json(
      {
        payment: {
          id: payment._id,
          userId: payment.userId,
          eventId: payment.eventId,
          amount: payment.amount,
          paymentStatus: payment.paymentStatus,
          createdAt: payment.createdAt,
        },
        event: {
          id: event._id,
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description,
          createdAt: event.createdAt,
          imageUrl: event.imageUrl,
          updatedAt: event.updatedAt,
          price: event.price,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting event:", error);
    return NextResponse.error();
  }
}
