import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { cn } from "@/libs/utils";

type AlertProps = {
  title: string;
  message: string;
  type?: "info" | "warning" | "error";
  className?: string;
};

const alertTypes = {
  info: "bg-blue-50 text-blue-800",
  warning: "bg-yellow-50 text-yellow-800",
  error: "bg-red-50 text-red-800",
  default: "bg-blue-50 text-blue-800",
};

export default function Alert({ title, message, type ,className}: AlertProps) {
  return (
    <div className={cn("rounded-md p-4", alertTypes[type ?? "default"],className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <HiOutlineExclamationTriangle
            aria-hidden="true"
            className={cn("h-5 w-5", alertTypes[type ?? "default"])}
          />
        </div>
        <div className="ml-3">
          <h3 
            className={cn("text-sm font-medium text-start", alertTypes[type ?? "default"])}
          >{title}</h3>
          <div 
            className={cn("mt-2 text-sm", alertTypes[type ?? "default"])}
          >
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
