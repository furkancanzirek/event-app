"use client";

import CustomDrawer from "@/app/components/ui/Drawer";
import EventQrContent from "./EventQrContent";
import { Event } from "@/types/Event";

const QRCodeButton: React.FC = () => {
  return (
    <CustomDrawer
      buttonText="See Your Ticket"
      drawerContent={<EventQrContent />}
    />
  );
};

export default QRCodeButton;
