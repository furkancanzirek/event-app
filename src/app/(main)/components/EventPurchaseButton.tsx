"use client";

import React from "react";
import Button from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/libs/utils";
import { Event } from "@/types/Event";
import { useFormStatus } from "react-dom";

interface EventPurchaseButtonProps {
  isReserved?: boolean;
  isPurchased?: boolean;
  paymentId?: string;
  eventId?: string;
  listButton?: boolean;
  size?: "sm" | "md";
  className?: string;
  event?: Event;
}

const EventPurchaseButton: React.FC<EventPurchaseButtonProps> = ({
  isReserved,
  isPurchased,
  paymentId,
  eventId,
  size = "md",
  className,
  listButton,
  event,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { pending } = useFormStatus();
  const handleNavigateToMyEvents = () => router.push("/events/my-events");
  const handlePayment = () => {
    if (paymentId) {
      router.push(`/payment/${paymentId}`);
    } else {
      router.push(`/events/${eventId}`);
    }
  };
  const handleLogin = () =>
    router.push(`/login/?callbackUrl=/events/${eventId}`);
  if (isPurchased) {
    return (
      <Button
        className={cn("bg-blue-500 hover:bg-blue-700", className)}
        onClick={handleNavigateToMyEvents}
        size={size}
      >
        My Events
      </Button>
    );
  }

  if (isReserved) {
    return (
      <Button
        className={cn("bg-blue-500 hover:bg-blue-700", className)}
        onClick={handlePayment}
        size={size}
      >
        Pay for Reservation
      </Button>
    );
  }
  if (event?.capacity === event?.seatsOccupied) {
    return (
      <Button
        disabled
        className={cn(
          "bg-gray-500 hover:bg-gray-300 disabled:cursor-not-allowed",
          className
        )}
        size={size}
      >
        Sold Out
      </Button>
    );
  }
  if (listButton) {
    return (
      <Button
        className={cn("bg-lightGreen", className)}
        onClick={handlePayment}
        size={size}
      >
        Purchase Ticket
      </Button>
    );
  }
  if (!session) {
    return (
      <Button
        className={cn("bg-lightGreen", className)}
        onClick={handleLogin}
        size={size}
      >
        Sign in to Purchase
      </Button>
    );
  }

  return (
    <Button
      className={cn("bg-lightGreen", className)}
      type="submit"
      size={size}
    >
      {pending ? (
        <div
          className="w-6 h-6 rounded-full animate-spin
                    border-4 border-solid border-white border-t-transparent"
        ></div>
      ) : (
        "Purchase Ticket"
      )}
    </Button>
  );
};

export default EventPurchaseButton;
