import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * CVA-based variants, matching the shadcn/ui authoring convention so registry
 * components and these share one API surface.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2.5 whitespace-nowrap",
    "font-body text-[0.8125rem] font-medium uppercase tracking-[0.14em]",
    "rounded-none cursor-pointer select-none",
    "transition-[background-color,color,border-color,opacity] duration-200 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-45",
  ].join(" "),
  {
    variants: {
      variant: {
        solid: "bg-abyss text-horizon hover:bg-tide",
        outline:
          "border border-haze/50 text-abyss hover:border-abyss hover:bg-abyss hover:text-horizon",
        ghost: "text-abyss hover:text-fairway-ink",
        /* For placement on dark sections. */
        inverse: "bg-horizon text-abyss hover:bg-fairway-light",
        outlineInverse:
          "border border-horizon/35 text-horizon hover:border-horizon hover:bg-horizon hover:text-abyss",
      },
      size: {
        sm: "h-10 px-5",
        md: "h-12 px-7",
        lg: "h-14 px-9",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  readonly children: ReactNode;
}

export function Button({
  className,
  variant,
  size,
  children,
  type = "button",
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonVariantProps {
  readonly children: ReactNode;
}

/** Same visual treatment, correct semantics when the target is a navigation. */
export function ButtonLink({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonLinkProps): React.JSX.Element {
  return (
    <a className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </a>
  );
}
