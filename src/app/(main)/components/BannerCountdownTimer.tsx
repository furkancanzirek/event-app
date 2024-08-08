"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useCountdownTimer } from "@/app/hooks/useCountdownTimer";

interface CountdownTimerProps {
  initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds }) => {
  const { minutes, seconds, isLoading } = useCountdownTimer(initialSeconds);
  const router = useRouter();
  const isToasted = useRef(false);

  useEffect(() => {
    if (!isLoading && minutes === 0 && seconds === 0 && !isToasted.current) {
      isToasted.current = true;
      toast.error("Your reservation time has expired!");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [minutes, seconds, isLoading, router]);

  if (isLoading || initialSeconds <= 0) {
    return null;
  }

  return (
    <span className="text-sm text-gray-500">
      Reservation will be held for {minutes} minutes and {seconds} seconds.
    </span>
  );
};

export default CountdownTimer;
