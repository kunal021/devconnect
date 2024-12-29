import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleChange<T>({
  e,
  data,
  setData,
}: {
  e: React.ChangeEvent<HTMLInputElement>;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
}) {
  const { name, value } = e.target;
  setData({ ...data, [name]: value });
}

export function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
