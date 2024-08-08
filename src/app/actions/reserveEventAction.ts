"use server";

import { revalidatePath } from "next/cache";

export async function reserveEventTicket(formData: FormData) {
  try {
    const eventId = formData.get("eventId") as string;
    const userId = formData.get("userId") as string;
    
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/reserve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );


    revalidatePath(`/events/${eventId}`);

    return { success: true, message: "Ticket reserved successfully" };
  } catch (error) {
    console.error("Error purchasing ticket:", error);
    return { success: false, message: "Failed to reserve ticket" };
  }
}
