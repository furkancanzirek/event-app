import EventCard from "./EventListCard";
import { Event } from "@/types/Event";
import { headers as getHeaders } from "next/headers";
interface EventListResponse {
  events: Event[];
  reservedEvents: Event[];
}
const EventList: React.FC = async () => {
  const headers: HeadersInit = getHeaders();
  console.log(process.env.NEXT_PUBLIC_API_URL);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      headers: new Headers(headers),
      next: {
        revalidate: 600,
        tags: ["Event"],
      },
    });
    const data: EventListResponse = await response.json();
    const { events, reservedEvents } = data;

    return (
      <div className="bg-white">
        <div className="max-w-2xl px-4 py-6 mx-auto sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Events</h2>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                reservedEvents={reservedEvents}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
  }
};

export default EventList;
