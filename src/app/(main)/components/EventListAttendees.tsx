import Image from "next/image";
import { Event } from "@/types/Event";
interface EventAttendeesProps {
  event: Event;
  reservedCount?: number;
}

const EventAttendees = ({ event, reservedCount=0 }: EventAttendeesProps) => {
  return (
    <div className="flex items-center my-3">
      {[...Array(event.seatsOccupied > 4 ? 4 : event.seatsOccupied)].map(
        (_, index) => {
          const gender = Math.random() > 0.5 ? "male" : "female";
          return (
            <Image
              key={index}
              src={`https://xsgames.co/randomusers/avatar.php?g=${gender}&${
                Date.now() + index
              }`}
              alt="avatar"
              width={32}
              height={32}
              sizes="32px"
              className="-mr-3 rounded-full"
            />
          );
        }
      )}
      <span className="ml-6 text-sm font-normal text-gray-500">
        {event.seatsOccupied} People attending{" "}
        {reservedCount > 0 && `and ${reservedCount} seats reserved`}
      </span>
    </div>
  );
};

export default EventAttendees;
