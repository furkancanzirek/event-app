"use client";

import { useCountdownTimer } from "@/app/hooks/useCountdownTimer"; 
import Alert from "@/app/components/ui/Alert";
interface CountdownTimerProps {
  initialSeconds: number;
}

export const CountdownTimer = ({ initialSeconds }: CountdownTimerProps) => {
  const { minutes, seconds, isLoading } = useCountdownTimer(initialSeconds);

  return (
    !isLoading&&initialSeconds>0 && (
        
      <Alert
        type="info"
        className="my-3"
        title="Reservation"
        message={`
     You have already reserved this event.
     We will hold your reservation for ${minutes} minutes and ${seconds} seconds`}
      />
    )
  );
};
