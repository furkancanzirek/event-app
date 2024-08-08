import { useEffect, useRef, useState } from "react";

const calculateTimeLeft = (targetTimestamp: number): [number, number] => {
  const difference = targetTimestamp - Date.now();
  if (difference <= 0) {
    return [0, 0];
  }
  const minutes = Math.floor(difference / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  return [minutes, seconds];
};

export const useCountdownTimer = (initialSeconds: number) => {
  const targetTimestamp = useRef(Date.now() + initialSeconds * 1000).current;
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const updateTimeLeft = () => {
      const [newMinutes, newSeconds] = calculateTimeLeft(targetTimestamp);
      setMinutes(newMinutes);
      setSeconds(newSeconds);
    };

    updateTimeLeft();
    setIsLoading(false);

    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval); 
  }, [targetTimestamp]); 

  return { minutes, seconds, isLoading };
};
