import Banner from "@/app/components/ui/Banner";
import EventList from "./components/EventList";
import EventHeader from "./components/EventHeader";

const Home = async () => {
  return (
    <div>
      <Banner
        title="Discount on every ticket purchase"
        description="Get 50% off on your ticket purchase"
      />
      <EventHeader title="Events" />
      <EventList />
    </div>
  );
};

export default Home;
