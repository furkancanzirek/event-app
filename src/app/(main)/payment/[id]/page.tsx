import EventHeader from "../../components/EventHeader";
import PayForm from "../components/PayForm";
import { Event } from "@/types/Event";
import { Payment } from "@/types/Payment";
import { headers as getHeaders } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import BannerCountdownTimer from "@/app/(main)/components/BannerCountdownTimer";
import Banner from "@/app/components/ui/Banner";
import redis from "@/libs/redis";
import { redirect } from "next/navigation";

export default async function PaymentPage({
  params: { id },
}: {
  params: { id: string };
}) {
  let headers: HeadersInit = getHeaders();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${id}`, {
    headers: new Headers(headers),
    next: {
      revalidate: 600,
      tags: ["Event"],
    },
  });

  if (!res.ok) {
    redirect("/");
  }

  const { payment, event }: { payment: Payment; event: Event } =
    await res.json();

  if (!event || !payment) {
    redirect("/");
  }
  const ttl = await redis.ttl(`event:${event.id}:reservations`);

  return (
    <div className="bg-white">
      {ttl > 0 && (
        <div className="pb-12">
          <Banner
            title="Your ticket is reserved"
            description={<BannerCountdownTimer initialSeconds={ttl} />}
          />
        </div>
      )}
      <main className="relative grid grid-cols-1 mx-auto max-w-7xl gap-x-16 lg:grid-cols-2 p-4 md:p-6 lg:p-8">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-10"
        >
          <EventHeader
            className="mt-0 mb-6 border-b pb-6 text-xl"
            title="Checkout"
          />
          <div className="max-w-2xl mx-auto">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <dl className="flex justify-between mb-6">
              <dt className="text-sm font-medium">Amount due</dt>
              <dd className="text-3xl font-bold tracking-tight text-black">
                {event.price} TRY
              </dd>
            </dl>

            <div key={event.id} className="flex items-start py-6 space-x-4">
              <div className="w-20 h-20 relative flex-none">
                <Link href={`/events/${event.id}`}>
                  <Image
                    alt={event.imageAlt || event.title}
                    src={event.imageUrl || "/images/event.jpg"}
                    fill
                    className="object-cover object-center rounded-md"
                  />
                </Link>
              </div>
              <div className="flex-auto space-y-1">
                <h3>{event.title}</h3>
                <p className="text-sm line-clamp-3">{event.description}</p>
              </div>
              <p className="flex-none text-base font-medium">
                {event.price} TRY
              </p>
            </div>

            <dl className="pt-6 space-y-6 text-sm font-medium border-t border-gray-200">
              <div className="flex items-center justify-between pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">{payment.amount} TRY</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="bg-white rounded-lg  p-6 md:p-8 lg:p-10 mt-8 lg:mt-0"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Payment and shipping details
          </h2>

          <PayForm paymentId={id} />
        </section>
      </main>
    </div>
  );
}
