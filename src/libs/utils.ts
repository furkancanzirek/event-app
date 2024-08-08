import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
) {

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',  
    day: '2-digit',  
    month: 'long',   
    year: 'numeric',   
    hour: '2-digit',  
    minute: '2-digit',
    hour12: false,    
  };

  const formatOptions = { ...defaultOptions, ...options };
  
  return new Date(date).toLocaleDateString('en-US', formatOptions);
}


