import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = ({ children, className, hover = true, glow = false, ...props }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass rounded-lg p-6",
        hover && "glass-hover",
        glow && "shadow-neon",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;