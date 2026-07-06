import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary: "bg-[#2563eb] text-white hover:bg-blue-700",
  secondary: "bg-white/70 text-slate-900 hover:bg-white",
  ghost: "bg-white/25 text-slate-700 hover:bg-white/55",
};

export function GlassButton({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: GlassButtonProps) {
  const classes = `glass-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
