import React from "react";
import { cn } from "@/libs/utils";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean; 
};

const sizes = {
  sm: "py-2 px-4 text-sm",
  md: "py-3 px-6 text-base",
  lg: "py-4 px-8 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  className = "",
  onClick,
  children,
  size = "md",
  disabled = false, 
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "flex items-center justify-center text-base font-medium text-white bg-lightGreen border border-transparent rounded-md hover:bg-lightGreen focus:outline-none focus:ring-2",
        sizes[size],
        className,
        {
          "bg-gray-500 cursor-not-allowed": disabled,
          "hover:bg-gray-300": disabled,
        }
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
