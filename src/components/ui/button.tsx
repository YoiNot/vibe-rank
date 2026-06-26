import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-border/60",
        ghost: "hover:bg-secondary/60 text-foreground",
        outline:
          "border border-border/70 bg-transparent hover:bg-secondary/40 text-foreground",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/90 glow-accent",
        link: "text-primary underline-offset-4 hover:underline px-0 py-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs rounded-md",
        lg: "h-12 px-7 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
      }>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size }), child.props.className),
      });
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
