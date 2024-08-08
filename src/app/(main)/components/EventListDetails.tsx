import Link from "next/link";
import { Event } from "@/types/Event";
import { formatDate } from "@/libs/utils";

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900">
        <Link href={`/events/${event._id}`}>{event.title}</Link>
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        <time dateTime={event.date.toString()} className="font-medium">
          {formatDate(event.date)}
        </time>
      </p>
      <p className="text-sm text-gray-500">{event.location}</p>
      {event.description && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">{event.description}</p>
      )}
      
    </div>
  );
};

export default EventDetails;
