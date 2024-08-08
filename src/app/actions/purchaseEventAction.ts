"use server";

import { revalidatePath, revalidateTag } from "next/cache";

interface PurchaseEventTicketData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  fullName: string;
  paymentId: string;

  address: string;
  city: string;
  region: string;
  postalCode: string;
}

interface SafeActionResult<T = unknown, S = unknown> {
  success: boolean;
  error?: string;
  result?: T;
  schema?: S;
}

export async function purchaseEventTicket(formData: PurchaseEventTicketData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/${formData.paymentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentDetails: {
            cardNumber: formData.cardNumber,
            expiry: formData.expiry,
            cvv: formData.cvv,
            fullName: formData.fullName,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      return { success: false, error: errorMessage };
    }

    const responseData = await response.json();

    revalidatePath(`/payment/${formData.paymentId}`);
    revalidateTag("Event");

    return { success: true, result: responseData };
  } catch (error) {
    console.error("Error details:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return { success: false, error: errorMessage };
  }
}
