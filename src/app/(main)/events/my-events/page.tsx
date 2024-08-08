import { getServerSession } from "next-auth";
import Banner from "@/app/components/ui/Banner";
import MyEvents from "@/app/(main)/components/MyEvents";
import EventHeader from "../../components/EventHeader";

const Home = async () => {
  return (
    <div>
      <Banner
        title="Discount on every ticket purchase"
        description="Get 50% off on your ticket purchase"
      />
      <EventHeader title="My Events" />

      <MyEvents />
    </div>
  );
};

export default Home;
