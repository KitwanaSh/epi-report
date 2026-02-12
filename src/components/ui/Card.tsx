import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export default function Card({
  children,
  elevated = false,
  className = "",
  ...props
}: CardProps) {
  const baseClass = elevated ? "card-elevated" : "card";

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}