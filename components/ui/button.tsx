import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
        variant === "secondary" && "border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.1]",
        variant === "ghost" && "text-slate-200 hover:bg-white/[0.07]",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-400",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-5 text-base",
        size === "icon" && "h-10 w-10",
        className
      )}
      {...props}
    />
  );
}
