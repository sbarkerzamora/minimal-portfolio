"use client"

// Source: https://www.cult-ui.com/r/dither-image.json
// Published figure/frame/content/reveal composition using dither-plugin.
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type HTMLAttributes,
} from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

export type DitherSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
const classes: Record<DitherSize, string> = {
  xs: "dither-xs",
  sm: "dither-sm",
  md: "dither-md",
  lg: "dither-lg",
  xl: "dither-xl",
  "2xl": "dither-2xl",
}
type Vars = CSSProperties & {
  "--dither-gray"?: number
  "--dither-contrast"?: number
  "--dither-bright"?: number
  "--dither-blur"?: string
  "--dither-opacity"?: number
}
const FrameContext = createContext({ invertOnDark: false })

export const DitherImage = forwardRef<HTMLElement, ComponentProps<"figure">>(
  function DitherImage({ className, ...props }, ref) {
    return (
      <figure
        ref={ref}
        data-slot="dither-image"
        className={cn("inline-flex flex-col gap-3", className)}
        {...props}
      />
    )
  }
)

interface FrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  size?: DitherSize
  aspectRatio?: "square" | "video" | "portrait" | "wide"
  grayscale?: number
  contrast?: number
  brightness?: number
  blur?: number
  opacity?: number
  rounded?: boolean | string
  invertOnDark?: boolean
  style?: Vars
}

export const DitherImageFrame = forwardRef<HTMLDivElement, FrameProps>(
  function DitherImageFrame(
    {
      className,
      size = "lg",
      aspectRatio,
      grayscale,
      contrast,
      brightness,
      blur,
      opacity,
      rounded = true,
      invertOnDark = false,
      style,
      ...props
    },
    ref
  ) {
    const vars: Vars = { ...style }
    if (grayscale !== undefined) vars["--dither-gray"] = grayscale
    if (contrast !== undefined) vars["--dither-contrast"] = contrast
    if (brightness !== undefined) vars["--dither-bright"] = brightness
    if (blur !== undefined) vars["--dither-blur"] = `${blur}px`
    if (opacity !== undefined) vars["--dither-opacity"] = opacity
    if (aspectRatio)
      vars.aspectRatio = {
        square: "1 / 1",
        video: "16 / 9",
        portrait: "3 / 4",
        wide: "21 / 9",
      }[aspectRatio]
    const frame = (
      <div
        ref={ref}
        data-slot="dither-image-frame"
        className={cn(
          classes[size],
          "relative block w-full",
          rounded === true ? "rounded-xl" : rounded || undefined,
          className
        )}
        style={vars}
        {...props}
      />
    )
    return (
      <FrameContext value={{ invertOnDark }}>
        {invertOnDark ? <div className="dark:invert">{frame}</div> : frame}
      </FrameContext>
    )
  }
)

export const DitherImageContent = forwardRef<HTMLImageElement, ImageProps>(
  function DitherImageContent({ className, alt, ...props }, ref) {
    const context = useContext(FrameContext)
    return (
      <Image
        ref={ref}
        alt={alt}
        data-slot="dither-image-content"
        className={cn(
          "block size-full object-cover",
          context.invertOnDark && "dark:invert",
          className
        )}
        {...props}
      />
    )
  }
)

export const DitherImageReveal = forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(function DitherImageReveal({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="dither-image-reveal"
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  )
})

export const DitherImageOverlay = forwardRef<
  HTMLImageElement,
  ImageProps & { direction?: "l" | "r" | "t" | "b"; from?: number; to?: number }
>(function DitherImageOverlay(
  { direction = "r", from = 0, to = 65, className, style, alt, ...props },
  ref
) {
  const axis = { l: "left", r: "right", t: "top", b: "bottom" }[direction]
  const maskImage = `linear-gradient(to ${axis}, black ${Math.min(from, to)}%, transparent ${Math.max(from, to)}%)`
  return (
    <Image
      ref={ref}
      alt={alt}
      data-slot="dither-image-overlay"
      className={cn(
        "pointer-events-none absolute inset-0 size-full object-cover",
        className
      )}
      style={{ maskImage, WebkitMaskImage: maskImage, ...style }}
      {...props}
    />
  )
})

export const DitherImageCaption = forwardRef<
  HTMLElement,
  ComponentProps<"figcaption">
>(function DitherImageCaption({ className, ...props }, ref) {
  return (
    <figcaption
      ref={ref}
      className={cn(
        "text-sm leading-relaxed text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
