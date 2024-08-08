import React from "react";
import { cn } from "@/libs/utils";

interface EventHeaderProps {
  title: string;
  className?: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({ title, className }) => {
  return (
    <div
      className={cn(
        "max-w-2xl px-4 py-6 mx-auto sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8",
        className
      )}
    >
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        {title}
      </h2>
    </div>
  );
};

export default EventHeader;
