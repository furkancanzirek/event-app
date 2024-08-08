import EventPurchaseButton from "@/app/(main)/components/EventPurchaseButton";
import EventListAttendees from "@/app/(main)/components/EventListAttendees";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { formatDate } from "@/libs/utils";
import { reserveEventTicket } from "@/app/actions/reserveEventAction";
import { CountdownTimer } from "../../components/EventCountdownTimer";
import { headers as getHeaders } from "next/headers";

interface EventDetailPageProps {
  eventId: string;
}

export default async function EventDetailPage({
  params,
}: {
  params: { eventId: string };
}) {
  const session = await getServerSession(authOptions);
  const headers: HeadersInit = getHeaders();
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/events/${params.eventId}?userId=${session?.user.id}`,
    {
      headers: new Headers(headers),
    }
  );
  let { event, isReserved, ttl, reservedCount, isPurchased, paymentId } =
    await data.json();

  return (
    <div className="bg-white">
      <div className="px-4 py-8 mx-auto sm:px-6 sm:py-20 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="relative overflow-hidden bg-gray-100 rounded-lg h-56 lg:h-96 aspect-h-3 aspect-w-4">
              <Image
                src={event.imageUrl}
                alt="Event"
                className="sticky top-0 object-cover object-center"
                fill
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {event.title}
                </h1>

                <h2 id="information-heading" className="sr-only">
                  Event information
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Date:{" "}
                  <time dateTime={event.date} className="font-medium">
                    {formatDate(event.date)}
                  </time>
                </p>
              </div>
            </div>

            <p className="mt-6 text-gray-500">{event.description}</p>
            <p className="text-3xl tracking-tight text-gray-900 font-semibold py-4">
              {event.price} TRY
            </p>
            {isReserved && <CountdownTimer initialSeconds={ttl || 900} />}
            <div className="my-4">
              <form action={reserveEventTicket}>
                <input type="hidden" name="eventId" value={event._id} />
                <input type="hidden" name="userId" value={session?.user.id} />
                <EventPurchaseButton
                  isReserved={isReserved}
                  isPurchased={isPurchased}
                  paymentId={paymentId}
                  eventId={event._id}
                  className="w-full"
                  event={event}
                />
              </form>
            </div>

            <div className="pt-10 mt-10 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                Event Highlights
              </h3>
              <EventListAttendees event={event} reservedCount={reservedCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
