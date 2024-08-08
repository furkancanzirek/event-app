import Image from "next/image";
import Link from "next/link";
import EventDetails from "./EventListDetails";
import EventAttendees from "./EventListAttendees";
import { Event } from "@/types/Event";
import EventPurchaseButton from "./EventPurchaseButton";
import EventQrCodeButton from "./EventQrCodeButton";

interface EventListCardProps {
  event: Event;
  isPurchased?: boolean;
  reservedEvents?: Event[];
  isMyEventsPage?: boolean;
}

const EventListCard: React.FC<EventListCardProps> = ({
  event,
  reservedEvents,
  isMyEventsPage = false,
}) => {
  const isReserved: boolean = reservedEvents?.find((e) => e._id === event._id)
    ? true
    : false;
  return (
    <div
      key={event._id}
      className="relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg group"
    >
      <div className="relative bg-gray-200 aspect-h-4 aspect-w-3 sm:aspect-none group-hover:opacity-75 h-36 sm:h-56">
        <Link href={`/events/${event._id}`}>
          <Image
            alt="event"
            src={event.imageUrl || ""}
            fill
            className="object-cover object-center w-full h-full transition-all sm:h-full sm:w-full group-hover:scale-105 group-hover:duration-300 group-hover:ease-in-out "
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <EventDetails event={event} />
        <EventAttendees event={event} />
        <div className="flex mt-4 flex-end">
          {isMyEventsPage ? (
            <EventQrCodeButton />
          ) : (
            <EventPurchaseButton
              eventId={event._id}
              isPurchased={isReserved}
              isReserved={isReserved}
              listButton
              size="sm"
              className="ml-auto"
              event={event}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListCard;
