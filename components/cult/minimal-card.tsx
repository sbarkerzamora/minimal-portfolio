// Source: https://www.cult-ui.com/r/minimal-card.json
// Registry composition retained; semantic colors and media sizing adapted.
import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const MinimalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card p-2 text-card-foreground shadow-sm transition-colors",
      className
    )}
    {...props}
  />
))
MinimalCard.displayName = "MinimalCard"

const MinimalCardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src: string; alt: string }
>(({ className, src, alt, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mb-6 h-48 w-full overflow-hidden rounded-lg",
      className
    )}
    {...props}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 600px, 100vw"
      className="object-cover"
    />
  </div>
))
MinimalCardImage.displayName = "MinimalCardImage"

const MinimalCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "px-1 text-xl leading-tight font-semibold tracking-tight",
      className
    )}
    {...props}
  />
))
MinimalCardTitle.displayName = "MinimalCardTitle"

const MinimalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "px-1 text-sm leading-relaxed text-muted-foreground",
      className
    )}
    {...props}
  />
))
MinimalCardDescription.displayName = "MinimalCardDescription"

const MinimalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
MinimalCardContent.displayName = "MinimalCardContent"

const MinimalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
MinimalCardFooter.displayName = "MinimalCardFooter"

export {
  MinimalCard,
  MinimalCardImage,
  MinimalCardTitle,
  MinimalCardDescription,
  MinimalCardContent,
  MinimalCardFooter,
}
export default MinimalCard
