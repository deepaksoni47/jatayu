import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "relative flex flex-col gap-6 rounded-xl border py-6 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out will-change-transform",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border/50",
        gradient:
          "bg-gradient-to-br from-card via-card to-card/80 text-card-foreground border-primary/20 shadow-primary/10",
        ocean:
          "bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 text-card-foreground border-cyan-500/30 shadow-cyan-500/20",
        sunset:
          "bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 text-card-foreground border-orange-500/30 shadow-orange-500/20",
        forest:
          "bg-gradient-to-br from-green-500/10 via-teal-500/10 to-cyan-500/10 text-card-foreground border-green-500/30 shadow-green-500/20",
        cosmic:
          "bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 text-card-foreground border-purple-500/30 shadow-purple-500/20",
        glass:
          "bg-gradient-to-br from-white/5 via-white/10 to-white/5 text-card-foreground border-white/20 shadow-white/10 backdrop-blur-md",
      },
      hover: {
        none: "",
        lift: "hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1",
        glow: "hover:shadow-2xl hover:shadow-primary/25",
        float: "hover:-translate-y-2 hover:shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    },
  }
);

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, hover, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, hover }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
