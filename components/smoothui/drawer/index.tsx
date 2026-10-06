"use client"

import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  Drawer as DrawerPrimitive,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"

/* ------------------------------------------------------------------ */
/*  Animation constants                                                */
/* ------------------------------------------------------------------ */

const BACKDROP_DURATION = 0.2
const STAGGER_BASE_DELAY = 0.12
const STAGGER_CHILD_DELAY = 0.05

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DrawerSide = "top" | "right" | "bottom" | "left"

export interface DrawerProps {
  /** Drawer content */
  children?: React.ReactNode
  /** Additional CSS class names */
  className?: string
  /** Description displayed below the title */
  description?: string
  /** Footer content */
  footer?: React.ReactNode
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void
  /** Whether the drawer is open */
  open?: boolean
  /** The side from which the drawer opens */
  side?: DrawerSide
  /** Title displayed in the drawer header */
  title?: string
  /** Trigger element that opens the drawer */
  trigger?: React.ReactNode
}

/* ------------------------------------------------------------------ */
/*  Stagger child — animates content items in sequence after open      */
/* ------------------------------------------------------------------ */

const StaggerChild = ({
  children,
  className,
  index,
  shouldReduceMotion,
}: {
  children: React.ReactNode
  className?: string
  index: number
  shouldReduceMotion: boolean | null
}) => (
  <motion.div
    className={className}
    animate={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 1, transform: "translateY(0px)" }
    }
    initial={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 0, transform: "translateY(6px)" }
    }
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            bounce: 0,
            delay: STAGGER_BASE_DELAY + index * STAGGER_CHILD_DELAY,
            duration: 0.25,
            type: "spring" as const,
          }
    }
  >
    {children}
  </motion.div>
)

/* ------------------------------------------------------------------ */
/*  Drawer                                                             */
/* ------------------------------------------------------------------ */

export default function Drawer({
  open,
  onOpenChange,
  side = "bottom",
  title,
  description,
  className,
  children,
  trigger,
  footer,
}: DrawerProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <DrawerPrimitive
      direction={side}
      handleOnly
      onOpenChange={onOpenChange}
      open={open}
    >
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}

      {/*
        Vaul owns the overlay and focus trap. Its content is not a scroll
        container: Vaul extends it outside its visible bounds while dragging.
        Only the inner body can scroll.
      */}
      <DrawerContent className={cn("min-h-0 overflow-hidden", className)}>
        <motion.div
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          animate={{ opacity: 1 }}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : BACKDROP_DURATION }}
        >
          {title || description ? (
            <StaggerChild index={0} shouldReduceMotion={shouldReduceMotion}>
              <DrawerHeader>
                {title ? <DrawerTitle>{title}</DrawerTitle> : null}
                {description ? (
                  <DrawerDescription>{description}</DrawerDescription>
                ) : null}
              </DrawerHeader>
            </StaggerChild>
          ) : null}

          {children ? (
            <StaggerChild
              className="flex min-h-0 flex-1 flex-col"
              index={title || description ? 1 : 0}
              shouldReduceMotion={shouldReduceMotion}
            >
              <div className="min-h-0 flex-1 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain px-4 [-webkit-overflow-scrolling:touch]">
                {children}
              </div>
            </StaggerChild>
          ) : null}

          {footer ? (
            <StaggerChild
              index={(title || description ? 1 : 0) + (children ? 1 : 0)}
              shouldReduceMotion={shouldReduceMotion}
            >
              <DrawerFooter>{footer}</DrawerFooter>
            </StaggerChild>
          ) : null}
        </motion.div>
      </DrawerContent>
    </DrawerPrimitive>
  )
}

/* ------------------------------------------------------------------ */
/*  Re-exports                                                         */
/* ------------------------------------------------------------------ */

export {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
}
